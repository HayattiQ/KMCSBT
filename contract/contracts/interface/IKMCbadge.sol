// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IKMCbadge is IERC1155 {
    function burnAdmin(
        address to,
        uint256 id,
        uint256 amount
    ) external;

    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) external;

    function bound(address to, bool flag) external;

    function grantOperatorRole(address to) external;
}
