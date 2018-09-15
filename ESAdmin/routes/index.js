'use strict';
var express = require('express');
var router = express.Router();
var sr = require('sync-request');

/*  -- I don't know why I'm leaving this in here, probably because I don't have source control yet and I want to remember how to do async requests. --
 
var clusterHealth = "This didn't work";
var nodeStatus = "This didn't work";
var clusterStats = "This didn't work";
var clusterResources = { cpu: 0, mem: 0, disk: 0 }; 


request('http://192.168.56.50:9200/_cluster/health', function (err, resp, body) {
    clusterHealth = JSON.parse(body);    
});

request('http://192.168.56.50:9200/_nodes', function (err, resp, body) {
    nodeStatus = JSON.parse(body);
});

request('http://192.168.56.50:9200/_cluster/stats', function (err, resp, body) {
    clusterStats = JSON.parse(body);
    clusterResources.cpu = clusterStats.nodes.process.cpu.percent;
    clusterResources.mem = clusterStats.nodes.os.mem.used_percent;
    clusterResources.disk = parseInt((clusterStats.nodes.fs.total_in_bytes - clusterStats.nodes.fs.free_in_bytes) / clusterStats.nodes.fs.total_in_bytes * 100);
});  */




/* GET home page. */
router.get('/', function (req, res) {
    var clusterHealth = "This didn't work";
    var nodeStatus = "This didn't work";
    var clusterStats = "This didn't work";
    var clusterResources = { cpu: 0, mem: 0, disk: 0 };
  
    clusterHealth = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_cluster/health').getBody('utf8')); 
    nodeStatus = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_nodes').getBody('utf8'));
    clusterStats = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_cluster/stats').getBody('utf8'));

    clusterResources.cpu = clusterStats.nodes.process.cpu.percent;
    clusterResources.mem = parseInt(clusterStats.nodes.jvm.mem.heap_used_in_bytes / clusterStats.nodes.jvm.mem.heap_max_in_bytes * 100);
    clusterResources.disk = parseInt((clusterStats.nodes.fs.total_in_bytes - clusterStats.nodes.fs.free_in_bytes) / clusterStats.nodes.fs.total_in_bytes * 100);

    res.render('index', { title: 'ES Monitor Overview', clusterHealth: clusterHealth, nodeStatus: nodeStatus, clusterResources: clusterResources });
});

module.exports = router;
