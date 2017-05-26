/**
 * 微信事件处理(微信公众号配置的接口由集团提供,因此这个接口暂时无用)
 */

var token = sails.config.wechat.token;
var wechat = require('wechat-toolkit');

module.exports = {
  /**
   * 开启开发者模式
   */
  enableDevMode: wechat.enable_dev_mode(token),

  /**
   * 微信事件处理
   *
   * @param req
   * @param res
   * @param next
     */
  handleMessage: function (req, res, next) {
    WechatHandleService.handleMessage(req, res, next);
  }
};

/* global WechatHandleService */
