#Solidity Pitfalls and Attacks
- Using Specific Compiler Pragma: Used ^0.8.10 to make sure the is stable and benefit from any new patches 
- Use Modifiers Only for Validation
- Proper use of .call and .delegateCall

Not used yet:
- Checks-Effects-Interactions (Avoiding state changes after external calls)
- Proper Use of Require, Assert and Revert: All validations are done using modifiers.
- Pull Over Push (Prioritize receiving contract calls over making contract calls)

#Smart Contract Pitfalls and Attacks
- Re-entrancy: Use openzeppelin ReentrancyGuard
- Timestamp Dependence
- Forcibly Sending Ether
- Tx.Origin Authentication

