/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  /**
   * 服务器标识（IP地址）
   */
  serverId: '10.88.2.58',

  /**
   * session
   */
  session: {
    rolling: true,
    adapter: 'redis',
    host: '10.88.2.62',
    port: 51000,
    db: 0,
    pass: 'pywm2015',
    ttl: 30 * 60
  },

  /**
   * 缓存
   */
  redis: {
    host: '10.88.2.62',
    port: 51000,
    db: 0,
    pass: 'pywm2015'
  },

  /**
   * 后台接口
   */
  hessian: {
    server: 'http://10.88.2.58/flowService.hessian',
    token: {
      PC: 'PC10-38F1-27EF-46H3-940D',
      PYT_WECHAT: 'WX01-3841-23EF-45H3-94AD',
      PYT_MOBLIE: 'MB01-MB01-MB01-MB032'
    }
  },

  /**
   * 微信
   */
  wechatHessian: {
    server: 'http://10.88.2.58:80/wxUserService.hessian'
  },
  wechat: {
    appId: 'wx28fb2577d9e428ed',
    appSecret: '4773dd1669820425392e503d5ee09747',
    token: 'jxth'
  },
  vxPlatUrl: 'http://10.88.2.58/vxplat/services/weixinResource',

  // TODO 微信后台地址（临时使用，用于从微信后台获取用户登录信息）
  wechatServer: 'http://10.88.2.58/wechat',

  /**
   * 日志
   */
  log4js: {
    level: 'INFO',
    configure: {
      appenders: [
        {
          type: "file",
          filename: "logs/error.log",
          maxLogSize: 2 * 1024 * 1024,
          backups: 3
        }
      ]
    }
  },

  /**
   * 跨域设置
   */
  cors: {
    allRoutes: true,
    origin: '*',
    credentials: true
  }

};
