const Crawler = require('../modules/crawler');

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

module.exports = router;