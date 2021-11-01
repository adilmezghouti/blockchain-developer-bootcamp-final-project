// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
pragma experimental ABIEncoderV2;


contract FamilyTrust {
  address public owner;
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
  }

  mapping(address => Account) accounts;
  mapping(address => mapping(string => Bucket)) buckets;
  constructor() public {
    owner = msg.sender;
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
  event LogAdminAdded(address sender, address admin);
  event LogAdminRemoved(address sender, address admin);
  event LogChildAdded(address sender, address child);
  event LogChildRemoved(address sender, address child);

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owners can call this");
    _;
  }

  modifier onlyAdmins() {
    require(accounts[msg.sender].role == Role.ADMIN, "Only admins can call this");
    _;
  }

  modifier onlyBenefitors() {
    require(accounts[msg.sender].role == Role.USER, "Only benefitors can call this");
    _;
  }

  function addFunds(address _benefitor, string memory _bucket) public payable onlyAdmins() {
    buckets[_benefitor][_bucket] = Bucket({
      balance: msg.value,
      locked: false
    });
    emit LogFunded(msg.sender, _benefitor, _bucket, buckets[_benefitor][_bucket].balance);
  }

  function transferFunds(string memory fromBucket, address to) public onlyAdmins() {

  }

  function lockFunds(string memory _bucket, address _benefitor) public onlyAdmins() {
    buckets[_benefitor][_bucket].locked = true;
  }

  function unlockFunds(string memory _bucket, address _benefitor) public onlyAdmins {
    buckets[_benefitor][_bucket].locked = false;
  }

  function addAdmin(address _admin, string memory _firstName, string memory _lastName) public onlyOwner() {
    admins.push(_admin);
    accounts[_admin] = Account({
      firstName: _firstName,
      lastName: _lastName,
      role: Role.ADMIN,
      enabled: true
    });
  }

  function removeAdmin(address _admin) public onlyOwner() {    
    accounts[_admin].enabled = false;
  }

  function addBenefitor(address _benefitor, string memory _firstName, string memory _lastName) public onlyAdmins {    
    benefitors.push(_benefitor);
    accounts[_benefitor] = Account({
      firstName: _firstName,
      lastName: _lastName,
      role: Role.USER,
      enabled: true
    });
  }

  function removeBenefitor(address _benefitor) public onlyAdmins {
    accounts[_benefitor].enabled = false;
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
}
