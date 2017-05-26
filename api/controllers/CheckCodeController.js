/**
 * 图形验证码
 */

var verifyCode = require('../lib/verify-code');
var logger = require('../lib/logger').getLogger();

module.exports = {
  /**
   * 生成图形验证码
   *
   * @param req
   * @param res
     */
	index: function (req, res) {
		verifyCode.generate(function(error, result) {
			if (error) {
				logger.error('verifyCode generate error', error);
				res.serverError({status: 'error', message: '生成图形验证码失败'});
				return;
			}
			if (result) {
				req.session.serverCheckcode = result.code.toUpperCase();
        res.setHeader('content-type', 'image/png');
				res.send(result.image);
			}
		});
	}
};

