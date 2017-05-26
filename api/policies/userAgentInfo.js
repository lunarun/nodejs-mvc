/**
 * 用户浏览器信息
 */

var getIP = require('ipware')().get_ip;

module.exports = function(req, res, next) {
  var ipInfo = getIP(req);
  var agent = !req.header("user-agent") ? "非浏览器访问" : req.header("user-agent").length > 150 ? req.header("user-agent").substring(0, 149) : req.header("user-agent");
  req.userInfo = _.extend({
    agent: agent,
    userIp: ipInfo.clientIp
  }, req.userInfo);
  next();
};
