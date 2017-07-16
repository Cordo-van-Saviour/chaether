var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Web3 = require('web3');

require('ssl-root-cas').inject();

/*
*-------------------------------------------*
*--- Setting an email watcher foundation ---*
*-------------------------------------------*
In this part of code we will be listening for
events on Ethereum blockchain which contracts
emit. Firstly, we define web provider that we
use for creating the connection with Ethereum
node. After that we define ABI and address of
our Solidity contract, set the span of blocks
that we watch, so that all of the foundations
for sending received data as an email is set.
*/

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var abi = web3.eth.contract([{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"message","type":"string"}],"name":"send","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"recipient","type":"address"},{"indexed":false,"name":"message","type":"string"}],"name":"Message","type":"event"}]),
contractAddress = '0xccfa1cb5b4b8ca01a9bfea2a74efe7d60e00806b',
     myContract = abi.at(contractAddress);
         events = myContract.allEvents({fromBlock: 0, toBlock:'latest'});


console.log("Eth Node Version: ", web3.version.node);
console.log("Network: " ,web3.version.network, web3.version.ethereum);
console.log("Connected: ", web3.isConnected(), web3.currentProvider);
console.log("syncing: ", web3.eth.syncing, ", Latest Block: ",web3.eth.blockNumber);
console.log("Accounts[0]: " , web3.eth.accounts[0], ":",web3.eth.getBalance(web3.eth.accounts[0]).toNumber());
console.log(new Date());
console.log("listening for events on ", contractAddress);

events.watch(function(error, event) {
  if (error) throw error;
  console.log(event.args.message);
  console.log(web3.toAscii(event.args.message));
});

function send() {
  var authorizedAccount = web3.eth.accounts[0],
    to                = document.getElementsByName('to')[0].value,
    message           = document.getElementsByName('message')[0].value;
  contract.send(to, message, {from: authorizedAccount});
}