// import other routes
const userRoutes = require('./users');
const organisationRoutes = require('./organisations');

const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    // // other routes
    userRoutes(app, fs);
    organisationRoutes(app, fs);

};

module.exports = appRouter;

// generate id
// (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
