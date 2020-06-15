const express = require('express'),
    app = express(),
    https = require('https'),
    fs = require('fs'),
    Logger = require('../Logger'),
    http = require("http");


var config = global.Configs["config.conf"]

module.exports = () => {

    const app = express();
    app.use(express.static(__dirname + '/public/views'));
    var server = http.createServer(app);

    //Require public routes handler
    require('./../routes/PublicRoutes')(app)


    if (global.debug != undefined) {
        const Morgan = require("morgan")
        app.use(Morgan('dev'))
    }

    if(process.argv.includes("dev")){
        Logger.Info("Environment".yellow,"Development environment enabled!")
        //This will disable the localhost only function
        server.listen(6060, () => {
            Logger.Info("WEB".green, `HTTP API server started on localhost:6060`)
        })
    }else{
        server.listen(config.express.port,"127.0.0.1", () => {
            app.enable("trust proxy");
            Logger.Info("WEB".green, `HTTP API server started on 127.0.0.1:${config.express.Port}`)
        })
    }

    
}