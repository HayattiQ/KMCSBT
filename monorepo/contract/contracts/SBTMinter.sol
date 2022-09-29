// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import {Operable} from './extensions/Operable.sol';
import {Mintable} from './extensions/Mintable.sol';
import './interface/IKMCbadge.sol';

contract SBTMinter is Ownable, Operable, Mintable {
    using Strings for string;

    IKMCbadge private badge;
    uint256 public mintID;

    constructor() {
        _grantOperatorRole(msg.sender);
        setBadgeAddress(0x7488c29913b5568d46226530Cd0600bc96e12228);
        setMintable(true);
        setMintID(5);
    }

    function setMintID(uint256 _ID) public onlyOperator {
        mintID = _ID;
    }

    function setBadgeAddress(address _address) public onlyOperator {
        badge = IKMCbadge(_address);
    }

    function mintTo(address _address) public onlyOperator {
        badge.mint(_address, mintID, 1);
    }

    function mint() public whenMintable {
        require(badge.balanceOf(msg.sender, mintID) == 0, 'already minted');
        badge.mint(msg.sender, mintID, 1);
    }
}
