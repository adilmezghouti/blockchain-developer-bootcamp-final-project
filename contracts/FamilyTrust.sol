// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract FamilyTrust {
  address public owner;
  enum BUCKET {
    UNIVERSITY,
    ALLOWANCES,
    INHERITANCE
  }
  struct Account {
    string firstName;
    string lastName;
    mapping(string => uint) balances;
  }

  mapping(string => Account) accounts;
  constructor() public {
    owner = msg.sender;
  }

  event LogLocked(address _address, string bucket);
  event LogUnlocked(address _address, string bucket);
  event LogFunded(address sender, string bucket);
  event LogUnfunded(address sender, string bucket);
  event LogAdminAdded(address sender, address admin);
  event LogAdminRemoved(address sender, address admin);
  event LogChildAdded(address sender, address child);
  event LogChildRemoved(address sender, address child);

  modifier onlyOwner() {

  }

  modifier onlyParents() {

  }

  modifier onlyChildren() {

  }

  function addFunds(string bucket) {

  }

  function withdrawFunds(string bucket) {

  }

  function lockFunds(string bucket) {

  }

  function unlockFunds(string bucket) {

  }

  function addAdmin(address admin) {

  }

  function removeAdmin(address admin) {

  }

  function addChild(address child) {

  }

  function removeChild(address child) {

  }
}
