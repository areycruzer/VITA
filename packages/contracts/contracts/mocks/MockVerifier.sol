// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../verifiers/Groth16Verifier.sol";

contract MockVerifier is Groth16Verifier {
    bool public shouldPass = true;

    function setShouldPass(bool _shouldPass) external {
        shouldPass = _shouldPass;
    }

    function verifyProof(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[7] calldata _pubSignals
    ) public view override returns (bool) {
        return shouldPass;
    }
}
