'use strict';
var express = require('express');
var router = express.Router();
var sr = require('sync-request');
var traverse = require('traverse');

/* GET home page. */
router.get('/', function (req, res) {
    var clusterHealth = "This didn't work";
    var nodeStatus = {};
    //var clusterStats = "This didn't work";
    var nodeStats = "This didn't work";
    var memSum = 0;
    var memCount = 0;
    var diskSum = 0;
    var diskCount = 0;
    var cpuSum = 0;
    var cpuCount = 0;
    var nodeCount = 0;
    var clusterResources = { cpu: 0, mem: 0, disk: 0 };
  
    clusterHealth = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_cluster/health').getBody('utf8')); 
    //nodeStatus = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_nodes').getBody('utf8'));
    //clusterStats = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_cluster/stats').getBody('utf8'));
    nodeStats = JSON.parse(sr('GET', 'http://192.168.56.50:9200/_nodes/stats').getBody('utf8'));

    traverse(nodeStats.nodes).forEach(function (item) {
        if (item.hasOwnProperty('roles')) {
            var dataNode = false;
            var nodeRoles = traverse(this.node.roles).reduce(function (acc, x) {
                if (this.isLeaf) acc.push(x);
                return acc;
            }, []);

            nodeRoles.forEach(function (element) {
                if (element === 'data') {
                    dataNode = true;
                }
            });            

            if (dataNode) {
                memSum += this.node.jvm.mem.heap_used_percent;
                memCount += 1;
                diskSum += parseInt((this.node.fs.total.total_in_bytes - this.node.fs.total.free_in_bytes) / this.node.fs.total.total_in_bytes );
                diskCount += 1;
            }

            cpuSum += this.node.os.cpu.percent;
            cpuCount += 1;

            nodeStatus[nodeCount] = { name: this.node.name, host: this.node.host, roles: nodeRoles };
            nodeCount++;
        }
    });

    clusterResources.cpu = parseInt(cpuSum / cpuCount);
    clusterResources.mem = parseInt(memSum / memCount);
    clusterResources.disk = parseInt(diskSum / diskCount);

    res.render('index', { title: 'ES Monitor Overview', clusterHealth: clusterHealth, nodeStatus: nodeStatus, clusterResources: clusterResources });
});

module.exports = router;
