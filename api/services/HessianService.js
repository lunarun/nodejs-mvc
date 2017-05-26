/**
 * JAVA后台Hessian接口
 */

var logger = require('../lib/logger').getLogger('HessianService');
var Proxy = require('../lib/hessian-proxy').Proxy;
var proxy = new Proxy(sails.config.hessian.server);

module.exports = {
  startService: function (serverID, userInfo, postData, callback) {
    var paramsMap = postData || {};

    var sid = paramsMap.hasOwnProperty('SID') ? ' (SID: ' + paramsMap.SID + ')' : '';
    var userId = userInfo.hasOwnProperty('USER_ID') ? ' userId: ' + userInfo.USER_ID + ',' : '';
    var loginName = userInfo.hasOwnProperty('LOGIN_NAME') ? ' loginName: ' + userInfo.LOGIN_NAME + ',' : '';
    logger.log(serverID + sid + ' start,' + loginName + userId + ' param: ', JSON.stringify(paramsMap));

    paramsMap.SERVERID = serverID + '';
    if (userInfo.USER_ID) {
      paramsMap.USER_ID = userInfo.USER_ID;
      paramsMap.USER_INFO = userInfo;
    }
    if (userInfo.agent) {
      paramsMap._SYSTEM_TAG_ = userInfo.agent;
    }
    if (userInfo.userIp) {
      paramsMap._CLIENT_IP_ = userInfo.userIp;
    }
    paramsMap.FROM_IP = sails.config.serverId;

    var systemId = userInfo.systemId || 'PC';
    var tokenCode = sails.config.hessian.token[systemId];
    proxy.invoke("StartSerivce", [serverID, paramsMap, systemId, tokenCode], function (err, reply) {
      if (err) {
        logger.error("startService error. serverID:" + serverID + sid, err);
        callback({
          status: 'error',
          message: '服务异常'
        });
        return;
      }

      if (!reply || (reply.hasOwnProperty('EXCEPTION') || reply.fault)) {
        if (reply.USER_INFO) {
          delete reply.USER_INFO;
        }
        logger.error("startService error. serverID:" + serverID + sid, reply);
        callback({
          status: 'error',
          message: '服务器数据异常'
        });
        return;
      }

      delete reply.USER_INFO;
      handleObject(reply); // 处理返回结果中的Object类型
      logger.log(serverID + sid + ' end, response: ', JSON.stringify(reply));
      try {
        callback(null, reply);
      } catch (e) {
        logger.error(serverID + sid + " handle error.", e.stack);
        callback({
          status: 'error',
          message: '程序异常'
        });
      }
    });

    function handleObject(data) {
      if (_.isArray(data)) {
        _.each(data, function (item) {
          handleObject(item);
        });
      } else if (_.isObject(data)) {
        _.each(_.keys(data), function (item) {
          if (data[item] && data[item].__type__ == 'java.math.BigDecimal') {
            data[item] = Number(data[item].value);
          } else if (data[item] && data[item].__type__ == 'com.caucho.hessian.io.FloatHandle') {
            data[item] = Number(data[item]._value);
          } else if (data[item] && (data[item].__type__ == 'java.util.Date' || data[item].__type__ == 'java.sql.Date' || data[item].__type__ == 'java.sql.Time' || data[item].__type__ == 'java.sql.Timestamp')) {
            data[item] = data[item].value;
          } else {
            handleObject(data[item]);
          }
        });
      }
    }
  }
};
