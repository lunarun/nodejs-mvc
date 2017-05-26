/**
 * 从后台服务器获取userId
 */

module.exports = function(req, res, next) {
  // TODO (临时方案，以后可以直接删除）
  req.openId = req.session.openId;
  SessionService.getUserInfo(req, res, next);
};

/* global SessionService */
