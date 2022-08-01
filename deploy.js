const HDWallerProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const provider = new HDWallerProvider(
    'disorder consider toddler steak novel unveil piece omit laugh poet license glow',
    'https://ropsten.infura.io/v3/c535946d0225477f921bdb201975d0aa'
);

const web3 = new Web3(provider);

const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();

    console.log(`Attempting to deploy from account ${accounts[0]}`);

    const result = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode})
        .send({ gas: '1000000', from: accounts[0]});

    console.log(`Contract deployed to ${result.options.address}`);
}

deploy();