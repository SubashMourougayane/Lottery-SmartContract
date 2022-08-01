// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract Lottery{
    address public manager;
    address[] public players;

    constructor(){
        manager = msg.sender;
    }

    modifier restricted(){
        require(manager == msg.sender);
        _;
    }  

    function enter () public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted{
        uint index = random() % players.length;
        address payable winnerAddress = payable(players[index]);
        winnerAddress.transfer(address(this).balance);
        players = new address[](0);
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }

   

}