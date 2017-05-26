/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
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
  serverId: '172.28.12.54',

  /**
   * session
   */
  session: {
    rolling: true,
    adapter: 'redis',
    host: '172.28.12.165',
    port: 51000,
    db: 0,
    pass: 'pywm@redis',
    ttl: 30 * 60
  },

  /**
   * 缓存
   */
  redis: {
    host: '172.28.12.165',
    port: 51000,
    db: 0,
    pass: 'pywm@redis'
  },

  /**
   * 后台接口
   */
  hessian: {
    server: 'http://172.28.12.54/flowService.hessian',
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
    server: 'http://172.28.12.54/wxUserService.hessian'
  },
  wechat: {
    appId: '',
    appSecret: '',
    token: ''
  },
  vxPlatUrl: 'http://172.28.12.54/vxplat/services/weixinResource',

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
  }
};

