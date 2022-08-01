const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })
})


describe('Lottery Contract', () => {
    it('deploys', () => {
        assert.ok(lottery.options.address);
    });

    it('one person can enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length)
    })

    it('multile persons can enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.03', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.03', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length)
    })

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200
            });
            assert(false)
        } catch (error) {
            assert(error);
        }
    })

    it('only manager can pick winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false)
        } catch (error) {
            assert(error);
        }
    })



    it('sends money to winner and reset the pool', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('5', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })
        const currentBalance = await web3.eth.getBalance(accounts[0]);
        const difference = currentBalance - initialBalance;

        const playerList = await lottery.methods.getPlayers().call({from : accounts[0]})
        assert.equal(0, playerList.length);
        assert.equal(0,await web3.eth.getBalance(lottery.options.address))
        assert(difference > web3.utils.toWei('1.8', 'ether'));

    })


})