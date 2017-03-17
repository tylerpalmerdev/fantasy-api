const playerCtrl = require('./controllers/player.ctrl');
const projectionCtrl = require('./controllers/projection.ctrl');
const gameCtrl = require('./controllers/game.ctrl');
const newIdCtrl = require('./controllers/newId.ctrl');
const statsCtrl = require('./controllers/stats.ctrl');
const mlDataCtrl = require('./controllers/mlData.ctrl');
const predictionCtrl = require('./controllers/prediction.ctrl');
const salaryCtrl = require('./controllers/salary.ctrl');

module.exports = (app) => {
    // test routes
    app.get('/test', (req, res) => {
        res.status(200).send("API connect success!");
    });
  
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

    // update a player's source ids
    app.put('/players/:playerId/sourceIds', playerCtrl.updatePlayerSourceIds);

    // get counts of all pending manual updates 
    app.get('/players/pending', playerCtrl.listPendingManualUpdates);

    // // projection routes
    // app.get('/projections', projectionCtrl.list);
    app.post('/projections', projectionCtrl.create);

    // actual game stats routes
    // app.get('/stats', statsCtrl.list);
    app.post('/stats', statsCtrl.create);

    // // game routes
    app.get('/games', gameCtrl.list);
    // app.get('/games/recent', gameCtrl.listRecent);
    app.post('/games', gameCtrl.create);
    app.post('/games/postgame', gameCtrl.updatePostGame);
    // app.post('/games/lines');
    // app.put('/games/times', gameCtrl.updateTimes);

    // id routes
    app.get('/newIds', newIdCtrl.list);
    app.post('/newIds', newIdCtrl.create);

    // ML data routes:
    app.get('/mldata', mlDataCtrl.list);

    // Prediction routes
    app.get('/predictions', predictionCtrl.list);
    app.post('/predictions', predictionCtrl.create);

    // Salary routes
    app.post('/salaries', salaryCtrl.create);
};

