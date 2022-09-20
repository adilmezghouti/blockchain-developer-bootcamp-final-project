const FamilyTrust = artifacts.require("FamilyTrust");
const Transactions = artifacts.require("Transactions");
let BN = web3.utils.BN;

module.exports = function(deployer){
  deployer.deploy(Transactions);
};

contract("FamilyTrust", function (accounts) {
  const [_owner, alice, bob] = accounts;
  let instance;

  beforeEach(async () => {
    instance = await FamilyTrust.new();
  })

  describe('FamilyTrust Unit Tests', () => {
    it("should assert true", async function () {
      await FamilyTrust.deployed();
      return assert.isTrue(true);
    });

    it("should have an owner", () => {
      return assert.equal(typeof instance.owner, 'function', 'The contract has no owner');
    })

    it('should have the correct owner', async () => {
      return assert.equal(_owner, (await instance.owner()), 'The contract does not have the correct owner');
    })

    it('should have a benefitor', async () => {
      await instance.addBenefitor(alice, 'alice', 'foo',13000);
      const account = await instance.getAccountInfo(alice);
      return assert.isTrue(account.firstName === 'alice' && !account.isAdmin, 'The contract is missing a benefitor');
    })

    it('should have a populated benefitors array', async () => {
      await instance.addBenefitor(alice, 'alice', 'foo',13000);
      const benefitors = await instance.getBenefitors();
      return assert.isTrue(benefitors.len.toString() === '1', 'The contract is missing a benefitor');
    })

    it('should have an admin', async () => {
      await instance.addAdmin(alice, 'alice', 'foo');
      const account = await instance.getAccountInfo(alice);
      return assert.isTrue(account.firstName === 'alice' && account.isAdmin, 'The contract is missing an admin');
    })

    it('should have populated buckets', async () => {
      const bucketTypes = await instance.getBucketTypes();
      return assert.isTrue(bucketTypes.length === 3 && bucketTypes[0] === 'UNIVERSITY', 'The contract bucket types are not not defined');
    })

    it('should have a positive balance', async () => {
      await instance.addBenefitor(bob, 'bob', 'foo',13000);
      await instance.addFunds(bob, 'UNIVERSITY', { from: _owner, value: 10 });
      const bucketInfo = await instance.getBucketInfo(bob, 'UNIVERSITY');
      return assert.isTrue(bucketInfo.balance.toString() === '10', 'Benefitor is missing some money in her bucket');
    })


    it('should release funds', async () => {
      await instance.addBenefitor(bob, 'bob', 'foo',1);
      await instance.addFunds(bob, 'UNIVERSITY', { from: _owner, value: 10 });

      const bobBalanceBefore = await web3.eth.getBalance(bob);
      await instance.releaseFunds(bob, 'UNIVERSITY');
      const bucketInfo = await instance.getBucketInfo(bob, 'UNIVERSITY');
      const bobBalanceAfter = await web3.eth.getBalance(bob);
      return assert.isTrue(bucketInfo.balance.toString() === '0' && new BN(bobBalanceAfter).sub(new BN(bobBalanceBefore)).toString() === '10', 'Benefitor should have 0 balance in the university bucket and 10 in the actual address');
    })
  })
  it("should add to transactions list", async() => {
    await instance.addToBlockchain(alice,'alice', 1, 1000000000);
    const transactions = await instance.getAllTransactions();
    return assert.isTrue(transactions.length == 1 , "failed to add transactions")
  });


});

