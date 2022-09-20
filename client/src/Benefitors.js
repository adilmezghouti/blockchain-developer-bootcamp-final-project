import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {useWeb3React} from "@web3-react/core";
import {useContract} from "./hooks/useContract";
import FamilyTrustContract from "./contracts/FamilyTrust.json";
import {Card, Typography} from "@mui/material";
import BenefitorRow from "./BenefitorRow";


const GAS_AMOUNT = 3000000
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const Benefitors = () => {
  const {account, library} = useWeb3React()
  const {contract} = useContract(FamilyTrustContract)

  const [error, setError] = useState()
  const [benefitors, setBenefitors] = useState({});
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [timestamp, setTimestamp] = useState(0)
  const [isAddFundsEnabled, setIsAddFundsEnabled] = useState(false)
  const [isAddBenefitorEnabled, setIsAddBenefitorEnabled] = useState(false)
  const [loading, setLoading] = useState(false)



  const toggleAddBenefitor = () => {
    setIsAddBenefitorEnabled(!isAddBenefitorEnabled)
  }

  const toggleAddFunds = () => {
    setIsAddFundsEnabled(!isAddFundsEnabled)
  }
  
  const handleCreateBenefitor = async () => {
    setLoading(true)
    setError('')
    const date = new Date(timestamp);
    var t = Date.parse(date);
    console.log(t);
    setTimestamp(t);
    console.log(timestamp);
    contract.methods.addBenefitor(address, firstName, lastName, t).send({from: account, gas: GAS_AMOUNT})
      .then(response => {
        setFirstName('')
        setLastName('')
        setAddress('')
        
        

        library.once(response.transactionHash, (transaction) => {
          contract.methods.getBenefitors().call().then(response => {
            setBenefitors(response)
            setLoading(false)
          })
        })
      }).catch(err => {
      setLoading(false)
      setError('Transaction Failed. Please try again!')
    })
  }

  useEffect(() => {
    if (contract) {
      contract.methods.getBenefitors().call().then(response => setBenefitors(response))
    }


    // library.on('block', () => {
    //   //For simplicity we will only wait for one block
    //   if (contract) {
    //     contract.methods.getBenefitors().call().then(response => {
    //       setBenefitors(response)
    //       setLoading(false)
    //     })
    //   }
    // })
    //
    // return () => {
    //   library.removeAllListeners('block')
    // }
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

  const handleTimestampChange = (event) => {
    setTimestamp(event.target.value);
  }

  return <div>
    <Box
      sx={{
        flexGrow: 1,
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
      <Button variant={'outlined'} size="small" onClick={toggleAddBenefitor} sx={{p: 1}}>Add Benefitor</Button>
      <Button variant={'outlined'} size="small" onClick={toggleAddFunds} sx={{p: 1}}>Add Funds</Button>
    </Box>
    
    {!!error && <div style={{color: '#e91e63', fontWeight: 'bold', marginBottom: 10}}>{error}</div>}
    {isAddBenefitorEnabled && <Box
      sx={{
        flexGrow: 1,
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
      <TextField
        id="outlined-name"
        label="Unlock Date"
        type="date"
        value={timestamp}
        sx={{ width: 200 }}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleTimestampChange}
      />
      <Button variant={'outlined'} size="large" onClick={handleCreateBenefitor}
              style={{paddingBottom: '14px', paddingTop: '14px'}}>{loading ? 'Processing...' : 'Submit'}</Button>
    </Box>}

    {contract && contract !== ZERO_ADDRESS ? Object.keys(benefitors)
        .filter(key => key.startsWith('benefitor'))
        .map(key => <Card key={key} variant="outlined" sx={{mb: 2}}> <BenefitorRow key={key} label={key}
                                                                                   address={benefitors[key]}
                                                                                   actionEnabled={isAddFundsEnabled}
                                                                                   contract={contract}/></Card>) :
      <Typography variant="h6" color='#e91e63'>Make sure to create your Trust Fund first</Typography>
    }
  </div>
}

export default Benefitors;