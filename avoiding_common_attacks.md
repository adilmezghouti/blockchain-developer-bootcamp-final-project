#Solidity Pitfalls and Attacks
- Using Specific Compiler Pragma: Used ^0.8.10 to make sure the is stable and benefit from any new patches 
- Used Modifiers Only for Validation
- Used Requires to check if if a transfer went through
- Proper use of .call and .delegateCall

Not used yet:
- Checks-Effects-Interactions (Avoiding state changes after external calls)
- Proper Use of Require, Assert and Revert: All validations are done using modifiers.
- Pull Over Push (Prioritize receiving contract calls over making contract calls)

#Smart Contract Pitfalls and Attacks
- SWC-107 (Re-entrancy): Used openzeppelin ReentrancyGuard
- Timestamp Dependence
- Forcibly Sending Ether
- Tx.Origin Authentication

