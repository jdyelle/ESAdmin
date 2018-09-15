'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');

var clusterStatus = "This didn't work";

request('http://192.168.56.50:9200/_cluster/health', function (err, resp, body) {
    clusterStatus = JSON.parse(body);
    console.log(clusterStatus);
    // logic used to compare search results with the input from user
    //if (!body.query.results.RDF.item) {
    //    clusterStatus = "Unable to connect";
    //} else {
    //    craig = body.query.results.RDF.item[0]['about'];
    //}
});




console.log(clusterStatus);
console.log(' ');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'ES Monitor Overview', status: clusterStatus.status });
});

module.exports = router;
