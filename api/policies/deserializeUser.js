/**
 * 用户信息
 */

module.exports = function(req, res, next) {
  req.openId = req.session.openId;
  var userId = req.session.userId || req.userId;
  if (userId) {
    var userInfo = _.extend(req.userInfo, {USER_ID: userId});
    UserInfoModels.getUserInfo(userInfo, function (error, result) {
      if (error) {
        next(error);
      } else {
        req.userInfo = _.extend(req.userInfo, result);
        req.user = convert2User(result);
        next();
      }
    });
  } else {
    next();
  }

  function convert2User(userInfo) {
    var user;
    if (userInfo) {
      // TODO 需要的属性根据需要进行添加
      user = {
        userId: userInfo.USER_ID, // 用户id
        displayName: userInfo.REALNAME || userInfo.USER_NAME || userInfo.LOGIN_NAME, // 用户姓名
        loginName: userInfo.LOGIN_NAME, // 登录名
        userType: userInfo.USER_TYPE, // 用户类型
        shopManager: userInfo.SHOP_MANAGER, // 是否店长
        bankPhone: userInfo.USEPHONENUM, // 银行预留手机号
        bankPhoneEncrypted: null, // 银行预留手机号(屏蔽中间4位)
        bindPhone: userInfo.REALPHONENUM, // 绑定手机号
        bindPhoneEncrypted: userInfo.PHONENUM, // 绑定手机号(屏蔽中间4位)
        promoCode: userInfo.USER_RCODE // 用户推荐码
      };
      if (userInfo.USEPHONENUM) {
        user.bankPhoneEncrypted = userInfo.USEPHONENUM.replace(/(\d{3})\d{4}(\d{4})/g, function (a, b, c) {
          return b + '****' + c;
        });
      }
    }
    return user;
  }
};

/* global UserInfoModels */
