/**
 * 用户基本信息
 */

var logger = require('../lib/logger').getLogger('UserInfoModels');

var userInfoKeyPrefix = 'user:info:';

module.exports = {

  /**
   * 获取用户信息（先从缓存获取，如果失败，则从后台接口获取）
   *
   * @param userInfo
   * @param callback
     */
  getUserInfo: function (userInfo, callback) {
    RedisService.get(userInfoKeyPrefix + userInfo.USER_ID, function (error, result) {
      if (error) {
        callback(error);
        return;
      }
      if (result) {
        callback(null, result);
      } else {
        updateUserInfo(userInfo, function (error, result) {
          callback(error, result);
        });
      }
    });
  },

  updateUserInfo: updateUserInfo

};

/**
 * 更新缓存中的用户信息
 *
 * @param userInfo
 * @param callback
 */
function updateUserInfo(userInfo, callback) {
  if (!userInfo.USER_ID) {
    callback(null);
    return;
  }
  var param = {
    KEY: 'Y'
  };
  var serverId = '999999';
  HessianService.startService(serverId, userInfo, param, function (error, reply) {
    if (error) {
      callback(error);
      return;
    }
    if (reply.RETURN && reply.RETURN.FLAG != 'F') {
      var userInfo = reply.RETURN;
      delete userInfo.FLAG;
      // 用户信息在缓存中保存24小时
      RedisService.setex(userInfoKeyPrefix + userInfo.USER_ID, userInfo, 24 * 60 * 60, function (error) {
        if (error) {
          callback(error);
          return;
        }
        callback(null, userInfo);
        //BANK_NAME BANK_NO BANK_SIMPLE_NAME EMAIL FUND_RESK FUND_RESK_ENDTIME IDCARD_NO INVEST_AMOUNT_LIMIT_MAP ISBUYYHLC
        //ISJIEKUAN LOGIN_NAME MSG OPEN_BANK OPEN_BANK_CITY OPEN_BANK_PROVINCE PHONENUM REALIDCARD_NO REALNAME REALPHONENUM
        //RISK_TYPE SHOP_MANAGER STATUS TRANS_PASSWORD USEPHONENUM USER_ID USER_NAME USER_RCODE USER_TYPE ZH_SIMPLE_NAME
      });
    } else {
      logger.error('updateUserInfo error', JSON.stringify(reply));
      callback();
    }
  });
}

/* global RedisService */
