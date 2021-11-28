import React, {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import { formatEther } from '@ethersproject/units'
import FamilyTrustContract from './contracts/FamilyTrust.json'
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useContract} from "./hooks/useContract";

const Header = () => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const {account, library} = useWeb3React()
  const {contract, address: contractAddress} = useContract(FamilyTrustContract)
  const [accountBalance, setAccountBalance] = useState(0);
  const [owner, setOwner] = useState();
  const [contractBalance, setContractBalance] = useState()

  useEffect(() => {
    if (library) library.getBalance(account).then(balance => {
      setAccountBalance(formatEther(balance, 'ether'))
    })

    if (contractAddress) {
      library.getBalance(contractAddress).then(balance => {
        setContractBalance(formatEther(balance, 'ether'))
      })
    }

    if (contract) {
      contract.methods.owner().call().then(o => {
        setOwner(o);
      })
    }

  }, [contract, contractAddress, account])

  const handleCreateTrustClick = () => {
    console.log('creating new contract...')
  }

  return <Box
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
      <div>Role: {owner === account ? 'Owner/Admin' : 'Benefitor'}</div>
      <div>Address: {account}</div>
      <div>Balance: {accountBalance} ETH</div>
    </div>
    <div style={{marginBottom: '10px'}}>
      <div style={{fontWeight: 'bold', marginBottom: 10}}>Owner</div>
      {owner ? <div>{owner}</div> : <Button variant={'outlined'} onClick={handleCreateTrustClick}>Create a Trust Fund</Button>}
    </div>
    <div style={{marginBottom: '10px'}}>
      <div style={{fontWeight: 'bold', marginBottom: 10}}>Smart Contract</div>
      {!!contractAddress && contractAddress !== ZERO_ADDRESS ? <>
        <div>Address: {contractAddress}</div>
        <div>Balance: {contractBalance} ETH</div>
      </> : <div>You need to to create a Trust Fund</div>
      }
    </div>
  </Box>
}

export  default Header