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
  serverId: '172.28.12.203',

  /**
   * session
   */
  session: {
    rolling: true,
    adapter: 'redis',
    host: '10.88.2.62',
    port: 51000,
    db: 1,
    pass: 'pywm2015',
    ttl: 30 * 60
  },

  /**
   * 缓存
   */
  redis: {
    host: '10.88.2.62',
    port: 51000,
    db: 1,
    pass: 'pywm2015'
  },

  /**
   * 后台接口
   */
  hessian: {
    server: 'http://172.28.12.203:8080/flowService.hessian',
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
    server: 'http://172.28.12.203:8080/wxUserService.hessian'
  },
  wechat: {
    appId: 'wx62527dd70ee28be7',
    appSecret: '6b14304a568ce92efc10219d009c5065',
    token: 'jxth'
  },
  vxPlatUrl: 'http://172.28.12.203:8080/vxplat/services/weixinResource',

  // TODO 微信后台地址（临时使用，用于从微信后台获取用户登录信息）
  wechatServer: 'http://172.28.12.203:8080/wechat',

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
