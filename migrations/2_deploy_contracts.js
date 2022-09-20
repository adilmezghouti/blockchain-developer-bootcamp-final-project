//var SimpleBank = artifacts.require("./SimpleBank.sol");
var FamilyTrust = artifacts.require("./FamilyTrust.sol");

module.exports = function (deployer) {
  //deployer.deploy(SimpleBank);
  deployer.deploy(FamilyTrust);

};


