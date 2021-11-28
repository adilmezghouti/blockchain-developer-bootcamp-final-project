import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {useWeb3React} from "@web3-react/core";
import {useContract} from "./hooks/useContract";
import FamilyTrustContract from "./contracts/FamilyTrust.json";
import {Card} from "@mui/material";
import BenefitorRow from "./BenefitorRow";

const GAS_AMOUNT = 3000000

const Benefitors= () => {
  const {account} = useWeb3React()
  const {contract} = useContract(FamilyTrustContract)

  const [error, setError] = useState()
  const [benefitors, setBenefitors] = useState({});
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [isAddFundsEnabled, setisAddFundsEnabled] = useState(false)
  const [isAddBenefitorEnabled, setIsAddBenefitorEnabled] = useState(false)

  const toggleAddbenefitor = () => {
    setIsAddBenefitorEnabled(!isAddBenefitorEnabled)
  }

  const toggleAddFunds = () => {
    setisAddFundsEnabled(!isAddFundsEnabled)
  }

  const handleCreateBenefitor = async () => {
    setError('')
    contract.methods.addBenefitor(address, firstName, lastName).send({from: account, gas: GAS_AMOUNT})
      .then(response => {
      setFirstName('')
      setLastName('')
      setAddress('')
    }).catch(err => {
      setError('Transaction Failed. Please try again!')
    })
  }

  useEffect(() => {
    if (contract) {
      contract.methods.getBenefitors().call().then(response => setBenefitors(response))
    }
  }, [contract])

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value)
  }

  const handleAddressChange = (event) => {
    setAddress(event.target.value)
  }

  return <div>
    <Box
      sx={{ flexGrow: 1,
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '12px',
        flexDirection: 'row',
        justifyItems: 'stretch',
        alignItems: 'center',
        border: '1px solid #EFEFEF',
        marginBottom: '20px',
        padding: '20px'
      }}
    >
      <Button variant={'outlined'} size="small" onClick={toggleAddbenefitor} sx={{p: 1}}>Add Benefitor</Button>
      <Button variant={'outlined'} size="small" onClick={toggleAddFunds} sx={{p: 1}}>Add Funds</Button>
    </Box>
    {!!error && <div style={{color: '#e91e63', fontWeight: 'bold', marginBottom: 10}}>{error}</div>}
    {isAddBenefitorEnabled && <Box
      sx={{ flexGrow: 1,
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '12px',
        flexDirection: 'row',
        justifyItems: 'stretch',
        alignItems: 'center',
        border: '1px solid #EFEFEF',
        marginBottom: '20px',
        padding: '20px'
      }}
    >
      <TextField
        id="outlined-name"
        label="First Name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <TextField
        id="outlined-name"
        label="Last Name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <TextField
        id="outlined-name"
        label="Address"
        value={address}
        onChange={handleAddressChange}
      />
      <Button variant={'outlined'} size="large" onClick={handleCreateBenefitor} style={{paddingBottom: '14px', paddingTop: '14px'}}>Submit</Button>
    </Box>}

    {Object.keys(benefitors)
      .filter(key => key.startsWith('benefitor') )
      .map(key => <Card key={key} variant="outlined" sx={{mb: 2}}> <BenefitorRow key={key} label={key} address={benefitors[key]} actionEnabled={isAddFundsEnabled} contract={contract} /></Card>)}
  </div>
}

export default Benefitors;