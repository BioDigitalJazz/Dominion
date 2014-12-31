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
var messages = [];
var randomCards = ['AdventurerCard', 'FeastCard', 'MineCard', 
    'MoneylenderCard', 'MarketCard', 'SmithyCard', 'VillageCard', 
    'WitchCard', 'ThroneroomCard', 'WorkshopCard'];

io.on('connection', function (socket) {
  // socket.emit('You are connected!');
  console.log('New connection!');

  socket.on('player joins', function (playerName) {
    players.push(playerName);
    io.emit('player joined', { curPlayers: players });
  });

  socket.on('start game', function () {
    console.log('Game starts');
    io.emit('game starts');
  });

  socket.on('game created ready to play', function (playerID) {
    whosReady.push(playerID);
    if (players.length == whosReady.length) {
      io.emit('player turn');
    }
  });

  socket.on('player on game page', function (playerID) {
    socket.emit('ready to start', 
            { message: messages[playerID], kingdomCards: randomCards, players: players });
  });

  socket.on('player action', function(data) {
    io.emit('update DB action', data);
  });

  socket.on('player buy', function(data) {
    io.emit('update DB buy', data);
  });

  socket.on('next player', function(data) {
    io.emit('update DB next player', data);
  });
});

// === Ting ===


module.exports = app;
