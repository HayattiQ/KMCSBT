// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import {Operable} from './Operable.sol';
import "./interface/IKMCbadge.sol";

contract KMCExchange is Ownable, Operable {
    using Strings for string;

    IKMCbadge private badge;
    mapping(uint256 => uint256) public amount;
    mapping(uint256 => uint256) public badgeID;

    constructor() {
        _grantOperatorRole(msg.sender);
        badge = IKMCbadge(0x02BDB15B131e2aF35Dd1DB5104Cc95aAD1BcAE5d);
    }

    function setWL(uint256 WhiteListID, uint256 burnID, uint256 _amount) public onlyOperator {
      amount[WhiteListID] = _amount;
      badgeID[WhiteListID] = burnID;
    }

    function burnAndMint (uint256 WhiteListID) public {
       require(amount[WhiteListID] > 0, "WhiteListID not set amount");
       require(badgeID[WhiteListID] > 0, "WhiteListID not set badgeID");
       require(
        badge.balanceOf(msg.sender, badgeID[WhiteListID]) >= amount[WhiteListID],
        "you don't have enough badge");
       badge.burnAdmin(msg.sender, badgeID[WhiteListID], amount[WhiteListID]);
       badge.mint(msg.sender, WhiteListID, 1);
    }

}