// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {MyToken} from "./MyToken.sol";

contract WrappedMyToken is MyToken {
    constructor(
        string memory TokenName,
        string memory TokneSymbol
    ) MyToken(TokenName, TokneSymbol) {}

    function safeMintWrappedMyToken(address to, uint256 Tokenid) public {
        _safeMint(to, Tokenid);
    }
}
