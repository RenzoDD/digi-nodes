const p2p = require('digibyte-js-p2p');
const Peer = require('digibyte-js-p2p/lib/peer');
const Messages = require('digibyte-js-p2p/lib/messages');
const Request = require('./request');
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
            let resolved = false;
            let nodeA = await MySQL.Query('CALL SelectNode(?,?)', [host, port]);

            var peer = new Peer({ host, port });
            const myTimeout = setTimeout(async () => {
                console.log("Timeout:", host, port);
                await MySQL.Query('CALL UpdateNodeInfo(?,?,?,?)', [nodeA[0].NodeID, 3, nodeA[0].VersionID, nodeA[0].SubversionID]);
                if (!resolved) { resolve(false); resolved = true; }
            }, 5000);

            peer.on('ready', async function () {
                console.log("Found:", host, port, peer.version, peer.subversion, peer.bestHeight)
                var version = await MySQL.Query('CALL SelectVersionByNumber(?)', [peer.version]);
                var subversion = await MySQL.Query('CALL SelectSubversionByName(?)', [peer.subversion]);

                await MySQL.Query('CALL UpdateNodeInfo(?,?,?,?)', [nodeA[0].NodeID, 2, version[0].VersionID, subversion[0].SubversionID]);

                if (ping)
                    if (!resolved) { resolve({ varsion: peer.version, subversion: peer.subversion, height: peer.bestHeight }); resolved = true; }

                clearTimeout(myTimeout);
                setTimeout(() => { if (!resolved) { resolve(false); resolved = true; } }, 30000);
                peer.sendMessage((new Messages()).GetAddr());
            });

            peer.on('error', async function () {
                console.log("Error:", host, port);
                await MySQL.Query('CALL UpdateNodeInfo(?,?,?,?)', [nodeA[0].NodeID, 3, nodeA[0].VersionID, nodeA[0].SubversionID]);
                if (!resolved) { resolve(false); resolved = true; }
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
                    if (!resolved) { resolve({ varsion: peer.version, subversion: peer.subversion, height: peer.bestHeight }); resolved = true; }
            });

            peer.connect();
        });
    }
    static async Locator(host) {
        console.log("Locating:", host)
        var data = await Request.Get("http://ip-api.com/json/" + host + "?fields=status,country,countryCode,lat,lon,isp");

        if (data === null)
            return;

        if (data.status !== "success")
            return;

        var country = await MySQL.Query("CALL SelectCountryByName(?, ?)", [data.country, data.countryCode]);
        var provider = await MySQL.Query("CALL SelectProviderByName(?)", [data.isp]);
        
        await MySQL.Query("CALL UpdateNodeLocation(?,?,?,?,?)", [host, country[0].CountryID, provider[0].ProviderID, data.lon, data.lat]);
        console.log("Located:", host, data.country, data.isp, data.lon, data.lat);
    }
    static async Checker() {
        
        if (Math.floor(Math.random() * 10) !== 0) {
            var node = await MySQL.Query('CALL SelectOneNodeByState(1)'); // Check
            if (node.length == 0)
                await MySQL.Query("CALL ResetCheckedNodes()");
            else
                await Crawler.CheckNode(node[0].IP, node[0].Port);
        }
        if (Math.floor(Math.random() * 2) === 0) {
            var node = await MySQL.Query('CALL SelectRandomNodeByState(2)'); // Recheck
            if (node.length > 0)
                await Crawler.CheckNode(node[0].IP, node[0].Port)
            
        } else {
            var node = await MySQL.Query("CALL SelectUnlocatedNodeByState(2)");
            if (node.length > 0)
                await Crawler.Locator(node[0].IP);
        }
        setTimeout(Crawler.Checker, 2000);
    }
}

module.exports = Crawler;