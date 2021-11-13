import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";


const Benefitors= ({ contract }) => {
  const [error, setError] = useState()
  const [benefitors, setBenefitors] = useState({});
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')

  const handleCreateBenefitor = async () => {
    setError('')
    const response = await contract.methods.addBenefitor(address, firstName, lastName).send({from: '0x1f49F22879C323514Fd6fe069A20d381E432Eb11'});
    if (response.status) {
      setFirstName('')
      setLastName('')
      setAddress('')
    } else {
      setError('Transaction Failed. Please try again!')
    }
  }

  useEffect(() => {
    contract.methods.getBenefitors().call().then(response => setBenefitors(response))
  })

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
    {!!error && <div style={{color: '#e91e63', fontWeight: 'bold', marginBottom: 10}}>{error}</div>}
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
      <Button variant={'outlined'} size="large" onClick={handleCreateBenefitor} style={{paddingBottom: '14px', paddingTop: '14px'}}>Create a Benefitor</Button>
    </Box>

    {Object.keys(benefitors)
      .filter(key => key.startsWith('benefitor') )
      .map(key => <div style={{marginBottom: 10}} key={key}>{key} : {benefitors[key]}</div>)}
  </div>
}

export default Benefitors;