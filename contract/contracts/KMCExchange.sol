// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import {Operable} from './Operable.sol';
import './interface/IKMCbadge.sol';

contract KMCExchange is Ownable, Operable {
    using Strings for string;

    IKMCbadge private badge;

    struct Exchanges {
        string name;
        uint256 amount;
        uint256 badgeID;
        uint256 totalCap;
        uint256 claimed;
        bool expired;
    }
    mapping(uint256 => Exchanges) public exchange;

    constructor() {
        _grantOperatorRole(msg.sender);
        setBadgeAddress(0x02BDB15B131e2aF35Dd1DB5104Cc95aAD1BcAE5d);
    }

    function setBadgeAddress(address _address) public onlyOperator {
        badge = IKMCbadge(_address);
    }

    function getExchangeData(uint256 ExchangeID)
        public
        view
        returns (Exchanges memory)
    {
        return exchange[ExchangeID];
    }

    function setWL(
        string memory name,
        uint256 ExchangeID,
        uint256 burnID,
        uint256 _amount,
        uint256 totalCap
    ) public onlyOperator {
        exchange[ExchangeID].name = name;
        exchange[ExchangeID].amount = _amount;
        exchange[ExchangeID].badgeID = burnID;
        exchange[ExchangeID].totalCap = totalCap;
    }

    function burnAndMint(uint256 ExchangeID) public {
        require(exchange[ExchangeID].amount > 0, 'WhiteListID not set amount');
        require(
            exchange[ExchangeID].totalCap >= exchange[ExchangeID].claimed,
            'Already Claimed MAX'
        );
        require(
            badge.balanceOf(msg.sender, exchange[ExchangeID].badgeID) >=
                exchange[ExchangeID].amount,
            "you don't have enough badge"
        );
        badge.burnAdmin(
            msg.sender,
            exchange[ExchangeID].badgeID,
            exchange[ExchangeID].amount
        );
        badge.mint(msg.sender, ExchangeID, 1);
        exchange[ExchangeID].claimed = exchange[ExchangeID].badgeID + 1;
    }
}
