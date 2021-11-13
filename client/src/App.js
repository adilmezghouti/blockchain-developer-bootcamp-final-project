import React, { useState, useEffect } from "react";
import FamilyTrustContract from "./contracts/FamilyTrust.json";
import getWeb3 from "./getWeb3";
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import VerticalTabs from "./VerticalTabs";

import "./App.css";
import Box from "@mui/material/Box";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [owner, setOwner] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const [benefitors, setBenefitors] = useState();

  const init = async () => {
    try {
      // Get network provider and web3 instance.
      const _web3 = await getWeb3();
      console.log('web3', _web3)
      setWeb3(_web3);

      const _accounts = await _web3.eth.getAccounts()
      setSelectedAddress(_accounts[0])
      setAccounts(_accounts);

      // Get the contract instance.
      const networkId = await _web3.eth.net.getId();
      console.log('networkId: ', networkId)
      const deployedNetwork = FamilyTrustContract.networks[networkId];
      const instance = new _web3.eth.Contract(
        FamilyTrustContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setOwner(await instance.methods.owner().call())
      const success = await instance.methods.addBenefitor(_accounts[0], 'Adam', 'Mezghouti').call();
      console.log('success: ', success)
      const response = await instance.methods.getBenefitors().call()
      setBenefitors(response)
      console.log('response: ', response);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setContract(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      error);
    }
  }
  useEffect(() => {
    init();
  })

  const handleCreateTrustClick = () => {
    console.log('creating...');
  }

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <Container fixed>
      <Box
        sx={{ flexGrow: 1,
          display: 'inline-flex',
          flexWrap: 'wrap',
          gap: '12px',
          flexDirection: 'row',
          justifyItems: 'stretch',
          alignItems: 'center',
          border: '1px solid #EFEFEF',
          marginTop: '20px',
          marginBottom: '20px',
          padding: '20px'
        }}
      >
        <div style={{marginBottom: '10px'}}>
          <div style={{fontWeight: 'bold', marginBottom: 10}}>Connected Account</div>
          <div>{accounts && accounts[0]}</div>
        </div>
        <div style={{marginBottom: '10px'}}>
          <div style={{fontWeight: 'bold', marginBottom: 10}}>Owner</div>
          {owner ? <div>{owner}</div> : <Button variant={'outlined'} onClick={handleCreateTrustClick}>Create a Trust Fund</Button>}
        </div>
      </Box>
      <VerticalTabs benefitors={benefitors} />
    </Container>
  );
}


export default App;
