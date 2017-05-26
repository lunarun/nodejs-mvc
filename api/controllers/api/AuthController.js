/**
 * 用户鉴权
 */

var logger = require('../../lib/logger').getLogger('AuthController');

module.exports = {
  /**
   * 登录接口
   *
   * @param req
   * @param res
   * @param next
     */
  login: function (req, res, next) {
    var username = req.param('username'); // 用户名
    var password = req.param('password'); // 密码
    var checkcode = req.param('checkcode'); // 图形验证码

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
      if(validateResult.status != 'success') {
        res.badRequest(validateResult);
        return;
      }
      async.waterfall([verify, updateUserInfo, doLogin], function (error) {
        if (error) {
          //logger.error('login error', error);
          res.badRequest(error);
          return;
        }
        res.ok({status: 'success', message: '登录成功'});
      });
    }

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
        callback(error, result);
      });
    }

    function doLogin(userInfo, callback) {
      req.login(userInfo, function (error) {
        if (error) {
          callback({status: 'error', message: '登录失败'});
          return;
        }
        callback();
      });
    }

  },

  /**
   * 登出接口
   *
   * @param req
   * @param res
   * @param next
     */
  logout: function (req, res, next) {
    req.logout(function () {
      res.ok({status: 'success', message: '登出成功'});
    });
  },

  /**
   * 判断是否已经登录
   *
   * @param req
   * @param res
   * @param next
     */
  isLogin: function (req, res, next) {
    var login = req.isLogin();
    res.ok({
      status: 'success',
      data: {
        login: login
      }
    });
  },

  /**
   * 获取登录用户信息
   *
   * @param req
   * @param res
   * @param next
     */
  me: function (req, res, next) {
    res.ok({
      status: 'success',
      data: {
        user: req.user
      }
    });
  }
};

/* global ValidationService */
/* global AuthModels */
/* global UserInfoModels */
