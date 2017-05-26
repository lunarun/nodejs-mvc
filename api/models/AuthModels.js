/**
 * 用户认证
 */

var logger = require('../lib/logger').getLogger('AuthModels');

module.exports = {
  /**
   * 验证用户名密码是否正确
   *
   * @param userInfo
   * @param loginInfo
   * @param callback
   */
  verify: function (userInfo, loginInfo, callback) {
    var param = {
      LOGIN_INFO: loginInfo.username,
      LOGPWD: loginInfo.password,
      NOW_CHECK_CODE_IMG: loginInfo.serverCheckcode,
      CHECKCODE: loginInfo.userCheckcode,
      _CLIENT_IP_: loginInfo.ip,
      _USER_AGENT_: loginInfo.userAgent
    };

    var serverId = '3000001';
    HessianService.startService(serverId, userInfo, param, function (err, reply) {
      if (err) {
        callback(err);
        return;
      }

      var returnData = reply.RETURN;
      if (returnData) {
        var message;
        if (returnData.FLAG == 'T') {
          callback(null, returnData.USER_INFO);
        } else {
          if (returnData.STATUS == 2) {
            message = '请输入图形验证码';
          } else if (returnData.STATUS == 3) {
            message = '图形验证码错误';
          } else if (returnData.STATUS == 5) {
            message = '此号码未注册，请先注册或更换号码';
          } else {
            message = '用户名或密码错误，请重新输入';
          }
          var result = {
            status: 'error',
            errorCode: returnData.STATUS,
            message: message
          };
          callback(result);
        }

      } else {
        logger.error('服务器数据错误, SERVERID: ' + serverId, reply);
        callback({
          status: 'error',
          message: '服务器数据错误'
        });
      }
    });
  }
};
