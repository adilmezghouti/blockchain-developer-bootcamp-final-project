// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

///@title Allows families to deposit, lock, unlock, and release funds for the benefit of their children.
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
    uint256 timestamp;
  }
  


    mapping(address => Account) accounts ;
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

  //*******************EVENTS***********************

  event LogLocked(address _address, string bucket);
  event LogUnlocked(address _address, string bucket);
  event LogFunded(address sender, address receiver, string bucket, uint newBalance);
  event LogUnfunded(address sender, string bucket);
  event LogFundsReleased(address to, string bucket, uint amount);
  event LogAdminAdded(address sender, address admin);
  event LogAdminRemoved(address sender, address admin);
  event LogBenefitorAdded(address sender, address benefitor);
  event LogBenefitorRemoved(address sender, address benefitor);

  //*******************MODIFIERS********************


  modifier onlyAdmins(){
      require(accounts[msg.sender].role == Role.ADMIN, "function reserved to ADMINS only");
      _;
  }
  modifier onlyBenefitors(){
      require(accounts[msg.sender].role == Role.ADMIN, "function reserved to BENEFITORS only");
      _;
  }

  modifier timeStampReached(address _address){
      require(accounts[_address].timestamp <= block.timestamp, "it's to soon to use your funds");
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

  //********************FUNCTIONS***********************

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
  function releaseFunds(address payable _to, string memory _fromBucket) public onlyAdmins existingAccount(_to) enoughFunds(_to, _fromBucket) nonReentrant timeStampReached(_to){
    uint oldBalance = buckets[_to][_fromBucket].balance;
    buckets[_to][_fromBucket].balance = 0;
    (bool success, ) = _to.call{value: oldBalance}("");
    require(success, "Transfer failed");
    emit LogFundsReleased(_to, _fromBucket, oldBalance);
  }

    ///@notice Lock funds
  ///@param _bucket the bucket that will be locked
  ///@param _benefitor the account that the bucket belongs to
  function lockFunds(string memory _bucket, address _benefitor) public onlyAdmins {
    buckets[_benefitor][_bucket].locked = true;
    emit LogLocked(_benefitor, _bucket);
  }

  ///@notice Unlocks funds
  ///@param _bucket the bucket that will be unlocked
  ///@param _benefitor the account that the bucket belongs to
  function unlockFunds(string memory _bucket, address _benefitor) public onlyAdmins {
    buckets[_benefitor][_bucket].locked = false;
    emit LogUnlocked(_benefitor, _bucket);
  }

    ///@notice Adds an admin account
  ///@param _firstName first name of the user
  ///@param _lastName last name of the user
  function addAdmin(address _admin, string memory _firstName, string memory _lastName) public onlyOwner {
    admins.push(_admin);
    accounts[_admin] = Account({
      firstName: _firstName,
      lastName: _lastName,
      role: Role.ADMIN,
      enabled: true,
      exists: true,
      timestamp: 0
    });
    emit LogAdminAdded(msg.sender, _admin);
  }

    ///@notice Disables an account
  ///@param _admin the address that will be disabled
  function removeAdmin(address _admin) public onlyOwner {
    accounts[_admin].enabled = false;
    emit LogAdminRemoved(msg.sender, _admin);
  }

    ///@notice Adds a benefitor account
  ///@param _benefitor the account address
  ///@param _firstName the first name of the account/user
  ///@param _lastName the last name of the account/user
  function addBenefitor(address _benefitor, string memory _firstName, string memory _lastName, uint256 _timestamp) public onlyAdmins returns(bool) {
    benefitors.push(_benefitor);
    accounts[_benefitor] = Account({
      firstName: _firstName,
      lastName: _lastName,
      role: Role.USER,
      enabled: true,
      exists: true,
      timestamp: _timestamp
    });

    emit LogBenefitorAdded(msg.sender, _benefitor);
    return true;
  }

    ///@notice Deletes a benefitor account
  ///@param _benefitor the account address
  function removeBenefitor(address _benefitor) public onlyAdmins {
    delete accounts[_benefitor];
    emit LogBenefitorRemoved(msg.sender, _benefitor);
  }

  ///@notice Enables/Disables an account
  ///@param _address the account address
  ///@param _hasAccess whether the access is enabled/disabled
  function toggleAccountAccess(address _address, bool _hasAccess) public onlyOwner {
    accounts[_address].enabled = _hasAccess;
  }

  ///@notice Returns account info for a given address
  ///@param _address the account address
  function getAccountInfo(address _address) public view returns(
    string memory firstName,
    string memory lastName,
    bool isAdmin,
    bool enabled,
    uint256 timestamp
    ) {
    firstName = accounts[_address].firstName;
    lastName = accounts[_address].lastName;
    isAdmin = accounts[_address].role == Role.ADMIN;
    enabled = accounts[_address].enabled;
    timestamp = accounts[_address].timestamp;

    return (
      firstName,
      lastName,
      isAdmin,
      enabled,
      timestamp
    );
  }

  ///@notice returns the bucket types
  function getBucketTypes() public view returns(string[] memory) {
    return bucketTypes;
  }

  ///@notice Returns a bucket info
  ///@param _address the account address
  ///@param _bucket the bucket name
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
    ///@notice Returns the list of benefitors
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

  ///@notice Returns the list of admins
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

  ///@notice Returns the admin info
  ///@param _address the account address
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

  function getTimestamp() public view returns(uint256)
    {
        return block.timestamp;
    }

// History of Transactions Tools

 uint256 transactionCount ;

    event Transfer(address from, address receiver, string reveiverName, uint amount, uint256 timestamp, uint256 uD);
  
    struct TransferStruct {
        uint TransactID;
        address sender;
        address receiver;
        string receiverFullName;
        uint amount;
        uint256 timestamp;
        uint256 unlockdate;
    }

    TransferStruct[] public transactions;

    mapping(uint256 => TransferStruct) transact ;


    function addToBlockchain(address payable receiver, string memory receiverFullname, uint amount, uint256 uD) public {
        transactionCount += 1;
        transactions.push(TransferStruct(transactionCount ,msg.sender, receiver, receiverFullname ,amount, block.timestamp, uD ));

        emit Transfer(msg.sender, receiver, receiverFullname, amount, block.timestamp,uD );
    }
    
    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionInfo(uint256  transCount) public view returns(
        uint transactID,
        address sender,
        address receiver,
        string memory receiverFullName,
        uint amount,
        uint256 timestamp,
        uint256 unlockDate )
        {
            transactID = transact[transCount].TransactID ;
            sender = transact[transCount].sender;
            receiver = transact[transCount].receiver;
            receiverFullName = transact[transCount].receiverFullName;
            amount = transact[transCount].amount;
            timestamp = transact[transCount].timestamp;
            unlockDate = transact[transCount].unlockdate;

            return (
                transactID,
                sender,
                receiver,
                receiverFullName,
                amount,
                timestamp,
                unlockDate
            );
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

}
