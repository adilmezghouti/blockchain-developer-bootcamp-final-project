import React, {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import { formatEther } from '@ethersproject/units'
import FamilyTrustContract from './contracts/FamilyTrust.json'
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useContract} from "./hooks/useContract";
import Typography from "@mui/material/Typography";
import AddressBlock from "./AddressBlock";


const Header = () => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const {account, library} = useWeb3React()
  const {contract, address: contractAddress} = useContract(FamilyTrustContract)
  const [accountBalance, setAccountBalance] = useState(0);
  const [owner, setOwner] = useState();
  const [contractBalance, setContractBalance] = useState()
  const [shouldLengthenAddress, setShouldLengthenAddress] = useState('')

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
    sx={{
      flexGrow: 1,
      display: 'inline-flex',
      flexWrap: 'wrap',
      gap: '12px',
      flexDirection: 'row',
      justifyItems: 'stretch',
      alignItems: 'flex-start',
      border: '1px solid #EFEFEF',
      marginTop: '20px',
      marginBottom: '20px',
      padding: '10px'
    }}
  >
    <Box sx={{
      display: 'flex',
      flexDirection: "column",
      border: '1px solid #EFEFEF',
      marginTop: '5px',
      marginBottom: '5px',
      padding: '10px',
      height: '145px'
    }}>
      <Typography variant="h4" component="div" sx={{marginRight: 5 }}>
        Connected Account
      </Typography>
      <div style={{display: 'flex', flexDirection: "row", alignItems: 'center'}}>
        <Typography variant="body1" component="div" sx={{marginRight: 5 }}>
          Role:
        </Typography>
        <Typography variant="body1" component="div" sx={{marginRight: 5 }}>
          {owner === account ? 'Owner/Admin' : 'Benefitor'}
        </Typography>
      </div>
      <AddressBlock address={account} />
      <div style={{display: 'flex', flexDirection: "row"}}>
        <Typography variant="body1" component="div" sx={{marginRight: 5 }}>
          Balance:
        </Typography>
        <Typography variant="body1" component="div" sx={{marginRight: 5, color: "#9c27b0", fontWeight: '700' }}>
          {accountBalance} ETH
        </Typography>
      </div>
    </Box>
    <Box sx={{
      display: 'flex',
      flexDirection: "column",
      border: '1px solid #EFEFEF',
      marginTop: '5px',
      marginBottom: '5px',
      padding: '10px',
      height: '145px'
    }}>
      <Typography variant="h4" component="div" sx={{marginRight: 5 }}>
        Owner
      </Typography>
      {owner ?
        <AddressBlock address={owner} /> :
        <Button variant={'outlined'} onClick={handleCreateTrustClick}>Create a Trust Fund</Button>
      }
    </Box>
    <Box sx={{
      display: 'flex',
      flexDirection: "column",
      justifyItems: 'stretch',
      border: '1px solid #EFEFEF',
      marginTop: '5px',
      marginBottom: '5px',
      padding: '10px',
      height: '145px'
    }}>
      <Typography variant="h4" component="div" sx={{marginRight: 5 }}>
        Smart Contract
      </Typography>
      {!!contractAddress && contractAddress !== ZERO_ADDRESS ? <>
          <AddressBlock address={contractAddress} />
          <div style={{display: 'flex', flexDirection: "row"}}>
            <Typography variant="body1" component="div" sx={{marginRight: 5, }}>
              Balance:
            </Typography>
            <Typography variant="body1" component="div" sx={{marginRight: 5, color: "#9c27b0", fontWeight: 'bolder' }}>
              {contractBalance} ETH
            </Typography>
          </div>
      </> :
      <Typography variant="h6" component="div" sx={{marginRight: 5, color: '#e91e63' }}>
        You need to to create a Trust Fund
      </Typography>
      }
    </Box>
  </Box>
}

export  default Header