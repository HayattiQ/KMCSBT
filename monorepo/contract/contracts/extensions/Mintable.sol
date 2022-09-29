// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import {Strings} from '@openzeppelin/contracts/utils/Strings.sol';
import {Operable} from './Operable.sol';

abstract contract Mintable is Operable {
    bool public mintable;

    function setMintable(bool _state) public onlyOperator {
        mintable = _state;
    }

    modifier whenMintable() {
        require(mintable == true, 'Mintable: paused');
        _;
    }
}
