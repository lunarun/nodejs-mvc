/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  if (req.isLogin()) {
    next();
  } else {
    res.unauthorized({
      status: 'error',
      errorCode: 401,
      message: '未登录用户不能进行此项操作'
    });
  }
};
