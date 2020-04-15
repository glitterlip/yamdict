const nodeAbi = require('node-abi')

console.log(`electron-abi:${nodeAbi.getAbi('4.2.4', 'electron')}`);
console.log(`node-abi:${nodeAbi.getAbi('12.1.0', 'node')}`);
