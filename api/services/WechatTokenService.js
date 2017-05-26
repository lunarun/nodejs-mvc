/**
 * 微信token接口
 */

var logger = require('../lib/logger').getLogger('WechatTokenService');
var request = require('request');
var wechat = require('wechat-toolkit');

var vxPlatUrl = sails.config.vxPlatUrl;
var appId = sails.config.wechat.appId;
var appSecret = sails.config.wechat.appSecret;


module.exports = {
  /**
   * 获取微信access_token
   *
   * @param callback
   */
  getAccessToken: function (callback) {
    var options = {
      url: vxPlatUrl + '/getAccessToken/' + appId
    };

    logger.log('getAccessToken start');
    request(options, function (error, response, body) {
      if (error || response.statusCode != 200) {
        logger.error('getAccessToken error', error);
        callback({
          status: 'error',
          errorCode: -1,
          message: '获取accessToken失败'
        });
        return;
      }

      var result = JSON.parse(body);
      if (result.access_token) {
        logger.log('getAccessToken end', result.access_token);
        callback(null, result.access_token);
      } else {
        logger.error('getAccessToken error. no access_token found');
        callback({
          status: 'error',
          errorCode: -2,
          message: '获取accessToken失败'
        });
      }
    });
  },

  /**
   * 获取微信JsApiTicket
   *
   * @param callback
   */
  getJsApiTicket: function (callback) {
    var options = {
      url: vxPlatUrl + '/getJsapiTicket/' + appId
    };

    logger.log('getJsApiTicket start');
    request(options, function (error, response, body) {
      if (error || response.statusCode != 200) {
        logger.error('getJsApiTicket error', error);
        callback({
          status: 'error',
          errorCode: -1,
          message: 'getJsApiTicket'
        });
        return;
      }

      var result = JSON.parse(body);
      if (result.jsapi_ticket) {
        logger.log('getJsApiTicket end', result.jsapi_ticket);
        callback(null, result.jsapi_ticket);
      } else {
        logger.error('getJsApiTicket error. no access_token found');
        callback({
          status: 'error',
          errorCode: -2,
          message: 'getJsApiTicket'
        });
      }
    });
  },

  /**
   * 获取AccessToken（没有缓存AccessToken，所以###不要###在正式环境中使用！！！）
   *
   * @param callback
   */
  getAccessTokenTest: function (callback) {
    logger.log('getAccessTokenTest start');
    wechat.getAccessToken(appId, appSecret, function (err, access_token) {
      if (err) {
        logger.error('getAccessTokenTest error', err);
        callback(err);
        return;
      }
      logger.log('getAccessTokenTest end', access_token);
      callback(null, access_token);
    });
  }
};
