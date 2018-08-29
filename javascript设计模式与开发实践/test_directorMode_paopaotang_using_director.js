//玩家对象

function Player(name, teamColor) {
  this.name = name;
  this.teamColor = teamColor;
  this.state = 'alive';
};

Player.prototype.win = function() {
  console.log(`${this.name}won`);
};

Player.prototype.lose = function() {
  console.log(`${this.name}lost`);
};

//玩家死亡，给中介者发送消息，玩家死亡
Player.prototype.die = function() {
  this.state = `dead`;
  playerDirector.receiveMessage('playerDead', this);
};

//移除玩家
Player.prototype.remove = function() {
  playerDirector.receiveMessage('removePlayer', this);
};

// 玩家换队
Player.prototype.changeTeam = function(color) {
  playerDirector.receiveMessage('changeTeam', this, color);
};

//创建玩家的工厂函数

var playerFactory = function(name, teamColor) {
  var newPlayer = new Player(name, teamColor);
  playerDirector.receiveMessage('addPlayer', newPlayer);
  return newPlayer;
};

// 中介者对象

var playerDirector = (function() {
  var players = {},
      operations = {};//中介者可以执行的操作
  
  // 新增一个玩家
  operations.addPlayer = function(player) {
    var teamColor = player.teamColor;
    players[teamColor] = players[teamColor] || [];
    players[teamColor].push(player);
  };

  // 移除一个玩家
  operations.removePlayer = function(player) {
    var teamColor = player.teamColor,
        teamPlayers = players[teamColor] || [];

    for (var i = teamPlayers.length - 1; i >= 0; i--) {
      if (teamPlayers[i] === player) {
        teamPlayers.splice(i, 1);
      }
    }
  };

  // 玩家换队
  operations.changeTeam = function(player, newTeamColor) {
    operations.removePlayer(player);
    player.teamColor = newTeamColor;
    operations.addPlayer(player);
  };

  operations.playerDead = function(player) {
    var teamColor = player.teamColor,
        teamPlayers = players[teamColor];

    var all_dead = true;

    for (var i = 0, player; player = teamPlayers[i++]; ) {
      if (player.state !== 'dead') {
        all_dead = false;
        break;
      }
    }

    if (all_dead === true) {
      for (var i = 0, player; player = teamPlayers[i++]; ) {
        player.lose();
      }

      for (var color in players) {
        if (color !== teamColor) {
          var teamPlayers = players[color];
          for (var i = 0, player; player = teamPlayers[i++]; ) {
            player.win();
          }
        }
      }
    }
  };

  var receiveMessage = function() {
    var message = Array.prototype.shift.call(arguments);
    operations[message].apply(this, arguments);
  };

  return {
    receiveMessage: receiveMessage
  };
})();

//测试

var player1 = playerFactory('皮蛋', 'red'),
    player2 = playerFactory('小乖', 'red'),
    player3 = playerFactory('宝宝', 'red'),
    player4 = playerFactory('小强', 'red');

var player5 = playerFactory('黑妞', 'blue'),
    player6 = playerFactory('葱头', 'blue'),
    player7 = playerFactory('胖墩', 'blue'),
    player8 = playerFactory('海盗', 'blue');

player1.die();
player2.die();
player3.die();
player4.die();    