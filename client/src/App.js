import React, { useState, useEffect } from "react";
import FamilyTrustContract from "./contracts/FamilyTrust.json";
import getWeb3 from "./getWeb3";
import VerticalTabs from "./VerticalTabs";

import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();

  const init = async () => {
    try {
      // Get network provider and web3 instance.
      setWeb3(await getWeb3());

      // Use web3 to get the user's accounts.
      setAccounts(await web3.eth.getAccounts());

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FamilyTrustContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FamilyTrustContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      await instance.methods.addBenefitor(accounts[0], 'Adam', 'Mezghouti');
      console.log((await instance.benefitors), accounts[0]);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setContract(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }
  useEffect(() => {
    init();
  })

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show
        a stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 42</strong> of App.js.
      </p>
      <div>The stored value is:</div>
      <VerticalTabs />
    </div>
  );
}

export default App;
