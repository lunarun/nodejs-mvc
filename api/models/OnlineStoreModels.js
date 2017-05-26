/**
 * 网店
 */

var logger = require('../lib/logger').getLogger('OnlineStoreModels');

module.exports = {
  /**
   * 客户注册情况
   *
   * @param userInfo
   * @param callback
     */
  getCustomerInfo: function (userInfo, callback) {
    var param = {};
    var serverId = '60000012';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN || !reply.RETURN.result) {
        logger.error('getCustomerInfo error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN.result;
      var customerInfo = {
        clClients: result.CL_CLIENTS,
        clStockBalance: result.CL_STOCK_BALANCE,
        futureEndClients: result.FUTURE_END_CLIENTS,
        investCountMonth: result.INVEST_COUNT_MONTH,
        investCountYear: result.INVEST_COUNT_YEAR,
        mechanism: result.MECHANISM,
        pastEndClients: result.PAST_END_CLIENTS,
        regCountMonth: result.REG_COUNT_MONTH,
        regCountYear: result.REG_COUNT_YEAR,
        totalRegCustomer: result.TOTAL_REG_CUSTOMER
      };
      if (result.TOTAL_INVEST_CUSTOMS) {
        customerInfo.totalCustoms = {
          investTotal: result.TOTAL_INVEST_CUSTOMS.INVESTOR_TOTAL,
          valNum : result.TOTAL_INVEST_CUSTOMS.VAL_NUM
        };
      }
      callback(null, customerInfo);
    });
  },

  /**
   * 客户投资状况
   *
   * @param userInfo
   * @param callback
     */
  getInvestInfo: function (userInfo, callback) {
    var param = {};
    var serverId = '60000015';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN || !reply.RETURN.result) {
        logger.error('getInvestInfo error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN.result;
      var investInfo = {
        commissionDetailsCount: result.COMMISSIONDETAILS_COUNT,
        commissionMonth: result.COMMISSON_MONTH, // 本月佣金收入
        commissionSum: result.COMMISSON_SUM, // 总佣金
        investAmount: result.INVESTAMOUNT, // 投资金额
        sumInvestAmount: result.SUMINVESTAMOUNT, // 总投资金额
        month: result.MONTH
      };
      if (result.COMMISSIONDETAILS) {
        investInfo.commisionDetails = [];
        _.each(result.COMMISSIONDETAILS, function (item) {
          investInfo.commisionDetails.push({
            tradeAmount: item.TRANS_AMOUNT, // 交易金额
            tradeTime: item.TRANS_TIME, // 交易时间
            transTypeName: item.TRANS_TYPE_NAME, // 类型名称
            transmonth: item.transmonth
          });
        });
      }
      if (result.PS_INVEST_INFO) {
        investInfo.psInvestInfo = { // 磐石投资额
          amountMonth: result.PS_INVEST_INFO.INVEST_AMOUNT_PS_MONTH,
          amountTotal: result.PS_INVEST_INFO.INVEST_AMOUNT_PS_TOTAL,
          amountYear: result.PS_INVEST_INFO.INVEST_AMOUNT_PS_YEAR
        };
      }
      if (result.ZX_INVEST_INFO) {
        investInfo.zxInvestInfo = { // 众享投资额
          amountMonth: result.ZX_INVEST_INFO.INVEST_AMOUNT_ZX_MONTH,
          amountTotal: result.ZX_INVEST_INFO.INVEST_AMOUNT_ZX_TOTAL,
          amountYear: result.ZX_INVEST_INFO.INVEST_AMOUNT_ZX_YEAR
        };
      }

      callback(null, investInfo);
    });
  },

  /**
   * 佣金收入列表
   *
   * @param userInfo
   * @param page
   * @param rows
   * @param callback
     */
  getIncomeList: function (userInfo, page, rows, callback) {
    var param = {
      page: page,
      rows: rows
    };
    var serverId = 'SHOP0009';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('getIncomeList error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var incomeList = {
        total: 0,
        rows: []
      };
      incomeList.total = result.total;
      _.each(result.rows, function (item) {
        incomeList.rows.push({
          userId: item.USER_ID,
          month: item.SHOP_MONTH,
          year: item.SHOP_YEAR,
          dateStr: item.DATA_DATESTR,// "2017-12-01"
          time: item.DATA_TIME, // "2017-12"
          investMonth: item.INVESTMONTH, // 投资总额
          psInvest: item.PS_INVEST_MONTH_ZB, // 磐石折标额
          stockMonthBalance: item.STOCK_MONTH_BALANCE, // 定活通日均余额
          commissionMonth: item.commissionMonth // 佣金收入
        });
      });
      callback(null, incomeList);
    });
  },

  /**
   * 定活通投资金额
   *
   * @param userInfo yyyy-mm
   * @param startDate yyyy-mm
   * @param endDate
   * @param callback
     */
  zxInvestAmount: function (userInfo, startDate, endDate, callback) {
    var param = {
      monthDate_min: startDate,
      monthDate_max: endDate
    };
    var serverId = '60000021';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('zxInvestAmount error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var zxInvestAmount = {
        total: 0,
        rows: []
      };
      zxInvestAmount.total = result.total;
      _.each(result.rows, function (item) {
        zxInvestAmount.rows.push({
          userId: item.USER_ID,
          time: item.DATA_TIME,
          dateStr: item.DATA_DATESTR,
          investAmount: item.INVEST_AMOUNT_ZX // 投资金额
        });
      });
      callback(null, zxInvestAmount);
    });
  },

  /**
   *  磐石投资金额
   *
   * @param userInfo
   * @param startDate yyyy-mm
   * @param endDate yyyy-mm
   * @param callback
     */
  psInvestAmount: function (userInfo, startDate, endDate, callback) {
    var param = {
      monthDate_min: startDate,
      monthDate_max: endDate
    };
    var serverId = '60000022';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('psInvestAmount error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var psInvestAmount = {
        total: 0,
        rows: []
      };
      psInvestAmount.total = result.total;
      _.each(result.rows, function (item) {
        psInvestAmount.rows.push({
          userId: item.USER_ID,
          time: item.DATA_TIME,
          dateStr: item.DATA_DATESTR,
          investAmount: item.TOTAL_AMOUNT_PS // 投资金额
        });
      });
      callback(null, psInvestAmount);
    });
  },

  /**
   * 定活通收入详情
   *
   * @param userInfo
   * @param date yyyy-mm-dd
   * @param page
   * @param rows
     * @param callback
     */
  zxInvestList: function (userInfo, date, page, rows, callback) {
    var param = {
      DATA_DATESTR: date,
      page: page,
      rows: rows
    };
    var serverId = '60000023';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('zxInvestList error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var zxInvestList = {
        total: 0,
        rows: []
      };
      zxInvestList.total = result.total;
      _.each(result.rows, function (item) {
        zxInvestList.rows.push({
          accountId: item.ACCOUNT_ID,
          phoneNum: item.CUSTOMER_PHONENUM,
          userName: item.CUSTOMER_USER_NAME,
          endTime: item.ENDTIME,
          investAmount: item.INVEST_AMOUNT,
          investTime: item.INVEST_TIME,
          productName: item.PRODUCT_NAME,
          unPaybackAmount: item.UNPAY_BACK_AMOUNT
        });
      });
      callback(null, zxInvestList);
    });
  },

  /**
   * 磐石通收入详情
   *
   * @param userInfo
   * @param date yyyy-mm-dd
   * @param page
   * @param rows
   * @param callback
   */
  psInvestList: function (userInfo, date, page, rows, callback) {
    var param = {
      DATA_DATESTR: date,
      page: page,
      rows: rows
    };
    var serverId = '60000024';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('psInvestList error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var psInvestList = {
        total: 0,
        rows: []
      };
      psInvestList.total = result.total;
      _.each(result.rows, function (item) {
        psInvestList.rows.push({
          accountId: item.ACCOUNT_ID,
          phoneNum: item.CUSTOMER_PHONENUM,
          userName: item.CUSTOMER_USER_NAME,
          endTime: item.ENDTIME,
          investAmount: item.INVEST_AMOUNT,
          investTime: item.INVEST_TIME,
          productName: item.PRODUCT_NAME
        });
      });
      callback(null, psInvestList);
    });
  },

  /**
   * 客户列表
   *
   * @param userInfo
   * @param type 1本月新增注册 2 本月新增投资客户 3 过去30天到期客户 4 未来30天到期客户 5 全部返回
   * @param page
   * @param rows
     * @param callback
     */
  customerList: function (userInfo, type, page, rows, callback) {
    var param = {
      TYPE: type + '', // 需要转成字符串
      page: page,
      rows: rows
    };
    var serverId = 'SHOP0007';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('customerList error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var customerList = {
        addInvestCustomerCount: result.addInvestCustomerCount, // 本月新增投资客户
        addRegisterCustomer: result.addRegisterCustomer, // 本月新增注册
        futureCount: result.futureCount, // 未来30天到期客户
        pastCount: result.pastcount, // 过去30天到期客户
        realTotals: result.realTotals, // 真实返回条数
        total: result.total,
        rows: []
      };
      _.each(result.rows, function (item) {
        customerList.rows.push({
          userId: item.USER_ID,
          realName: item.REALNAME || '',
          phoneNum: item.PHONENUM, // 180****0001
          sumInvest: item.SUMINVEST || 0, // 投资额
          usableAmount: item.USEABLE_AMOUNT || 0, // 闲置资金
          psSumAmount: item.PS_SUMAMOUNT || 0, // 磐石投资额
          zxSumAmount: item.ZX_SUMAMOUNT || 0, // 定活通投资额
          exchangeAmount: item.DUIHUANAMOUNT || 0, // 兑付金额
          expireAmount: item.ENDAMOUNT || 0 // 到期金额
        });
      });
      callback(null, customerList);
    });
  },

  /**
   * 客户搜索
   *
   * @param userInfo
   * @param condition
   * @param page
   * @param rows
   * @param callback
   */
  searchCustomer: function (userInfo, condition, page, rows, callback) {
    var param = {
      CUST_NAME: condition,
      page: page,
      rows: rows
    };
    var serverId = '60000013';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('searchCustomer error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }

      var result = reply.RETURN;

      var customerList = {
        total: result.total,
        rows: []
      };
      _.each(result.rows, function (item) {
        customerList.rows.push({
          isInvest: item.IS_INVEST_FLAG == '1', // 是否投资
          isPsInvest: item.IS_PS_INVEST == '1', // 是否投资磐石
          isYlInvest: item.IS_YL_INVEST == '1', // 是否投资银行理财
          isZxInvest: item.IS_ZX_INVEST == '1', // 是否投资众享
          phoneNum: item.PHONENUM, // 客户手机号码 "180****0057"
          psSumAmount: item.PS_SUMAMOUNT, // 磐石投资总额
          registerTime: item.REGIST_TIME, // 注册时间
          sumInvest: item.SUMINVEST, // 投资总额
          usableAmount: item.USEABLE_AMOUNT, // 闲置资金
          userName: item.USER_CNAME || '', // 用户名
          userId: item.USER_ID, // USER_ID
          zxSumAmount: item.ZX_SUMAMOUNT // 众享投资总额
        });
      });
      callback(null, customerList);

    });
  },

  /**
   * 客户基本信息
   *
   * @param userInfo
   * @param customerId
   * @param callback
     */
  customerInfo: function (userInfo, customerId, callback) {
    var param = {
      user_id: customerId
    };
    var serverId = 'SHOP0004';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('customerInfo error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;
      if (result.FLAG != 'T' || !result.rows) {
        callback({
          status: 'error',
          message: result.MSG || '查询失败'
        });
      } else {
        var item = result.rows;
        var customerInfo = {
          realName: item.REALNAME || '', // 用户姓名
          gender: item.GENDER, // 性别
          age: item.AGE, // 年龄
          phoneNum: item.PHONENUM, // 手机号
          certification: item.REALNAMEMARK == '1', // 是否实名认证
          additionalCapital: item.ADDITIONALCAPITAL, // 本月新增投资
          usableAmount: item.USEABLE_AMOUNT, // 闲置资金
          investSum: item.INVEST_SUM, // 累计投资
          idCardNo: item.IDCARD_NO // 身份证号码
        };
        callback(null, customerInfo);
      }
    });
  },

  /**
   * 用户操作详情（持有产品，持有卡券，登录信息）
   *
   * @param userInfo
   * @param customerId
   * @param type 1持有产品查询 2持有卡券 3登录信息
   * @param page
   * @param rows
   * @param callback
   */
  customerOperation: function (userInfo, customerId, type, page, rows, callback) {
    var param = {
      user_id: customerId,
      TYPE: type + '', // 需要转成字符串
      page: page,
      rows: rows
    };
    var serverId = 'SHOP0006';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('customerOperation error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var data = {
        total: result.total,
        rows: []
      };
      // 客户持有产品信息
      if (type == 1) {
        _.each(result.rows, function (item) {
          data.rows.push({
            accountId: item.ACCOUNT_ID,
            cardType: item.CARDTYPE, // 投资使用的卡券类型
            cardAmount: item.CARD_AMOUNT, // 投资使用的卡券数量
            cardName: item.CardName, // 投资使用的卡券名称
            investAmount: item.INVEST_AMOUNT, // 投资金额
            paybackDate: item.PLAN_PAYBACK_DATE, // 到期时间
            productCode: item.PRODUCT_CODE,
            productId: item.PRODUCT_ID, // 产品ID
            productName: item.PRODUCT_NAME, // 产品名称
            riseInterestRate: item.RISE_INTEREST_RATE // 加息比例
          });
        });
      }

      // 持有卡券
      if (type == 2) {
        _.each(result.rows, function (item) {
          data.rows.push({
            allocationRatio: item.Allocation_Ratio, //配资比
            amount: item.Amount, // 卡券金额 '12元'
            amountRate: item.Amount_RATE, // 卡券金额 '12'
            cardNum: item.CARD_NUM, // 数量
            cardName: item.CardName, // 卡券名称
            cardNo: item.CardNo,
            cardPassword: item.CardPassword,
            cardType: item.CardType, // 卡券类型 4增利本金 5返现红包 6加息券
            dataName: item.DATANAME,
            fitBusiness: item.FIT_BUSINESS,
            id: item.ID,
            invalidDate: item.INVALID_DATE, // 到期时间
            invalidDateEnd: item.INVALID_DATE_END, // 到期时间
            minInvestAmount: item.MIN_INVEST_AMOUNT, //起投金额
            minInvestTime: item.MIN_INVEST_TIME, // 持有时间
            psAllocationRatio: item.Pan_Allocation_Ratio, //磐石配资比
            productType: item.ProductType, //适用产品类型 1快E投  2信E投  3乐E投  4磐石
            riseInterestRate: item.RISE_INTEREST_RATE, // 卡券加息比例，
            sumAmount: item.SumAmount, //卡券总金额
            sumAmountEnds: item.SumAmount_Ends, //卡券总金额
            useRuleDesc: item.UseRuleDesc // 使用规则
          });
        });
      }

      // 登录信息
      if (type == 3) {
        _.each(result.rows, function (item) {
          data.rows.push({
            loginFrom: item.LOGIN_FROM, //登录终端： PC PYT_MOBLIE PYT_WECHAT
            loginDate: new Date(item.LOGIN_TIME).format('yyyy-MM-dd'), // 登录日期
            loginTime: new Date(item.LOGIN_TIME).format('hh:mm') // 登录时间
          });
        });
      }

      callback(null, data);
    });
  },

  /**
   * 消息设置（客户动态、资金动态 微信推送）
   *
   * @param userInfo
   * @param callback
     */
  getNotificationSettings: function (userInfo, callback) {
    var param = {};
    var serverId = 'SHOP0002';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('getNotificationSettings error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;
      if (result.FLAG != 'T') {
        callback({
          status: 'error',
          message: result.MSG || '查询失败'
        });
      } else {
        var notificationSettings = {
          register: result.ZC_FLAG, //有新用户注册的时候微信推送  1开 0关
          firstInvest: result.TZ_FLAG, //客户首次投资的时候微信推送  1开 0关
          commission: result.YJ_FLAG //每月佣金到账的时候微信推送  1开 0关
        };
        callback(null, notificationSettings);
      }
    });
  },

  /**
   * 修改消息设置（客户动态、资金动态 微信推送）
   *
   * @param userInfo
   * @param notificationSettings
   * @param callback
   */
  setNotification: function (userInfo, notificationSettings, callback) {
    var param = {};
    param.ZC_FLAG = notificationSettings.register + '';
    param.TZ_FLAG = notificationSettings.firstInvest + '';
    param.YJ_FLAG = notificationSettings.commission + '';

    var serverId = 'SHOP0003';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('setNotification error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;
      if (result.FLAG != 'T') {
        callback({
          status: 'error',
          message: result.MSG || '设置失败'
        });
      } else {
        callback(null);
      }
    });
  },

  /**
   * 推广链接
   *
   * @param userInfo
   * @param callback
     */
  mobilePromoList: function (userInfo, callback) {
    var param = {
      OPT: 'QUERY'
    };
    var serverId = 'WXFX002';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('mobilePromoList error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }

      var result = reply.RETURN;

      var promoList = {
        total: result.total,
        rows: []
      };
      _.each(result.rows, function (item) {
        promoList.rows.push({
          activeType: item.ACTIVE_TYPE,
          content: item.CONTENT,
          endTime: item.END_TIME,
          id: item.ID,
          imgUrl: item.IMGURL,
          inviteShow: item.INVITESHOW,
          isWechatImg: item.ISWECHATIMG,
          redirectUrl: item.REDIRECTURL,
          serialNum: item.SERIALNUM,
          startTime: item.START_TIME,
          title: item.TITLE,
          typeImg: item.TYPEIMG,
          url: item.URL
        });
      });
      callback(null, promoList);

    });
  },

  /**
   * 推广链接（根据id查询）
   *
   * @param userInfo
   * @param id
   * @param callback
     */
  mobilePromo: function (userInfo, id, callback) {
    var param = {
      OPT: 'QUERYBYID',
      ID: id
    };
    var serverId = 'WXFX002';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('mobilePromo error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }

      var result = reply.RETURN;
      var mobilePromo;
      if (result.shareTemplate) {
        mobilePromo = {
          content: result.shareTemplate.CONTENT,
          endTime: result.shareTemplate.END_TIME,
          id: result.shareTemplate.ID,
          imgUrl: result.shareTemplate.IMGURL,
          inviteShow: result.shareTemplate.INVITESHOW,
          isWechatImg: result.shareTemplate.ISWECHATIMG,
          redirectUrl: result.shareTemplate.REDIRECTURL,
          serialNum: result.shareTemplate.SERIALNUM,
          startTime: result.shareTemplate.START_TIME,
          title: result.shareTemplate.TITLE,
          typeImg: result.shareTemplate.TYPEIMG,
          url: result.shareTemplate.URL
        };
      }
      callback(null, mobilePromo);

    });
  },

  /**
   * 推广活动
   *
   * @param userInfo
   * @param application  1：应用于Web端2：应用于移动端3：共享，默认为共享, 4: 懒掌柜
   * @param callback
     */
  promoActivities: function (userInfo, application, callback) {
    var param = {
      APPLICATION_SENSE: application + ''
    };
    var serverId = '60000017';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('promoActivities error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var promoActivities = {
        phoneNum: result.PHONE_NUM,
        promoUserId: result.user_id,
        total: result.total,
        rows: []
      };
      _.each(result.rows, function (item) {
        promoActivities.rows.push({
          address: item.ACTIVITE_ADDRESS,
          desc: item.ACTIVITE_DESC,
          id: item.ACTIVITE_ID,
          name: item.ACTIVITE_NAME,
          rewardMode: item.REWARD_MODE,
          status: item.STATUS,
          promoUserId: item.USER_ID
        });
      });
      callback(null, promoActivities);
    });
  },

  /**
   * 投资情况
   *
   * @param userInfo
   * @param promoUserId
   * @param callback
     */
  myInvestInfo: function (userInfo, promoUserId, callback) {
    var param = {
      serialnum: promoUserId + ''
    };
    var serverId = 'WXFX003';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN || !reply.RETURN.userInformation) {
        logger.error('myInvestInfo error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var userInformation = reply.RETURN.userInformation;

      var myInvestInfo = {
        registerDay: userInformation.REGIST_DAY, // 注册天数
        investCount: userInformation.TOUZI_COUNT //累计投资笔数
      };
      callback(null, myInvestInfo);
    });
  },

  /**
   * 业绩排行榜类型
   *
   * @param userInfo
   * @param callback
     */
  rankTypeList: function (userInfo, callback) {
    var param = {};
    var serverId = 'SHOP0008';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('rankTypeList error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var rankTypeList = {
        rows: []
      };
      _.each(result.rows, function (item) {
        rankTypeList.rows.push({
          code: item.TYPECODE, // 业绩排行榜编码
          name: item.TYPENAME // 业绩排行榜名称
        });
      });
      callback(null, rankTypeList);
    });
  },

  /**
   * 业绩排行榜
   *
   * @param userInfo
   * @param type
   * @param page
   * @param rows
     * @param callback
     */
  promoRankList: function (userInfo, type, page, rows, callback) {
    var param = {
      TYPE: type + '',
      page: page,
      rows: rows
    };
    var serverId = 'SHOP0005';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      if (!reply || !reply.RETURN) {
        logger.error('promoRankList error, reply: ', reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
        return;
      }
      var result = reply.RETURN;

      var promoRankList = {
        rankList: [], // 业绩排行榜
        user: {} // 我的排名
      };
      _.each(result.rank_List, function (item) {
        promoRankList.rankList.push({
          amount: item.Amount, // 标准业绩
          userId: item.MANAGER_USER_ID, // 用户id
          date: item.data_date, // 数据统计日期
          loginName: item.login_name, // 登录名 "189****0000"
          userName: item.manager_name, // 用户名称
          number: item.rownumber // 排名
        });
      });
      if (result.userMap) {
        promoRankList.user.amount = result.userMap.Amount; // 标准业绩
        promoRankList.user.userId = result.userMap.MANAGER_USER_ID; // 用户id
        promoRankList.user.date = result.userMap.data_date; // 数据统计日期
        promoRankList.user.loginName = result.userMap.login_name; // 登录名 "189****0000"
        promoRankList.user.userName = result.userMap.manager_name; // 用户名称
        promoRankList.user.number = result.userMap.rownumber; // 排名
      }
      callback(null, promoRankList);
    });
  }
};
