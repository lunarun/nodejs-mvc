var http = require('http');
var req = http.IncomingMessage.prototype;

/**
 * 保存userID到session
 */
req.login = req.logIn = function (userInfo, callback) {
  if (!userInfo.userId  && !userInfo.USER_ID) {
    callback({status: 'error', message: 'USER_ID is empty'});
    return;
  }
  this.session.userId = userInfo.userId || userInfo.USER_ID;
  callback();
};

/**
 * 销毁session中的userID
 */
req.logout = req.logOut = function (callback) {
  delete this.session.userId;
  callback();
};

/**
 * 判断用户是否登录
 */
req.isLogin = function () {
  return (this.session.userId || this.userId) ? true : false;
};
