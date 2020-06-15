
var test = __dirname + './../../cache',
    fs = require('fs'),
    Logger = require('../Logger')

module.exports = (app) => {

    app.get('/get/:server/:id', (req, res) => {
        let { server, id } = req.params

        if (server == null || id == null) {
            res.json({
                error: true,
                msg: "Invalid param length"
            })
            return;
        }


        fs.exists(`${test}/${server}/${id}.png`, (exists) => {
            if (!fs.existsSync(test + "/" + server)) {
                Logger.Info('Cache Manager', `Creating a new folder for the server cache: ${server}`)
                fs.mkdir(test + '/' + server, (ret) => {
                    
                })
            }
            if (!exists) {
                Logger.Debug("Cache Manager", `File isnt on the local cache, downloading if from ${server}...`)
                let ReqStart = process.hrtime()
                download('https://' + server + '/' + id + '.png', `${test}/${server}/${id}.png`, (ret) => {

                    if (ret.error) {
                        res.json(ret) //sending the json
                        return;
                    }
                    Logger.Debug("Downloader", `File downloaded!`)

                    fs.readFile(`${test}/${server}/${id}.png`, (err, data) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        res.header("content-type", " image/png")
                        res.send(data)
                    })

                    let ReqEnd = process.hrtime(ReqStart)
                    let elapsedTimeInMs = ReqEnd[0] * 1000 + ReqEnd[1] / 1e6;
                    Logger.Debug('Downloader', `Time to donwload and send the reponse ~ ${elapsedTimeInMs.toFixed(3)} ms`)
                });


                return;
            } else {
                let ReqStart = process.hrtime()
                fs.readFile(`${test}/${server}/${id}.png`, (err, data) => {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    res.header("content-type", " image/png")
                    res.send(data)
                    let ReqEnd = process.hrtime(ReqStart)
                    let elapsedTimeInMs = ReqEnd[0] * 1000 + ReqEnd[1] / 1e6;
                    Logger.Debug('Cache Manager', `Time to read the file and send the reponse ~ ${elapsedTimeInMs.toFixed(3)} ms`)
                })

            }

        })

    })




    function download(uri, filename, callback) {
        request.head(uri, (err, res, body) => {
            if (err) {
                Logger.Error("Donwloader", `Error while downloading the file from ${uri}, err: ${err}`)
                callback({
                    error: true,
                    msg: "Invalid URL"
                })
                return;
            }
            Logger.Debug('Donwloader', 'content-type: ' + res.headers['content-type']);
            Logger.Debug('Downloader', 'content-length: ' + res.headers['content-length']);

            if (res.headers['content-type'] != "image/png") {
                callback({
                    error: true,
                    msg: "Link isnt a image!"
                })
                return
            }

            request(uri).pipe(fs.createWriteStream(filename)).on('close', (_) => { callback({ error: false }) });
        });
    };

}