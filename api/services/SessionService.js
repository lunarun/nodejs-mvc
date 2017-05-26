/**
 * 从服务器获取用户的信息，临时使用，后续需要直接使用node的session
 */

var logger = require('../lib/logger').getLogger('SessionService');
var Request = require('request');
var j = Request.jar();
var serverUrl = sails.config.wechatServer;
var request = Request.defaults({jar:j, baseUrl:serverUrl});

module.exports = {

  // TODO 从后台获取用户信息，后续应该去除
  getUserInfo: function (req, res, next) {
    var url = 'service.do';
    var key = 'JSESSIONID';
    var jsessionId = req.cookies[key];
    if (!jsessionId) {
      next();
      return;
    }
    j.setCookie('JSESSIONID=' + jsessionId, serverUrl);

    var form = {
      SERVERID: '999999',
      KEY: 'Y'
    };

    var options = {
      url: url,
      headers: {
        'User-Agent': 'request'
      },
      json: true,
      form: form
    };

    request.post(options, function (err, httpResponse, body) {
      if (err) {
        logger.error('getUserInfo error', err);
        next();
        return;
      }
      if (httpResponse.statusCode != 200) {
        logger.error('getUserInfo error, statusCode: ', httpResponse.statusCode);
        next();
        return;
      }
      if (body && body.RETURN && body.RETURN.FLAG != 'F') {
        var userInfo = body.RETURN;
        req.userId = userInfo.USER_ID;
        next();
      } else {
        next(); // 未登录
      }
    });
  }

};
