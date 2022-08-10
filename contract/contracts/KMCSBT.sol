// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


contract KMCSBT is ERC1155URIStorage, Ownable {
	using Strings for string;

	string public name = "Kawaii Meta Collage SBT";
	string public symbol = "KMCSBT";
  mapping (address => bool) bondedAddress;

	constructor() ERC1155("") {

	}

	function setApprovalForAll(address /* operator */, bool /* approved */) public virtual override {
		revert("Cannot approve, transferring not allowed");
	}

  function locked(address to) external view returns (bool){
     return bondedAddress[to];
	}

	function bound(address to, bool flag) public onlyOwner {
    bondedAddress[to] = flag;
  }

	function setBaseURI(string memory uri_) external onlyOwner {
		_setBaseURI(uri_);
	}

	function setTokenURI(uint256 tokenId, string memory _tokenURI) external onlyOwner {
		_setURI(tokenId, _tokenURI);
	}

	function initializeSBT(uint256 tokenId, string memory _tokenURI) public onlyOwner {
		require(bytes(uri(tokenId)).length == 0, "SBT already exists");
		_mint(msg.sender, tokenId, 1, "");
		_setURI(tokenId, _tokenURI);
	}

	function mint(address to, uint256 id, uint256 amount) public onlyOwner {
		require(bytes(uri(id)).length != 0, "Not initialized");
		_mint(to, id, amount, "");
	}

	function burn(address to, uint256 id, uint256 amount) public onlyOwner {
		_burn(to, id, amount);
	}

	function _beforeTokenTransfer(
		address operator,
		address from,
		address to,
		uint256[] memory ids,
		uint256[] memory amounts,
		bytes memory data
	) internal virtual override {
		console.log("tokentransfer", operator,from,to,ids,amounts,data);

		if (operator != owner() || bondedAddress[operator] == false) {
			revert("Sending not allowed");
		}
		super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
	}

}