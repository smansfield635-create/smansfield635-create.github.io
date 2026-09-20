// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArchcoinFixedSupply is ERC20 {
    constructor(string memory name_, string memory symbol_, address recipient_, uint256 supply_)
        ERC20(name_, symbol_)
    {
        require(recipient_ != address(0), "recipient zero");
        require(supply_ > 0, "supply zero");
        _mint(recipient_, supply_);
    }
}
