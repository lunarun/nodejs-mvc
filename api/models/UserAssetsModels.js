/**
 * 用户资产信息
 */

var logger = require('../lib/logger').getLogger('UserAssetsModels');

module.exports = {

  /**
   * 获取用户账户余额以及风险测评信息
   *
   * @param userInfo
   * @param callback
   */
  getUserAssets: function (userInfo, callback) {
    var param = {};
    var serverId = '50000001';
    HessianService.startService(serverId, userInfo, param, function (error, reply) {
      if (error) {
        callback(error);
        return;
      }
      var result = reply.RETURN;
      if (result) {
        var userAssets = {
          riskType: result.RISK_TYPE, // 客户风险等级（1，2，3，...）
          riskLevel: result.RISK_ASSESSMENT_NAME, // 客户风险等级（平衡型，...）
          riskEndTime: result.FUND_RESK_ENDTIME, // 风险测评有效时间
          riskCount: result.RISK_COUNT, // 测评次数
          nextRiskTime: result.NEXT_RISK_TIME, // 下次测评时间（仅当RISK_COUNT大于6的时候返回）
          freezeAmount: result.freezeamount, // 冻结资产
          totalAssets: result.totalAssets, // 总资产
          usableAmount: result.useableamount, // 可用余额
          totalInterest: result.totalInterest // 累计收益
        };
        callback(null, userAssets);
      } else {
        logger.error('updateUserAssets error', JSON.stringify(reply));
        callback({
          status: 'error',
          message: '获取用户资产信息失败'
        });
      }
    });
  }

};

