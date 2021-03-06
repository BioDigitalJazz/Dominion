var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// === Ting ===

// = Socket.io =
var debug = require('debug')('dominion');
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
var io = require('socket.io')(server);
// = Socket.io =

var players = [];
var whosReady = [];
var playersPoints = [];
var winners = [];
var messages = [];
var gameHasEnded = false;
var gameIsStarting = false;
var gameInProgress = false;

var randomCards = ['MoatCard', 'CellarCard', 'ChapelCard', 'FeastCard', 'MoneylenderCard', 
                   'MineCard', 'MarketCard', 'WitchCard',  'CouncilroomCard', 'AdventurerCard'];

io.on('connection', function (socket) {
  // socket.emit('You are connected!');
  console.log('New connection!');

  socket.on('player joins', function (playerName) {
    gameHasEnded = false;
    players.push(playerName);
    io.emit('player joined', { curPlayers: players, gameInProgress: gameInProgress });
  });

  socket.on('start game', function () {
    console.log('Game starts');
    gameIsStarting = true;
    io.emit('game starts');
    gameInProgress = true;
  });

  socket.on('game created ready to play', function (playerID) {
    whosReady.push(playerID);
    if (players.length == whosReady.length) {
      io.emit('player turn');
      gameIsStarting = false;
    }
  });

  socket.on('player on game page', function (playerID) {
    socket.emit('ready to start', 
            { message: messages[playerID], kingdomCards: randomCards, players: players });
  });

  // socket.on('player action', function(data) {
  //   io.emit('update DB action', data);
  // });

  socket.on('player gain', function(supplyName) {
    socket.broadcast.emit('update DB gain', supplyName);
  });

  socket.on('make the other player act', function(cardName) {
    socket.broadcast.emit('the other player makes you act', cardName);
  });

  socket.on('attack', function(cardName, attackerID) {
    socket.broadcast.emit('you are being attacked', cardName, attackerID);
  });


  socket.on('defender gains curse', function(defenderID, attackerID) {
    socket.broadcast.emit('defender gains curse', defenderID, attackerID);
  });

  socket.on('defender has moat', function(defenderID, attackerID) {
    socket.broadcast.emit('moat negates attack', defenderID, attackerID);
  });

  socket.on('next player', function(log) {
    io.emit('update DB next player', log);
  });

  socket.on('end game', function(log) {
    io.emit('end game calculate victory points', log);
  });

  socket.on('victory points', function(playerID, vicPoints) {
    playersPoints[playerID] = vicPoints;
    var hasPoints = playersPoints.filter(function(value) { return value !== undefined; });

    if (hasPoints.length === players.length) {
      var highestPoints = Math.max.apply(null, playersPoints);
      var winnerIndex = playersPoints.indexOf(highestPoints);
      while (winnerIndex != -1) {
        winners.push(winnerIndex);
        winnerIndex = playersPoints.indexOf(highestPoints, winnerIndex + 1);
      };
      io.emit('end game announce winner', playersPoints, winners);
    };
  });

  var clearArrays = function() {
    players = [];
    whosReady = [];
    playersPoints = [];
    winners = [];
    messages = [];
    gameInProgress = false;
  };

  socket.on('game has ended', function() {
    // console.log("clearing player info");
    clearArrays();
    gameHasEnded = true;
    socket.disconnect();
  });

  socket.on('disconnect', function() {
    // console.log("disconnecting...")
    if (this.handshake.headers.referer == "http://" + this.handshake.headers.host + "/") {
      // console.log("Just from the login")
      if (!gameIsStarting  && !gameInProgress) {
        clearArrays();
      }
    } else if (!gameHasEnded) {
      // console.log("because game was cancelled");
      clearArrays();
      io.emit('game cancelled');
    }
  });
});

// === Ting ===


module.exports = app;
