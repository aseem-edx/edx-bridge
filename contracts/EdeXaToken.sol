// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EdexaToken is ERC20, ERC20Burnable, Pausable, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10 ** 18; // Maximum supply: 10 billion tokens

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "Exceeds maximum supply of 10 billion"
        );
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
