/**
 * 微信用户接口
 */

var logger = require('../lib/logger').getLogger('WechatUserService');
var Proxy = require('../lib/hessian-proxy').Proxy;
var proxy = new Proxy(sails.config.wechatHessian.server);

module.exports = {
  /**
   * 根据openId获取用户信息
   *
   * @param openId
   * @param callback
   */
  getUserByOpenId: function (openId, callback) {
    logger.log('getUserByOpenId start', openId);
    proxy.invoke('getUserByOpenId', [openId], function (error, result) {
      if (error) {
        logger.error('getUserByOpenId error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('getUserByOpenId end', JSON.stringify(result));
      var user;
      if (result) {
        user = convert2JsonUser(result);
      }
      callback(null, user);
    });
  },

  /**
   * 绑定微信用户
   *
   * @param wechatUser
   * @param userId
   * @param callback
     */
  bindUser: function (wechatUser, userId, callback) {
    logger.log('bindUser start', wechatUser.openid, userId);
    var user = convert2WechatUser(wechatUser);
    proxy.invoke('doBindUser', [user, userId], function (error, result) {
      if (error) {
        logger.error('bindUser error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('bindUser end', JSON.stringify(result));
      callback(null, result); // 返回boolean
    });
  },

  /**
   * 解除绑定
   *
   * @param openId
   * @param userId
   * @param callback
   */
  unbindUser: function (openId, userId, callback) {
    logger.log('unbindUser start', openId, userId);
    proxy.invoke('doUnbindUser', [openId, userId], function (error, result) {
      if (error) {
        logger.error('unbindUser error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('unbindUser end', JSON.stringify(result));
      callback(null, result); // 返回boolean
    });
  },

  /**
   * 根据userId获取用户信息
   *
   * @param userId
   * @param callback
   */
  getUserByUserId: function (userId, callback) {
    logger.log('getUserByUserId start', userId);
    proxy.invoke('getUserByUserId', [userId], function (error, result) {
      if (error) {
        logger.error('getUserByUserId error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('getUserByUserId end', JSON.stringify(result));
      var user;
      if (result) {
        user = {
          userId: result.USER_ID,
          openId: result.OPENID,
          loginName: result.LOGIN_NAME,
          state: result.STATE,
          isDelete: result.IS_DELETE
        };
      }
      callback(null, user);
      // 返回字段：
      // "HEADIMGURL" "STATE" "USER_ID" "ZH_SIMPLE_NAME" "PHONENUM" "TRANS_PASSWORD" "IS_DELETE"
      // "OPENID" "RISK_TYPE" "USER_TYPE" "IDCARD_NO" "LOGIN_NAME" "SHOP_MANAGER" "BANK_NAME"
      // "REALNAME" "NICKNAME" "BANK_NO" "REGIST_TIME" USER_NAME" "SEX" "EMAIL" "BANK_SIMPLE_NAME" "PASSWORD"
    });

  },

  /**
   * 保存微信用户信息
   */
  saveWechatUser: function (user, callback) {
    logger.log('saveWechatUser start', user.openid);
    var wechatUser = convert2WechatUser(user);
    proxy.invoke('doSaveWechatUser', [wechatUser], function (error) {
      if (error) {
        logger.error('saveWechatUser error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('saveWechatUser end');
      callback(null); // 无返回值
    });
  },

  /**
   * 判断用户是否已经绑定微信
   *
   * @param loginName
   * @param callback
   */
  isBind: function (loginName, callback) {
    logger.log('isBind start', loginName);
    proxy.invoke('isbind', [loginName], function (error, result) {
      if (error) {
        logger.error('isBind error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('isBind end', JSON.stringify(result));
      callback(null, result); // 返回boolean
    });
  },

  /**
   * 微信自动登录的时候需要保存登录信息
   *
   * @param logInfo
   * @param callback
     */
  saveLoginLog: function (logInfo, callback) {
    logger.log('saveLoginLog start', logInfo.userId);
    var param = {
      OPENID: logInfo.openId,
      USER_ID: logInfo.userId,
      LOGIN_NAME: logInfo.loginName,
      _CLIENT_IP_: logInfo.userIp,
      FROM_IP: sails.config.serverId,
      _USER_AGENT_: logInfo.agent,
      _SYSTEM_TAG_: logInfo.agent,
      _SYSTEM_ID_: 'PYT_WECHAT'
    };
    proxy.invoke('doSaveLoginLog', [param], function (error) {
      if (error) {
        logger.error('saveLoginLog error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('saveLoginLog end');
      callback(null); // 无返回值
    });
  },

  /**
   * 根据登录名获取用户信息（暂时没用）
   *
   * @param loginName
   * @param callback
   */
  getUserByLoginName: function (loginName, callback) {
    logger.log('getUserByLoginName start', loginName);
    proxy.invoke('getUserByLoginName', [loginName], function (error, result) {
      if (error) {
        logger.error('getUserByLoginName error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('getUserByLoginName result', JSON.stringify(result));
      // TODO
      callback(null);
    });
  },

  /**
   * 获取用户的账户概览(暂时没用，账户概览由后台接口处理)
   *
   * @param userId
   * @param callback
   */
  getUserInterest: function (userId, callback) {
    logger.log('getUserInterest start', userId);
    proxy.invoke('getUserInterest', [userId], function (error, result) {
      if (error) {
        logger.error('getUserInterest error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('getUserInterest end', JSON.stringify(result));
      // TODO
      callback(null);
    });
  },

  /**
   * 获取店长从firstDate以来的经营业绩(暂时没用，由后台接口处理)
   *
   * @param userId
   * @param firstDate
   * @param callback
   */
  getShopManagerInvest: function (userId, firstDate, callback) {
    logger.log('getShopManagerInvest start', userId, firstDate);
    proxy.invoke('getShopManagerInvest', [userId, firstDate], function (error, result) {
      if (error) {
        logger.error('getShopManagerInvest error', error);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }
      logger.log('getShopManagerInvest end', JSON.stringify(result));
      // TODO
      callback(null);
    });
  }
};

function convert2JsonUser(data) {
  return {
    userId: data.userId,
    subscribe: data.subscribe, //用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。
    openid: data.openid,
    nickname: data.nickname,
    sex: data.sex, //用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
    language: data.language,
    city: data.city,
    province: data.province,
    country: data.country,
    headimgurl: data.headimgurl,
    subscribeTime: data.subscribe_time,
    unionid: data.unionid,
    groupid: data.groupid,
    remark: data.remark,
    shopManager: data.shopManager,
    privilege: data.privilege //sns 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
  };
}

function convert2WechatUser(data) {

  return {
    __type__: 'com.puyitou.weixin.bean.WechatUser',
    userId: data.userId,
    subscribe: data.subscribe,
    openid: data.openid,
    nickname: data.nickname,
    sex: data.sex,
    language: data.language,
    city: data.city,
    province: data.province,
    country: data.country,
    headimgurl: data.headimgurl,
    subscribe_time: data.subscribeTime || data.subscribe_time,
    unionid: data.unionid,
    groupid: data.groupid,
    remark: data.remark,
    shopManager: data.shopManager,
    privilege: data.privilege //sns 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
  };

}
