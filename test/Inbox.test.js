// @ts-ignore
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const mocha = require('mocha');
const { interface, bytecode } = require('../compile');
const web3 = new Web3(ganache.provider());


let accounts;
let inbox;
let INITIAL_MSG = 'Hi there!';
let CHANGE_MSG = 'Hello there!'
beforeEach(async () => {
    // get list of all acc.
    accounts = await web3.eth.getAccounts()

    // use one of these acc. to deploy the contract
    inbox = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode, arguments: [INITIAL_MSG] })
        .send({ from: accounts[0], gas: '1000000' })
})

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address)
    })

    it('has a default message', async () => {
        assert.equal(await inbox.methods.message().call(), INITIAL_MSG);
    })

    it('can change message', async () => {
        await inbox.methods.setMessage(CHANGE_MSG).send({ from: accounts[0] });
        assert.equal(await inbox.methods.message().call(), CHANGE_MSG);
    })
})