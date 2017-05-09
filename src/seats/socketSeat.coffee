fs = require 'fs'
request = require 'request'
util = require 'util'
crypto = require 'crypto'
{Seat} = require('../seat')
tmpDir = __dirname + "/../../tmp"

# This should only be used to run bots that you trust

exports.Seat = class SocketSeat extends Seat

  constructor: (@opts) ->
    @opts ||= {}
    @debug = true if @opts.debug
    @loaded = false

  setup: (module) ->
    @player = module
    @playerInfo = module.info || {}
    @name = @playerInfo.name || "Unnamed"
    @setupFinished()

  setupFinished: (err) =>
    @loaded = true
    @emit 'ready'

  update: (game, callback) ->
    if (@debug)
      startTime = Date.now()
    result = @player.update(game,callback)


exports.create = (id, opts, callback) ->
  if arguments.length == 2
    callback = arguments[arguments.length - 1]
    opts = {}
  bot = new SocketSeat(opts)
  bot.setup(id)
  bot
