// Generated by CoffeeScript 1.12.5
(function() {
  var Card, Hand, actionString, narratorLog, narratorLogAction, narratorLogState, playerInfoString;

  Hand = require("hoyle").Hand;

  Card = require('hoyle').Card;

  redColor   = '\033[31m';
blueColor  = '\033[34m';
resetColor = '\033[0m';;

  narratorLogAction = function(logStr) {
    return console.log(redColor + logStr + resetColor);
  };

  narratorLogState = function(logStr) {
    return console.log(blueColor + logStr + resetColor);
  };

  narratorLog = function(logStr) {
    return console.log(logStr);
  };

  playerInfoString = function(player, communityCards) {
    var c, card, handName, i, len, playerCards, ref;
    playerCards = "";
    if (player.cards != null) {
      ref = player.cards;
      for (i = 0, len = ref.length; i < len; i++) {
        card = ref[i];
        playerCards += card + " ";
      }
      if (communityCards != null) {
        playerCards = (function() {
          var j, len1, ref1, results;
          ref1 = player.cards;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            c = ref1[j];
            results.push(new Card(c));
          }
          return results;
        })();
        c = [];
        c = c.concat(communityCards);
        c = c.concat(playerCards);
        handName = Hand.make(c).name;
        if ((handName != null) && handName !== 'High card') {
          playerCards += " (" + handName + ")";
        }
      }
    }
    return player.name + " ($" + player.chips + ") " + playerCards;
  };

  actionString = function(action, bet) {
    switch (action) {
      case 'bet':
        return 'bet $' + bet;
      case 'raise':
        return 'raised by $' + bet;
      case 'fold':
        return 'folded';
      case 'allIn':
        return 'went ALL IN with $' + bet;
      case 'call':
        return 'called $' + bet;
      case 'check':
        return 'checked';
    }
  };

  exports.roundStart = function(status) {
    var i, len, player, ref, results;
    narratorLog(" ");
    narratorLogState("==== Round #" + status.hand + " starting ====");
    narratorLogState(status.players.length + " players:");
    ref = status.players;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      player = ref[i];
      results.push(narratorLogState("  " + playerInfoString(player, null)));
    }
    return results;
  };

  exports.betAction = function(player, action, bet, err) {
    if (err) {
      return narratorLogAction("  " + player.name + " failed to bet: " + err);
    } else {
      return narratorLogAction("  " + player.name + " " + (actionString(action, bet)));
    }
  };

  exports.stateChange = function(status) {
    var c, card, cards, communityCards, i, j, k, l, len, len1, len2, len3, len4, m, player, pot, ref, ref1, ref2, ref3, ref4, results, stateName;
    stateName = status.state;
    narratorLog(" ");
    narratorLogState("-- " + stateName);
    if (stateName === 'pre-flop') {
      ref = status.players;
      for (i = 0, len = ref.length; i < len; i++) {
        player = ref[i];
        narratorLogState("  " + (playerInfoString(player, null)));
      }
      ref1 = status.players;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        player = ref1[j];
        if (player.blind > 0) {
          results.push(narratorLogAction("  " + player.name + "  paid a blind of $" + player.blind));
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else {
      cards = "";
      ref2 = status.community;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        card = ref2[k];
        cards = cards + card + " ";
      }
      narratorLogState(" Cards are: " + cards);
      pot = 0;
      ref3 = status.players;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        player = ref3[l];
        if (player.wagered != null) {
          pot += player.wagered;
        }
      }
      narratorLogState(" Pot is: " + pot);
      communityCards = (function() {
        var len4, m, ref4, results1;
        ref4 = status.community;
        results1 = [];
        for (m = 0, len4 = ref4.length; m < len4; m++) {
          c = ref4[m];
          results1.push(new Card(c));
        }
        return results1;
      })();
      ref4 = status.players;
      for (m = 0, len4 = ref4.length; m < len4; m++) {
        player = ref4[m];
        if (player.state === 'active' || player.state === 'allIn') {
          narratorLogState("  " + (playerInfoString(player, communityCards)));
        }
      }
      return narratorLogAction(" Actions: ");
    }
  };

  exports.complete = function(status) {
    var card, cardString, handName, i, j, k, len, len1, len2, player, ref, ref1, ref2, winner, winningPlayer;
    narratorLog(" ");
    narratorLogState("Round #" + status.hand + " complete.");
    if (status.winners.length > 1) {
      narratorLogState("Winners are:");
      ref = status.winners;
      for (i = 0, len = ref.length; i < len; i++) {
        winner = ref[i];
        narratorLogState(status.players[winner.position].name + " with " + status.players[winner.position].handName + ". Amount won: $" + (+winner.amount));
      }
    } else {
      winningPlayer = status.players[status.winners[0].position];
      handName = "";
      if (winningPlayer.handName != null) {
        handName = "with " + winningPlayer.handName;
      }
      narratorLogState("Winner was " + winningPlayer.name + " " + handName + " Amount won: $" + status.winners[0].amount);
    }
    narratorLogState("Positions: ");
    ref1 = status.players;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      player = ref1[j];
      cardString = "";
      if (player.cards != null) {
        ref2 = player.cards;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          card = ref2[k];
          cardString += card + " ";
        }
      }
      handName = "";
      if (player.handName != null) {
        handName = "(" + player.handName + ")";
      }
      narratorLogState(player.name + " ($" + player.chips + ") had " + cardString + " " + handName);
    }
    return narratorLogState("=================================");
  };

}).call(this);