/**
 * 网店
 */

var logger = require('../../lib/logger').getLogger('OnlineStoreController');

module.exports = {
  /**
   * 我的网店-首页
   *
   * @param req
   * @param res
   * @param next
     */
  general: function (req, res, next) {
    async.parallel({
      customerInfo: getCustomerInfo,
      investInfo: getInvestInfo
    }, function (error, result) {
      if (error) {
        logger.error('general error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          customerInfo: result.customerInfo,
          investInfo: result.investInfo,
          user: req.user
        }
      });
    });

    function getCustomerInfo(callback) {
      OnlineStoreModels.getCustomerInfo(req.userInfo, function (error, result) {
        callback(error, result);
      });
    }

    function getInvestInfo(callback) {
      OnlineStoreModels.getInvestInfo(req.userInfo, function (error, result) {
        callback(error, result);
      });
    }
  },

  /**
   * 我的网店-收入管理
   *
   * @param req
   * @param res
   * @param next
     */
  incomeList: function (req, res, next) {
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 10;
    async.parallel({
      incomeList: getIncomeList
    }, function (error, result) {
      if (error) {
        logger.error('incomeList error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          incomeList: result.incomeList
        }
      });
    });

    function getIncomeList(callback) {
      OnlineStoreModels.getIncomeList(req.userInfo, page, rows, function (error, result) {
        callback(error, result);
      });
    }
  },

  /**
   * 我的网店-收入管理-投资总览
   *
   * @param req
   * @param res
   * @param next
     */
  incomeDetail: function (req, res, next) {
    var month = req.param('month'); // 查询月份 yyyy-mm

    var validateObj = {
      month: {
        date: {
          message: '查询月份错误'
        }
      }
    };

    ValidationService.validate(req, validateObj, processRequest);

    function processRequest(validateResult) {
      if(validateResult.status != 'success') {
        res.badRequest(validateResult);
        return;
      }
      async.parallel({
        zxInvestAmount: zxInvestAmount,
        psInvestAmount: psInvestAmount
      }, function (error, result) {
        if (error) {
          logger.error('incomeDetail error', error);
          res.badRequest(error);
          return;
        }
        res.ok({
          status: 'success',
          data: {
            zxInvestAmount: result.zxInvestAmount,
            psInvestAmount: result.psInvestAmount
          }
        });
      });
    }

    function zxInvestAmount(callback) {
      OnlineStoreModels.zxInvestAmount(req.userInfo, month, month, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        if (result.rows.length > 0) {
          callback(null, result.rows[0]);
        } else {
          logger.error('zxInvestAmount error', result);
          callback({
            status: 'error',
            message: '服务器数据错误'
          });
        }
      });
    }

    function psInvestAmount(callback) {
      OnlineStoreModels.psInvestAmount(req.userInfo, month, month, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        if (result.rows.length > 0) {
          callback(null, result.rows[0]);
        } else {
          logger.error('zxInvestAmount error', result);
          callback({
            status: 'error',
            message: '服务器数据错误'
          });
        }
      });
    }
  },

  /**
   * 我的网店-收入管理-定活通收入详情
   *
   * @param req
   * @param res
   * @param next
     */
  zxInvestList: function (req, res, next) {
    var date = req.param('date'); // 查询时间 yyyy-mm-dd
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 10;

    var validateObj = {
      date: {
        date: {
          message: '查询月份错误'
        }
      }
    };

    ValidationService.validate(req, validateObj, processRequest);

    function processRequest(validateResult) {
      if(validateResult.status != 'success') {
        res.badRequest(validateResult);
        return;
      }
      OnlineStoreModels.zxInvestList(req.userInfo, date, page, rows, function (error, result) {
        if (error) {
          logger.error('zxInvestList error', error);
          res.badRequest(error);
          return;
        }
        res.ok({
          status: 'success',
          data: {
            zxInvestList: result
          }
        });
      });
    }
  },

  /**
   * 我的网店-收入管理-磐石收入详情
   *
   * @param req
   * @param res
   * @param next
   */
  psInvestList: function (req, res, next) {
    var date = req.param('date'); // 查询时间 yyyy-mm-dd
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 10;

    var validateObj = {
      date: {
        date: {
          message: '查询月份错误'
        }
      }
    };

    ValidationService.validate(req, validateObj, processRequest);

    function processRequest(validateResult) {
      if(validateResult.status != 'success') {
        res.badRequest(validateResult);
        return;
      }
      OnlineStoreModels.psInvestList(req.userInfo, date, page, rows, function (error, result) {
        if (error) {
          logger.error('psInvestList error', error);
          res.badRequest(error);
          return;
        }
        res.ok({
          status: 'success',
          data: {
            psInvestList: result
          }
        });
      });
    }
  },

  /**
   * 客户管理-客户列表
   *
   * @param req
   * @param res
   * @param next
     */
  customerList: function (req, res, next) {
    var type = Number(req.param('type')) || 5; // 1本月新增注册 2 本月新增投资客户 3 过去30天到期客户 4 未来30天到期客户 5 全部返回
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 10;

    OnlineStoreModels.customerList(req.userInfo, type, page, rows, function (error, result) {
      if (error) {
        logger.error('customerList error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          customerList: result
        }
      });
    });
  },

  /**
   * 客户管理-搜索用户
   *
   * @param req
   * @param res
   * @param next
   */
  searchCustomer: function (req, res, next) {
    var condition = req.param('condition');
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 5;

    OnlineStoreModels.searchCustomer(req.userInfo, condition, page, rows, function (error, result) {
      if (error) {
        logger.error('searchCustomer error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          customerList: result
        }
      });
    });
  },

  /**
   * 客户管理-详情
   *
   * @param req
   * @param res
   * @param next
     */
  customerInfo: function (req, res, next) {
    var customerId = req.param('customerId');
    if (!customerId) {
      res.badRequest({
        status: 'error',
        message: '参数错误'
      });
      return;
    }
    OnlineStoreModels.customerInfo(req.userInfo, customerId, function (error, result) {
      if (error) {
        logger.error('customerInfo error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          customerInfo: result
        }
      });
    });
  },

  /**
   * 客户管理-客户持有产品
   *
   * @param req
   * @param res
   * @param next
     */
  customerProduct: function (req, res, next) {
    var customerId = req.param('customerId');
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 10;
    if (!customerId) {
      res.badRequest({
        status: 'error',
        message: '参数错误'
      });
      return;
    }
    OnlineStoreModels.customerOperation(req.userInfo, customerId, 1, page, rows, function (error, result) {
      if (error) {
        logger.error('customerProduct error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          customerProduct: result
        }
      });
    });
  },

  /**
   * 客户管理-客户持有卡券
   *
   * @param req
   * @param res
   * @param next
   */
  customerCoupons: function (req, res, next) {
    var customerId = req.param('customerId');
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 10;
    if (!customerId) {
      res.badRequest({
        status: 'error',
        message: '参数错误'
      });
      return;
    }
    OnlineStoreModels.customerOperation(req.userInfo, customerId, 2, page, rows, function (error, result) {
      if (error) {
        logger.error('customerCoupons error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          customerCoupons: result
        }
      });
    });
  },

  /**
   * 客户管理-客户登录信息
   *
   * @param req
   * @param res
   * @param next
   */
  customerLoginInfo: function (req, res, next) {
    var customerId = req.param('customerId');
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 10;
    if (!customerId) {
      res.badRequest({
        status: 'error',
        message: '参数错误'
      });
      return;
    }
    OnlineStoreModels.customerOperation(req.userInfo, customerId, 3, page, rows, function (error, result) {
      if (error) {
        logger.error('customerLoginInfo error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          customerLoginInfo: result
        }
      });
    });
  },

  /**
   * 展业中心-消息设置
   *
   * @param req
   * @param res
   * @param next
     */
  notificationSettings: function (req, res, next) {
    // 如果参数都为空，则读取消息设置； 如果带了参数，则修改消息设置
    var register = req.param('register'); //有新用户注册的时候微信推送  1开 0关
    var firstInvest = req.param('firstInvest'); //客户首次投资的时候微信推送  1开 0关
    var commission = req.param('commission'); //每月佣金到账的时候微信推送  1开 0关

    var notificationSettings = {};

    notificationSettings.register = Number(register);
    notificationSettings.firstInvest = Number(firstInvest);
    notificationSettings.commission = Number(commission);

    if (!register && !firstInvest && !commission) {
      // 如果没有参数传入，则读取消息设置
      OnlineStoreModels.getNotificationSettings(req.userInfo, function (error, result) {
        if (error) {
          logger.error('notificationSettings error', error);
          res.badRequest(error);
          return;
        }
        res.ok({
          status: 'success',
          data: {
            notificationSettings: result
          }
        });
      });
    } else {
      // 如果有参数传入，则修改消息设置
      OnlineStoreModels.setNotification(req.userInfo, notificationSettings, function (error, result) {
        if (error) {
          logger.error('notificationSettings error', error);
          res.badRequest(error);
          return;
        }
        res.ok({
          status: 'success',
          data: {
            notificationSettings: notificationSettings
          }
        });
      });
    }
  },

  /**
   * 展业中心-推广链接
   *
   * @param req
   * @param res
   * @param next
     */
  mobilePromoList: function (req, res, next) {
    async.parallel({
      promoList: getPromoList,
      activityId: getActivities
    }, function (error, result) {
      if (error) {
        logger.error('mobilePromoList error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          promoList: result.promoList,
          activityId: result.activityId,
          user: req.user
        }
      });
    });

    function getPromoList(callback) {
      OnlineStoreModels.mobilePromoList(req.userInfo, function (error, result) {
        callback(error, result);
      });
    }

    function getActivities(callback) {
      OnlineStoreModels.promoActivities(req.userInfo, 2, function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        if (result.total > 0) {
          callback(null, result.rows[0].id);
        } else {
          callback(null);
        }
      });
    }
  },

  /**
   * 展业中心-推广链接（根据id查询）
   *
   * @param req
   * @param res
   * @param next
     */
  mobilePromo: function (req, res, next) {
    var id = req.param('id');
    if (!id) {
      res.badRequest({
        status: 'error',
        message: '参数错误'
      });
      return;
    }
    OnlineStoreModels.mobilePromo(req.userInfo, id, function (error, result) {
      if (error) {
        logger.error('mobilePromo error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          mobilePromo: result,
          user: req.user
        }
      });
    });
  },

  /**
   * 展业中心-推广链接-推广活动
   * @param req
   * @param res
   * @param next
     */
  wechatActivities: function (req, res, next) {
    OnlineStoreModels.promoActivities(req.userInfo, 2, function (error, result) {
      if (error) {
        logger.error('wechatActivities error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          activities: result
        }
      });
    });
  },

  /**
   * 展业中心-我的投资记录（注册天数以及累计投资笔数）
   *
   * @param req
   * @param res
   * @param next
     */
  myInvestInfo: function (req, res, next) {
    var promoUserId = req.param('promoUserId');
    if (!promoUserId) {
      res.badRequest({
        status: 'error',
        message: '参数错误'
      });
      return;
    }
    OnlineStoreModels.myInvestInfo(req.userInfo, promoUserId, function (error, result) {
      if (error) {
        logger.error('myInvestInfo error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          myInvestInfo: result
        }
      });
    });
  },

  /**
   * 业绩排行榜-排行榜类型
   *
   * @param req
   * @param res
     * @param next
     */
  rankTypeList: function (req, res, next) {
    OnlineStoreModels.rankTypeList(req.userInfo, function (error, result) {
      if (error) {
        logger.error('rankTypeList error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          rankTypeList: result
        }
      });
    });
  },

  /**
   * 业绩排行榜
   *
   * @param req
   * @param res
   * @param next
     */
  promoRankList: function (req, res, next) {
    var type = Number(req.param('type')) || 1; // 排行榜类型，根据接口取回
    var page = Number(req.param('page')) || 1;
    var rows = Number(req.param('rows')) || 10;
    OnlineStoreModels.promoRankList(req.userInfo, function (error, result) {
      if (error) {
        logger.error('promoRankList error', error);
        res.badRequest(error);
        return;
      }
      res.ok({
        status: 'success',
        data: {
          promoRankList: result
        }
      });
    });
  }
};

/* global ValidationService */
/* global OnlineStoreModels */
