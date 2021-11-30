// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

///@title Allows families to deposit, lock, unlock, and release funds for the benefits of their children.
///@author Adil Mezghouti
contract FamilyTrust is Ownable, ReentrancyGuard {
  address[] public admins;
  address[] public benefitors;
  enum Role {
    ADMIN,
    USER
  }
  string[] bucketTypes;    
  struct Bucket {
    uint balance;
    bool locked;
  }
  struct Account {
    string firstName;
    string lastName;
    Role role;
    bool enabled;
    bool exists;
  }
  mapping(address => Account) accounts;
  mapping(address => mapping(string => Bucket)) buckets;

  constructor() {
    benefitors = new address[](0);
    admins = new address[](0);
    bucketTypes = [
      'UNIVERSITY',
      'ALLOWANCES',
      'INHERITANCE'
    ];
  }

  event LogLocked(address _address, string bucket);
  event LogUnlocked(address _address, string bucket);
  event LogFunded(address sender, address receiver, string bucket, uint newBalance);
  event LogUnfunded(address sender, string bucket);
  event LogFundsReleased(address to, string bucket, uint amount);
  event LogAdminAdded(address sender, address admin);
  event LogAdminRemoved(address sender, address admin);
  event LogChildAdded(address sender, address child);
  event LogChildRemoved(address sender, address child);

  modifier onlyAdmins() {
    require(accounts[msg.sender].role == Role.ADMIN, "Only admins can call this");
    _;
  }

  modifier onlyBenefitors() {
    require(accounts[msg.sender].role == Role.USER, "Only benefitors can call this");
    _;
  }

  modifier enoughFunds(address _address, string memory _bucket) {
    require(buckets[_address][_bucket].balance > 0, "Balance is not enough");
    _;
  }

  modifier accountEnabled(address _address) {
    require(accounts[_address].enabled, "Account is disabled");
    _;
  }

  modifier existingAccount(address _address) {
    require(accounts[_address].exists, 'Account not found');
    _;
  }

  ///@notice Adds funds to the smart contract and associate them to a specific bucket
  ///@param _benefitor the address of the person who will be the recipient of the deposited funds
  ///@param _bucket the name of the bucket in which the funds will be deposited
  ///@notice Note that the funds will be assigned logically through buckets and will not be effectively owned by the benefitor until the admin/owner releases the funds to her
  function addFunds(address _benefitor, string memory _bucket) public payable accountEnabled(_benefitor) {
    buckets[_benefitor][_bucket] = Bucket({
      balance: msg.value,
      locked: false
    });
    emit LogFunded(msg.sender, _benefitor, _bucket, buckets[_benefitor][_bucket].balance);
  }

  ///@notice Moves the amount associated with a specific bucket to the provided address
  ///@param _to the address receiving the funds
  ///@param _fromBucket the bucket to which the funds are associated
  function releaseFunds(address payable _to, string memory _fromBucket) public onlyAdmins existingAccount(_to) enoughFunds(_to, _fromBucket) nonReentrant {
    uint oldBalance = buckets[_to][_fromBucket].balance;
    buckets[_to][_fromBucket].balance = 0;
    (bool success, ) = _to.call{value: oldBalance}("");
    require(success, "Transfer failed");
    emit LogFundsReleased(_to, _fromBucket, oldBalance);
  }

  function lockFunds(string memory _bucket, address _benefitor) public onlyAdmins {
    buckets[_benefitor][_bucket].locked = true;
  }

  function unlockFunds(string memory _bucket, address _benefitor) public onlyAdmins {
    buckets[_benefitor][_bucket].locked = false;
  }

  function addAdmin(address _admin, string memory _firstName, string memory _lastName) public onlyOwner {
    admins.push(_admin);
    accounts[_admin] = Account({
      firstName: _firstName,
      lastName: _lastName,
      role: Role.ADMIN,
      enabled: true,
      exists: true
    });
  }

  function removeAdmin(address _admin) public onlyOwner {
    accounts[_admin].enabled = false;
  }

  function addBenefitor(address _benefitor, string memory _firstName, string memory _lastName) public onlyAdmins returns(bool) {
    benefitors.push(_benefitor);
    accounts[_benefitor] = Account({
      firstName: _firstName,
      lastName: _lastName,
      role: Role.USER,
      enabled: true,
      exists: true
    });

    return true;
  }

  function removeBenefitor(address _benefitor) public onlyAdmins {
    delete accounts[_benefitor];
  }

  function toggleAccountAccess(address _address, bool hasAccess) public onlyOwner {
    accounts[_address].enabled = hasAccess;
  }

  function getAccountInfo(address _address) public view returns(
    string memory firstName,
    string memory lastName,
    bool isAdmin,
    bool enabled
    ) {
    firstName = accounts[_address].firstName;
    lastName = accounts[_address].lastName;
    isAdmin = accounts[_address].role == Role.ADMIN;
    enabled = accounts[_address].enabled;

    return (
      firstName,
      lastName,
      isAdmin,
      enabled
    );
  }

  function getBucketTypes() public view returns(string[] memory) {
    return bucketTypes;
  }

  function getBucketInfo(address _address, string memory _bucket) public view returns(
    string memory firstName,
    string memory lastName,
    bool enabled,
    uint balance,
    bool locked
  ) {
    firstName = accounts[_address].firstName;
    lastName = accounts[_address].lastName;
    enabled = accounts[_address].enabled;
    balance = buckets[_address][_bucket].balance;
    locked = buckets[_address][_bucket].locked;

    return (
      firstName,
      lastName,
      enabled,
      balance,
      locked
    );
  }

  function getBenefitors() public view returns(
    address benefitor1,
    address benefitor2,
    address benefitor3,
    uint len) {
    len = benefitors.length;
    if (benefitors.length > 0) benefitor1 = benefitors[0];
    if (benefitors.length > 1) benefitor2 = benefitors[1];
    if (benefitors.length > 2) benefitor3 = benefitors[2];
    return (
      benefitor1,
      benefitor2,
      benefitor3,
      len
    );
  }

  function getAdmins() public view returns(
    address admin1,
    address admin2,
    address admin3,
    uint len) {
    len = admins.length;
    if (admins.length > 0) admin1 = admins[0];
    if (admins.length > 1) admin2 = admins[1];
    if (admins.length > 2) admin3 = admins[2];

    return (
      admin1,
      admin2,
      admin3,
      len
    );
  }

  function getAdminInfo(address _address) public view returns(
    string memory firstName,
    string memory lastName,
    bool enabled
  ) {
    firstName = accounts[_address].firstName;
    lastName = accounts[_address].lastName;
    enabled = accounts[_address].enabled;

    return (
      firstName,
      lastName,
      enabled
    );
  }
}
