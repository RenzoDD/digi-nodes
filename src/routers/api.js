const Crawler = require('../modules/crawler');
const MySQL = require('../modules/mysql');

var express = require('express');
var router = express.Router();

router.all('/scan', async function (req, res) {
    var ip = req.body.ip;
    var port = req.body.port || 12024;

    var data = await Crawler.CheckNode(ip, port, true);
    if (data === false)
        data = { error: "Node unavailable" };

    res.send(data);
});
router.all('/subversions', async function (req, res) {
    var data = await MySQL.Query("CALL SelectNodesPerSubVersion ()");
    var answer = {};
    for (var row of data)
        answer[row.Name] = row.Quantity;
    res.send(answer);
});

module.exports = router;