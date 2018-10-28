'use strict';
var express = require('express');
var router = express.Router();
var sr = require('sync-request');
var traverse = require('traverse');

/* GET home page. */
router.get('/', function (req, res) {

    var nodeStats = "This didn't work";
    var clusterHealth = "This didn't work";
    nodeStats = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_nodes/stats').getBody('utf8'));
    clusterHealth = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_cluster/health').getBody('utf8'));

    var nodeList = {};
    var nodeCount = 0;

    traverse(nodeStats.nodes).forEach(function (item) {
        if (item.hasOwnProperty('roles')) {

            var currentNode = {};          

            currentNode.HostName = this.node.name;
            currentNode.hostDisk = parseInt((this.node.fs.total.total_in_bytes - this.node.fs.total.free_in_bytes) / this.node.fs.total.total_in_bytes);
            currentNode.hostMem = parseInt(this.node.os.mem.used_percent);
            currentNode.hostCPU = parseInt(this.node.os.cpu.percent);

            currentNode.esAddress = this.node.host;
            currentNode.esMem = parseInt(this.node.jvm.mem.heap_used_percent);
            currentNode.esCPU = parseInt(this.node.process.cpu.percent);

            nodeList[nodeCount] = currentNode;
            nodeCount++;
        }
    });


    res.render('nodes', { title: 'ES Monitor Overview', clusterHealth: clusterHealth, nodes: nodeList });
});

module.exports = router;
