const MySQL = require('../modules/mysql');

var express = require('express');
var router = express.Router();

router.all('/', async function (req, res) {
    var peers = await MySQL.Query("CALL SelectAllNodesCountryLocation()");

    var subversions = await MySQL.Query("CALL SelectNodesPerSubVersion()");
    var answer = {};
    for (var row of subversions)
        answer[row.Name] = row.Quantity;
    subversions = answer;

    var countries = await MySQL.Query("CALL SelectNodesPerCountry ()");
    var answer = {};
    for (var row of countries)
        answer[row.Name] = row.Quantity;
    countries = answer;

    res.render("index", { peers, subversions, countries });
});

module.exports = router;