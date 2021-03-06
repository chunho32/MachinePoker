// Generated by CoffeeScript 1.12.5
(function() {
  var RemoteSeat, Seat, crypto, fs, request, util,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  request = require('request');

  util = require('util');

  crypto = require('crypto');

  Seat = require('../seat').Seat;

  exports.Seat = RemoteSeat = (function(superClass) {
    extend(RemoteSeat, superClass);

    function RemoteSeat(url1, opts1) {
      this.url = url1;
      this.opts = opts1;
      this.opts || (this.opts = {});
      if (this.opts.debug) {
        this.debug = true;
      }
      this.timeout = this.opts.timeout || 1000;
      this.setupTimeout = this.opts.setupTimeout || 10000;
    }

    RemoteSeat.prototype.setup = function(url, callback) {
      return request.get({
        url: url,
        json: true,
        timeout: this.setupTimeout
      }, (function(_this) {
        return function(e, r, response) {
          if (e || r.statusCode !== 200) {
            console.log(e, r.statusCode);
            callback(e || ("Returned " + r.statusCode));
            return false;
          }
          _this.info = response.info;
          _this.name = _this.info.name || ("Unnamed - " + url);
          callback(null);
          return _this.emit('ready');
        };
      })(this));
    };

    RemoteSeat.prototype.update = function(game, callback) {
      var result;
      result = 0;
      return request.post({
        url: this.url,
        body: game,
        json: true,
        timeout: this.timeout
      }, function(e, r, response) {
        if (e || r.statusCode !== 200) {
          console.log(e, response);
          return callback(e, 0);
        } else {
          return callback(null, response.bet);
        }
      });
    };

    return RemoteSeat;

  })(Seat);

  exports.create = function(url, opts, callback) {
    var bot;
    if (arguments.length === 2) {
      callback = arguments[arguments.length - 1];
      opts = {};
    }
    bot = new RemoteSeat(url, opts);
    if (bot.debug) {
      console.log("Creating bot for - " + url);
    }
    bot.setup(url, function(err) {
      return typeof callback === "function" ? callback(err, bot) : void 0;
    });
    return bot;
  };

}).call(this);
