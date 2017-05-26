/**
 * 缓存服务
 */

var redis = require('redis');
var logger = require('../lib/logger').getLogger('RedisService');
var redisConfig = sails.config.redis;

module.exports = new RedisService(redisConfig);

function RedisService(dataSource) {
  var self = this;
  self.connected = false;
  self.client = new redis.createClient(dataSource.port, dataSource.host);
  self.ttl = dataSource.ttl;
  if (dataSource.pass) {
    this.client.auth(dataSource.pass, function (err) {
      if (err) throw err;
    });
  }

  if (dataSource.db) {
    self.client.select(dataSource.db);
    self.client.on("connect", function () {
      self.client.send_anyways = true;
      self.client.select(dataSource.db);
      self.client.send_anyways = false;
    });
  }

  self.client.on('error', function (err) {
    logger.error('redis connect error', err);
    self.connected = false;
  });

  self.client.on('connect', function () {
    self.connected = true;
  });
}

RedisService.prototype.set = function (id, value, callback) {
  if (!this.connected) {
    if (callback) {
      callback();
    }
    return;
  }
  var data = JSON.stringify(value);
  this.client.set(id, data, function (err) {
    if (err) {
      logger.error('redis set error', err);
      if (callback) {
        callback({
          status: 'error',
          message: '缓存设置失败'
        });
      }
    } else if (callback) {
      callback(null);
    }
  });
};

RedisService.prototype.setex = function (id, value, ttl, callback) {
  if (!this.connected) {
    if (callback) {
      callback();
    }
    return;
  }
  var data = JSON.stringify(value);
  this.client.setex(id, ttl, data, function (err) {
    if (err) {
      logger.error('redis setex error', err);
      if (callback) {
        callback({
          status: 'error',
          message: '缓存设置失败'
        });
      }
    } else if (callback) {
      callback(null);
    }
  });
};

RedisService.prototype.get = function (id, callback) {
  if (!this.connected) {
    callback();
    return;
  }
  this.client.get(id, function (err, data) {
    if (err) {
      logger.error('redis get error', err);
      callback({
        status: 'error',
        message: '缓存读取失败'
      });
    }
    if (!data) {
      return callback();
    }
    var result;
    data = data.toString();
    try {
      result = JSON.parse(data);
    } catch (err) {
      logger.error('redis get error', err);
      return callback({
        status: 'error',
        message: '缓存读取失败'
      });
    }
    return callback(null, result);
  });
};
