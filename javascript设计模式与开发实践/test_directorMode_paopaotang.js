//定义一个数组，用来保存所有的玩家

var players = [];


//玩家对象

function Player(name, teamColor) {
  this.partners = [];
  this.enemies = [];
  this.state = 'live';
  this.name = name;
  this.teamColor = teamColor;
};

Player.prototype.win = function() {
  console.log(`winner:${this.name}`);
};

Player.prototype.lose = function() {
  console.log(`loser:${this.name}`);
};

//每个玩家死亡的时候，都遍历其他对有的生存状况
//如果队友全部死亡，则这局游戏失败
//同时敌人队伍的所有玩家都取得胜利
Player.prototype.die = function() {
  var all_dead = true;
  this.state = 'dead';

  for (var i = 0, partner; partner = this.partners[i++]; ) {
    if (partner.state !== 'dead') {
      all_dead = false;
      break;
    }
  }

  if (all_dead === true) {//书中的代码在比较的时候全部使用显式比较，自己以后写代码也要注意这么做
    this.lose();
    for (var i = 0, partner; partner = this.partners[i++]; ) {
      partner.lose();
    }
    for (var i = 0, enemy; enemy = this.enemies[i++]; ) {
      enemy.win();
    }
  }
};

// 创建玩家的工厂方法

var playerFactory = function(name, teamColor) {
  var newPlayer = new Player(name, teamColor);

  for (var i = 0, player; player = players[i++]; ) {
    if (player.teamColor === newPlayer.teamColor) {
      player.partners.push(newPlayer);
      newPlayer.partners.push(player);
    } else {
      player.enemies.push(newPlayer);
      newPlayer.enemies.push(player);
    }
  }
  players.push(newPlayer);

  return newPlayer;
}

var player1 = playerFactory('皮蛋', 'red');
    player2 = playerFactory('小乖', 'red');
    player3 = playerFactory('宝宝', 'red');
    player4 = playerFactory('小强', 'red');

var player5 = playerFactory('黑妞', 'blue');
    player6 = playerFactory('葱头', 'blue');
    player7 = playerFactory('胖墩', 'blue');
    player8 = playerFactory('海盗', 'blue');

player1.die();
player2.die();
player3.die();
player4.die();