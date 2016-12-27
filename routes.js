const playerCtrl = require('./controllers/player.ctrl');
const projectionCtrl = require('./controllers/projection.ctrl');
const gameCtrl = require('./controllers/game.ctrl');
const newIdCtrl = require('./controllers/newId.ctrl');

module.exports = (app) => {
    // test routes
    app.get('/test', (req, res) => {
        res.status(200).send("API connect success!");
    });

    function logIp(req, res, next) {
        console.log(req.ip);
        next();
    }
  
    // // player routes
    // get all players
    app.get('/players', playerCtrl.list);
    // post new players
    app.post('/players', playerCtrl.create);
    app.post('/players/incomplete', playerCtrl.createIncomplete);
    app.post('/players/notOnRoster', playerCtrl.updateNotOnRoster);

    // update a player (team, depth, injured, etc)
    app.put('/players/:playerId', playerCtrl.update);
    
    // update a player's bio data
    app.put('/players/:playerId/bio', playerCtrl.updateBio);

    // // projection routes
    // app.get('/projections', projectionCtrl.list);
    app.post('/projections', projectionCtrl.create);

    // // game routes
    app.get('/games', gameCtrl.list);
    app.post('/games', gameCtrl.create);
    app.post('/games/postgame', gameCtrl.updatePostGame);
    // app.post('/games/lines');
    // app.put('/games/times', gameCtrl.updateTimes);

    // id routes
    app.post('/newIds', newIdCtrl.create);
};

