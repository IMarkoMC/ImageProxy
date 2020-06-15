var os = require('os'),
  fs = require('fs'),
  path = require('path'),
  colors = require('colors')
  yaml = require('js-yaml'),
  directory = __dirname + "./cache",
  config = "",
  ConfigFiles = [],
  request = require('request');


if (process.argv.includes("-debug")) {
 
  global.debug = true
  //Setting up readline
}


Logger = require("./src/Logger")


var config

Logger.Info("Main".green, `Loading config and starting`)

/*
  Devuelve los archivos que hay en la carpeta ./configs
  Lee el contenido de cada .yml
  Intenta convertir el .yml a un jsonarray
  Si se pudo convertir lo guarda en el array de ConfigFiles
  El indice del ConfigFiles toma el valor del nombre de la config
  config = ConfigFiles["config.yml"]
  Eso devuelve la config de config.yml
  Si no se pudo cargar continua con el siguiente archivo
  Cuando termina carga los demas modulos (Es el SetTimeout)
*/

fs.readdir(path.join(__dirname, "./configs"), (err, files) => {
  if (err) {
    return Logger.Error("CONFIG".cyan, `Error while reading files on ./configs`)
  }
  Logger.Info("CONFIG".cyan, `Detected ${files.length} files on ./configs`)
  files.forEach(file => {
    if (!file.endsWith("conf")) {
      return Logger.Debug("LOGS".cyan, `File ${file} skipped!`)
    }
    try {
      Logger.Debug("CONFIG".cyan, `Attempting to load ${file}`)
      fs.readFile(path.join(__dirname, `./configs/${file}`), 'utf8', function (e, data) {

        if (e) {
          return Logger.Error("CONFIG".cyan, `Error while trying to read ${file}`);
        }
        ConfigFile = yaml.safeLoad(data, 'utf8');
        if (ConfigFile != null) {
          Logger.Info("CONFIG".cyan, `file ${file} loaded`)
          ConfigFiles[file] = ConfigFile
        } else {
          Logger.Info("CONFIG".cyan, `Failed to load ${file}`)
        }
      })
    } catch (error) {
      Logger.Debug("CONFIG".cyan, `Error: ${error}`)
    }
  })
})


setTimeout(() => {
  Logger.Info("Main".green, `Starting other functions`)
  Logger.Debug("Main".green, `Creating global variable for configs`)
  global.Configs = ConfigFiles
  config = ConfigFiles["config.yml"]
  //Clean array
  ConfigFiles = []
 
 
  WebListener = require('./src/WebServer/Server')
  WebListener()
}, 2000);

//TODO: Send a message to the webpage (Mark it as restarting); 
process.on('SIGINT',() => {
  Logger.Info("Main".green, "ImageProxy stopping...")
  process.exit(0)
})

process.on('SIGTERM',() => {
  Logger.Info("Main".green, "ImageProxy stopping...")
  process.exit(0);
})
