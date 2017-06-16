{EventEmitter} = require 'events'
async = require 'async'
binions = require 'binions'
{Player} = binions
{Game} = binions

exports.seats =
  JsLocal: require('./seats/js_local')
  Remote: require('./seats/remote')
  SocketSeat : require('./seats/socketSeat')

exports.betting = binions.betting
exports.observers =
  fileLogger: require './observers/file_logger'
  logger: require './observers/logger'
  narrator: require './observers/narrator'

exports.create = (betting) ->
  new MachinePoker(betting)

class MachinePoker extends EventEmitter
  constructor:(@opts) ->
    @opts ?= {}
    @chips = @opts.chips || 1000
    @maxRounds = @opts.maxRounds || 100
    @betting = @opts.betting || binions.betting.noLimit(10,20)
    @observers = []
    @players = []
    @currentRound = 1
    @waitingNewRoundTime = 2000;

  addObserver: (obs) ->
    @observers.push(obs)
    for event in ['roundStart', 'stateChange', 'complete', 'tournamentComplete', 'betAction', 'playerBetStart']
      @on(event, obs[event].bind(obs)) if obs[event]

  removeObserver: (obs) ->
    @removeAllListeners()
    @observers = null

  addPlayers: (bots) ->
    @players = []
    names = []
    for bot in bots
      name = botNameCollision(names, bot.name)
      names.push(name)
      @addPlayer(new Player(bot, @chips, name))

  addPlayer: (player) ->
    player.on 'betAction', (action, amount, err) =>
      @emit 'betAction', player, action, amount, err
    @players.push(player)
  
  run: ->
    if @players.length > 1
      game = new Game(@players, @betting, @currentRound)
      game.on 'roundStart', =>
        @emit 'roundStart', game.status(Game.STATUS.PRIVILEGED)
      game.on 'stateChange', (state) =>
        @emit 'stateChange', game.status(Game.STATUS.PRIVILEGED)
      game.on 'playerBetStart', (player) =>
        @emit 'playerBetStart', player
      game.once 'complete', (status) =>
        @emit 'complete', game.status(Game.STATUS.PRIVILEGED)
        @currentRound++
        numPlayer = (@players.filter (p) -> p.chips > 0).length
        if @currentRound > @maxRounds or numPlayer < 2
          @emit 'tournamentComplete', @players
          @_close()
        else
          setTimeout =>
            @run()
          , @waitingNewRoundTime
      game.run()
    else if @players.length > 0
    else
      @_close()

  start: ->
    @players.sort ->
      Math.random() > 0.5 # Mix up the players before a tournament
    @run()
    
  stop: ->
    
  # Signal when a tournament is over and observers
  # are done. Example, observers may be writing to a stream
  # and not yet finished
  _close: (callback) ->
    waitingOn = 0
    if observers == null
      return
    for obs in @observers
      if obs['onObserverComplete']
        waitingOn++
        obs.onObserverComplete ->
          waitingOn--
          if waitingOn <= 0
            callback?()
    if waitingOn <= 0
      @emit 'tournamentClosed'
      callback?()

botNameCollision = (existing, name, idx) ->
  altName = name
  idx ||= 1
  if idx > 1
    altName = "#{name} ##{idx}"
  if existing.indexOf(altName) >= 0
    return botNameCollision(existing, name, idx + 1)
  return altName


