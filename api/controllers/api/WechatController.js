/**
 * 微信用户接口（绑定、解绑、微信登录等）
 */

var logger = require('../../lib/logger').getLogger('WechatUserController');

module.exports = {
  /**
   * 获取JS-SDK配置信息
   *
   * @param req
   * @param res
   * @param next
     */
  initJsConfig: function (req, res, next) {
    var url = req.headers.referer || req.param('url');
    if (!url) {
      res.badRequest({
        status: 'error',
        message: '权限验证配置失败'
      });
      return;
    }
    WechatService.getJsConfig(url, function (error, result) {
      if (error) {
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          config: result
        }
      });
    });
  },

  /**
   * 微信用户登录
   *
   * @param req
   * @param res
   * @param next
   */
  login: function (req, res, next) {
    var code = req.param('code'); // 微信服务器返回的code
    var state = req.param('state') || '/'; // 跳转地址
    var openId, userId;
    var user;

    if (req.userInfo.USER_ID) {
      res.redirect(state);
      return;
    }
    if (!code) {
      res.redirect(state);
      return;
    }

    async.series([getOpenIdByCode, getUserByOpenId, getUserByUserId, checkUser, saveLoginLog, doLogin], function (error) {
      if (error) {
        logger.info('login error', error);
      }
      res.redirect(state);
    });

    function getOpenIdByCode(callback) {
      WechatService.getOpenIdByCode(code, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        openId = result.openid;
        req.session.openId = openId;
        callback(null);
      });
    }

    function getUserByOpenId(callback) {
      WechatUserService.getUserByOpenId(openId, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        if (!result || !result.userId) {
          callback({
            status: 'error',
            message: '用户未开启免登录'
          });
        } else {
          userId = result.userId;
          callback(null);
        }
      });
    }

    function getUserByUserId(callback) {
      WechatUserService.getUserByUserId(userId, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        user = result;
        callback(null);
      });
    }

    function checkUser(callback) {
      if (user.state == null) {
        callback({
          status: 'error',
          errorCode: -1,
          message: '非法用户'
        });
      } else if (user.state == 0) {
        callback({
          status: 'error',
          errorCode: 0,
          message: '用户已被冻结'
        });
      } else if (user.state == 2) {
        callback({
          status: 'error',
          errorCode: 2,
          message: '黑名单用户不能登录'
        });
      } else if (user.isDelete == 1) {
        callback({
          status: 'error',
          errorCode: -2,
          message: '黑名单用户不能登录'
        });
      } else {
        callback(null);
      }
    }

    function saveLoginLog(callback) {
      var userInfo = _.extend(req.userInfo, user);
      WechatUserService.saveLoginLog(userInfo, function (error) {
        if (error) {
          callback(error);
          return;
        }
        callback();
      });
    }

    function doLogin(callback) {
      var userInfo = _.extend(req.userInfo, {USER_ID: userId});
      UserInfoModels.updateUserInfo(userInfo, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        req.login(result, function (error) {
          if (error) {
            callback({
              status: 'error',
              message: '保存登录状态失败'
            });
            return;
          }
          callback();
        });
      });
    }
  },

  /**
   * 微信用户绑定
   *
   * @param req
   * @param res
   * @param next
   */
  bindUser: function (req, res, next) {
    var username = req.param('username'); // 用户名
    var password = req.param('password'); // 登录密码
    var checkcode = req.param('checkcode'); // 图形验证码

    var openId = req.openId;
    if (!openId) {
      res.badRequest({
        status: 'error',
        errorCode: -1,
        message: '参数无效'
      });
      return;
    }

    var validateObj = {
      username: {
        notEmpty: {
          message: '请输入用户名'
        },
        loginName: {
          message: '用户名格式错误，请重新输入'
        }
      },
      password: {
        notEmpty: {
          message: '请输入密码'
        },
        password: {
          message: '用户名或密码错误，请重新输入'
        }
      }
    };

    if (checkcode) {
      validateObj.checkcode = {
        checkcode: {
          message: '验证码错误，请重新输入'
        },
        customFunction: {
          handler: function () {
            return checkcode.toUpperCase() == req.session.serverCheckcode;
          },
          message: '验证码错误，请重新输入'
        }
      };
    }

    ValidationService.validate(req, validateObj, processRequest);

    function processRequest(validateResult) {
      if (validateResult.status != 'success') {
        res.badRequest(validateResult);
        return;
      }

      var user;
      async.waterfall([verify, updateUserInfo, isBind, doBindUser, doLogin], function (error) {
        if (error) {
          logger.error('bindUser error', error);
          res.badRequest(error);
          return;
        }
        res.ok({
          status: 'success',
          message: '开启微信免登录成功'
        });
      });

      function verify(callback) {
        var loginInfo = {
          ip: req.userInfo.userIp,
          userAgent: req.userInfo.agent,
          username: username,
          password: password,
          serverCheckcode: req.session.serverCheckcode || '',
          userCheckcode: checkcode
        };
        AuthModels.verify(req.userInfo, loginInfo, function (error, result) {
          if (error) {
            callback(error);
            return;
          }
          callback(null, result);
        });
      }

      function updateUserInfo(userInfo, callback) {
        UserInfoModels.updateUserInfo(userInfo, function (error, result) {
          user = result;
          callback(error);
        });
      }

      function isBind(callback) {
        WechatUserService.isBind(username, function (error, result) {
          if (error) {
            callback(error);
            return;
          }
          if (result) {
            callback({
              status: 'error',
              message: '此账号已在其他微信开启免登录，如有疑问请详询客服'
            });
          }
          callback(null);
        });
      }

      function doBindUser(callback) {
        WechatService.getWechatUserByOpenId(openId, function (error, result) {
          if (error) {
            callback(error);
            return;
          }
          WechatUserService.bindUser(result, user.USER_ID, function (error, result) {
            if (error) {
              callback(error);
              return;
            }
            if (!result) {
              callback({
                status: 'error',
                message: '绑定微信公众号失败'
              });
            } else {
              callback(null);
            }
          });
        });
      }

      function doLogin(callback) {
        req.login(user, function (error) {
          if (error) {
            callback({status: 'error', message: '保存登录信息失败'});
            return;
          }
          callback();
        });
      }
    }
  },

  /**
   * 用户解绑
   *
   * @param req
   * @param res
   * @param next
   */
  unbind: function (req, res, next) {
    if (!req.isLogin()) {
      res.unauthorized({
        status: 'error',
        message: '用户未登录'
      });
      return;
    }
    var userId = req.userInfo.USER_ID;
    async.waterfall([getUserByUserId, unbindUser], function (error) {
      if (error) {
        logger.error('unbind error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        message: '微信免登录已关闭'
      });
    });

    function getUserByUserId(callback) {
      WechatUserService.getUserByUserId(userId, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        if (!result || !result.openId) {
          callback({
            status: 'error',
            message: '你尚未绑定'
          });
        } else {
          callback(null, result.openId);
        }
      });
    }

    function unbindUser(openId, callback) {
      WechatUserService.unbindUser(openId, userId, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        if (!result) {
          callback({
            status: 'error',
            message: '关闭微信免登录失败，如有疑问请详询客服。'
          });
        } else {
          callback(null);
        }
      });
    }
  },

  /**
   * 判断当前登录用户是否已经绑定微信
   *
   * @param req
   * @param res
   * @param next
   */
  isBind: function (req, res, next) {
    if (!req.isLogin()) {
      res.unauthorized({
        status: 'error',
        message: '用户未登录'
      });
      return;
    }
    var userId = req.userInfo.USER_ID;
    WechatUserService.getUserByUserId(userId, function (error, result) {
      if (error) {
        logger.error('isBind error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          bind: !!(result && result.openId)
        }
      });
    });
  },

  /**
   * 微信用户注册（注册完自动绑定微信）
   * @param req
   * @param res
   * @param next
   */
  register: function (req, res, next) {
    // TODO
    res.end();
  }

};

/* global AuthModels */
/* global ValidationService */
/* global UserInfoModels */
/* global WechatUserService */
/* global WechatService */
