const p2p = require('digibyte-js-p2p');
const Peer = require('digibyte-js-p2p/lib/peer');
const Messages = require('digibyte-js-p2p/lib/messages');
const MySQL = require('./mysql');

console.log = function () {
    const fs = require('fs');
    var d = new Date,
        date = [d.getFullYear(), (d.getMonth() + 1).toString().padStart(2, "0"), d.getDate().toString().padStart(2, "0")].join('-'),
        time = [d.getHours().toString().padStart(2, "0"), d.getMinutes().toString().padStart(2, "0"), d.getSeconds().toString().padStart(2, "0")].join(':'),
        datetime = date + ' ' + time;
    var text = "";
    for (var arg in arguments) {
        if (typeof arguments[arg] == 'object')
            text += JSON.stringify(arguments[arg]);
        else
            text += arguments[arg];

        if (arg != arguments.length - 1)
            text += ' ';
        else
            text += '\n'
    }

    process.stdout.write(text);
    if (!fs.existsSync("logs"))
        fs.mkdirSync("logs");
    fs.appendFileSync("logs/" + date + ".log", datetime + ": " + text);
};

class Crawler {
    static async CheckNode(host, port, ping = false) {
        return new Promise(async (resolve, reject) => {
            console.log("Checking:", host, port)
            let nodeA = await MySQL.Query('CALL SelectNode(?,?)', [host, port]);

            var peer = new Peer({ host, port });
            peer.on('ready', async function () {
                console.log("Found:", host, port, peer.version, peer.subversion, peer.bestHeight)
                var version = await MySQL.Query('CALL SelectVersionByNumber(?)', [peer.version]);
                var subversion = await MySQL.Query('CALL SelectSubversionByName(?)', [peer.subversion]);

                await MySQL.Query('CALL UpdateNode(?,?,?,?,?,?,?)', [nodeA[0].NodeID, 2, null, version[0].VersionID, subversion[0].SubversionID, null, null]);

                if (ping)
                    resolve({ varsion: peer.version, subversion: peer.subversion, height: peer.bestHeight });

                peer.sendMessage((new Messages()).GetAddr());
            });

            peer.on('error', async function () {
                console.log("Error:", host, port);
                await MySQL.Query('CALL UpdateNode(?,?,?,?,?,?,?)', [nodeA[0].NodeID, 3, nodeA[0].CountryID, nodeA[0].VersionID, nodeA[0].SubversionID, nodeA[0].Longitude, nodeA[0].Latitude]);
                resolve(false);
            })

            peer.on('addr', async function (message) {
                for (var address of message.addresses) {
                    if (address.ip.v6.startsWith("0000:0000:0000:0000:0000:"))
                        var nodeB = await MySQL.Query('CALL SelectNode(?,?)', [address.ip.v4, address.port]);
                    else
                        var nodeB = await MySQL.Query('CALL SelectNode(?,?)', [address.ip.v6, address.port]);
                    await MySQL.Query('CALL SelectConnections(?, ?)', [nodeA[0].NodeID, nodeB[0].NodeID]);
                }

                peer.disconnect();
                console.log("Found:", host, port, message.addresses.length);

                if (ping === false)
                    resolve({ varsion: peer.version, subversion: peer.subversion, height: peer.bestHeight });
            });

            peer.connect();
        });
    }
    static async Checker() {
        if (Math.floor(Math.random() * 5) > 0)
            var node = await MySQL.Query('CALL SelectOneNodeByState(1)'); // Check
        else
            var node = await MySQL.Query('CALL SelectOneNodeByState(2)'); // Recheck

        if (node.length > 0) {
            await Crawler.CheckNode(node[0].IP, node[0].Port)
        }

        setTimeout(Crawler.Checker, 100);
    }
}

module.exports = Crawler;