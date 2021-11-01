const FamilyTrust = artifacts.require("FamilyTrust");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FamilyTrust", function (accounts) {
  const [_owner, alice, bob] = accounts;
  let instance;

  beforeEach(async () => {
    instance = await FamilyTrust.new();
  })

  describe('Use cases', () => {
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
      await instance.addBenefitor(alice, 'alice', 'foo');
      const account = await instance.getAccountInfo(alice);
      return assert.isTrue(account.firstName == 'alice' && !account.isAdmin, 'The contract is missing a benefitor');
    })

    it('should have an admin', async () => {
      await instance.addAdmin(alice, 'alice', 'foo');
      const account = await instance.getAccountInfo(alice);
      return assert.isTrue(account.firstName == 'alice' && account.isAdmin, 'The contract is missing an admin');
    })

    it('should have populated buckets', async () => {
      const bucketTypes = await instance.getBucketTypes();
      return assert.isTrue(bucketTypes.length == 3 && bucketTypes[0] == 'UNIVERSITY', 'The contract bucket types are not not defined');
    })

    it('should have a positive balance', async () => {
      await instance.addBenefitor(bob, 'bob', 'foo');
      await instance.addFunds(bob, 'UNIVERSITY', { from: _owner, value: 10 });
      const bucketInfo = await instance.getBucketInfo(bob, 'UNIVERSITY');
      return assert.isTrue(bucketInfo.balance.toString() == '10', 'Benefitor is missing some money in her bucket');
    })
  })


});
