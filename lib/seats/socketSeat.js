// Generated by CoffeeScript 1.12.5
(function() {
  var Seat, SocketSeat, crypto, fs, request, tmpDir, util,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  request = require('request');

  util = require('util');

  crypto = require('crypto');

  Seat = require('../seat').Seat;

  tmpDir = __dirname + "/../../tmp";

  exports.Seat = SocketSeat = (function(superClass) {
    extend(SocketSeat, superClass);

    function SocketSeat(opts1) {
      this.opts = opts1;
      this.setupFinished = bind(this.setupFinished, this);
      this.opts || (this.opts = {});
      if (this.opts.debug) {
        this.debug = true;
      }
      this.loaded = false;
    }

    SocketSeat.prototype.setup = function(module) {
      this.player = module;
      this.playerInfo = module.info || {};
      this.name = this.playerInfo.name || "Unnamed";
      return this.setupFinished();
    };

    SocketSeat.prototype.setupFinished = function(err) {
      this.loaded = true;
      return this.emit('ready');
    };

    SocketSeat.prototype.update = function(game, callback) {
      var result, startTime;
      if (this.debug) {
        startTime = Date.now();
      }
      return result = this.player.update(game, callback);
    };

    return SocketSeat;

  })(Seat);

  exports.create = function(id, opts, callback) {
    var bot;
    if (arguments.length === 2) {
      callback = arguments[arguments.length - 1];
      opts = {};
    }
    bot = new SocketSeat(opts);
    bot.setup(id);
    return bot;
  };

}).call(this);