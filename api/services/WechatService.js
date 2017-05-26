/**
 * 微信通用接口
 */

var logger = require('../lib/logger').getLogger('WechatService');
var wechat= require('wechat-toolkit');
var uuid = require('uuid');
var sha1 = require('sha1');
var appId = sails.config.wechat.appId;
var appSecret = sails.config.wechat.appSecret;

module.exports = {
  /**
   * 根据code从微信服务器获取openId
   *
   * @param code
   * @param callback
     */
  getOpenIdByCode: function (code, callback) {
    if (!code) {
      logger.error("getOpenIdByCode failed, code is empty");
      callback({
        status: 'error',
        errorCode: -1,
        message: "请通过微信打开页面"
      });
      return;
    }
    logger.log('getOpenIdByCode start', code);
    wechat.exchangeAccessToken(appId, appSecret, code, function (error, result) {
      if (error) {
        logger.error("getOpenIdByCode error", error);
        callback({
          status: 'error',
          message: '获取openId失败'
        });
        return;
      }
      logger.log('getOpenIdByCode end', JSON.stringify(result));
      callback(null, result);
    });
  },

  /**
   * 根据openId从微信服务器获取用户信息
   *
   * @param openId
   * @param callback
     */
  getWechatUserByOpenId: function (openId, callback) {
    logger.log('getWechatUserByOpenId start');
    async.waterfall([getAccessToken, getUserInfo], function (error, result) {
      if (error) {
        logger.error("getWechatUserByOpenId error", error);
        callback(error);
        return;
      }
      logger.log('getWechatUserByOpenId end', JSON.stringify(result));
      callback(null, result);
    });

    function getAccessToken(callback) {
      WechatTokenService.getAccessToken(function (error, result) {
        if (error) {
          callback(error);
          return;
        }
        callback(null, result);
      });
    }

    function getUserInfo(accessToken, callback) {
      wechat.getFanInfo(accessToken, openId, function (error, result) {
        if (error) {
          logger.error('getWechatUserByOpenId error', error);
          callback({
            status: 'error',
            message: '获取用户信息失败，请关注公众号后重试'
          });
          return;
        }
        callback(null, result);
      });
    }

  },

  /**
   * 获取JS-SDK配置信息
   *
   * @param url
   * @param callback
     */
  getJsConfig: function (url, callback) {
    logger.log('getJsConfig start');
    var nonceStr = uuid.v1();
    var timestamp = Math.floor(new Date().getTime() / 1000);
    var jsApiTicket;
    WechatTokenService.getJsApiTicket(function (error, result) {
      if (error) {
        logger.log('getJsConfig error');
        callback(error);
        return;
      }
      jsApiTicket = result;
      var string4Signature = "jsapi_ticket=" + jsApiTicket +
        "&noncestr=" + nonceStr +
        "&timestamp=" + timestamp +
        "&url=" + url;
      var signature = sha1(string4Signature);
      var config = {
        appId: appId,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature
      };
      logger.log('getJsConfig end', JSON.stringify(config));
      callback(null, config);
    });
  }
};

/* global WechatTokenService */
