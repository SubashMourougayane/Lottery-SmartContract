// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract Inbox {
    string public message;

    constructor(string memory _message) {
        message = _message;
    }

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}
