'use strict';

/**
 * @ngdoc function
 * @name chaetherApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chaetherApp
 */
angular.module('chaetherApp')
  .controller('MainCtrl', ['$rootScope', '$scope', '$q', function ($rootScope, $scope, $q) {

    if (typeof web3 === 'undefined')
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    if (typeof web3 !== 'undefined') {
      var abi = web3.eth.contract([{"constant":false,"inputs":[{"name":"sender","type":"string"},{"name":"recipient","type":"string"},{"name":"message","type":"string"}],"name":"send","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"string"},{"indexed":false,"name":"recipient","type":"string"},{"indexed":false,"name":"message","type":"string"}],"name":"Message","type":"event"}]);
      var Chaether = abi.at('0xF082F801e9Ff939E5af64147E8e71e92B82e203b');
      var events = Chaether.allEvents({fromBlock: 0, toBlock: 'latest'});

      $scope.messages = [];
      // watch for changes

      events.watch(function (error, event) {
        console.log(error, event);
        if (!error) {
          $scope.messages.push(event.args);
          $scope.$apply();
        }
      });

      $scope.sendMessage = function () {

        var authorizedAccount = web3.eth.accounts[0],
          sendTo = $scope.message.to,
          subject = $scope.message.subject,
          message = $scope.message.body;

        console.log(sendTo, subject, message);

        Chaether.send(sendTo, subject, message, {from: authorizedAccount, gas: 100000}, function (err, address) {
          if (err) {
            console.log("Aaaaaaaaw snap! You dun goofed! error: " + err)
          } else {
            console.log("Great success!!! :Borat Disco Dance: address - " + address)
          }
        });
      }
    }
  }]);
