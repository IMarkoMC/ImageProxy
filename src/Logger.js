const chalk = require('chalk')

function GetDateTime() {
    var D = new Date(),
        m = D.getMonth(),
        d = D.getDay(),
        Hour = D.getHours(),
        Min = D.getMinutes(),
        Sec = D.getSeconds(),

        FullDate = d + "/" + m + " at " + Hour + ":" + Min + ":" + Sec
    return FullDate
}
var DebugEnabled = global.debug,
    //Styles can be changed here
    info = chalk.blue("INFO"),
    warn = chalk.yellow("WARNING"),
    debug = chalk.magenta("DEBUG"),
    error = chalk.red("ERROR")

exports.Info = (funct, Args) => {
    LogDate = GetDateTime()
    console.log(`[${LogDate}] [${info} - ${funct}]:  ${Args}`)
}

exports.Error = (funct, Args) => {
    LogDate = GetDateTime()

    console.log(`[${LogDate}] [${error} ${funct}]:  ${Args}`)
}

exports.Warn = (funct, Args) => {
    LogDate = GetDateTime()

    console.log(`[${LogDate}] [${warn} ${funct}]:  ${Args}`)
}

exports.Debug = (funct, Args) => {
    if (DebugEnabled != undefined) {
        LogDate = GetDateTime()
        console.log(`[${LogDate}] [${debug} ${funct}]:  ${Args}`)
    }
}

