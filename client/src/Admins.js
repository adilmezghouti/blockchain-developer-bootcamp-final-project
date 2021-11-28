import {useWeb3React} from "@web3-react/core";
import {useContract} from "./hooks/useContract";
import FamilyTrustContract from "./contracts/FamilyTrust.json";
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Card, CardContent, IconButton} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Lock, LockOpen} from "@mui/icons-material";
import AddressBlock from "./AddressBlock";

const GAS_AMOUNT = 3000000

const Admins = () => {
  const {account} = useWeb3React()
  const [error, setError] = useState()
  const {contract} = useContract(FamilyTrustContract)
  const [admins, setAdmins] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [isAddAdminEnabled, setIsAddAdminEnabled] = useState(false)

  const toggleAccountAccess = async (_address, hasAccess) => {
    const {status} = await contract.methods.toggleAccountAccess(_address, hasAccess).send({from: account, gas: GAS_AMOUNT});
    if (!status) setError('Action failed. Please try again!')
  }

  const toggleAddAdmin = () => {
    setIsAddAdminEnabled(!isAddAdminEnabled)
  }

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value)
  }

  const handleAddressChange = (event) => {
    setAddress(event.target.value)
  }

  const handleCreateAdmin = (evt) => {
    setError('')
    contract.methods.addAdmin(address, firstName, lastName).send({from: account, gas: GAS_AMOUNT})
      .then(response => {
        setFirstName('')
        setLastName('')
        setAddress('')
      }).catch(err => {
      setError('Transaction Failed. Please try again!')
    })
  }

  const fetchAdminInfo = async () => {
    const _admins = await contract.methods.getAdmins().call();
    const adminInfo = [];

    for (const item of Object.keys(_admins).filter(key => key.startsWith('admin'))) {
      const {firstName, lastName, enabled} = await contract.methods.getAdminInfo(_admins[item]).call();
      adminInfo.push({
        address: _admins[item],
        firstName,
        lastName,
        enabled
      })
    }

    setAdmins(adminInfo)
  }

  useEffect(() => {
    if (!contract) {
      setError("Please make sure to have a trust fund set up first");
      return;
    }
    setError('');
    fetchAdminInfo();
  }, [contract])

  return <div>
    <Box
      component="div"
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
      <Button variant={'outlined'} size="small" onClick={toggleAddAdmin} sx={{p: 1}}>Add Admin</Button>
    </Box>
    {!!error && <div style={{color: '#e91e63', fontWeight: 'bold', marginBottom: 10}}>{error}</div>}
    {isAddAdminEnabled && <Box
      component="div"
      sx={{ flexGrow: 1,
        display: 'flex',
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
        size="small"
      />
      <TextField
        id="outlined-name"
        label="Last Name"
        value={lastName}
        onChange={handleLastNameChange}
        size="small"
      />
      <TextField
        id="outlined-name"
        label="Address"
        value={address}
        onChange={handleAddressChange}
        size="small"
      />
      <Button variant={'outlined'} size="small" sx={{p: 1}} onClick={handleCreateAdmin} >Submit</Button>
    </Box>}
    {admins.map((admin, idx) =>
      <Card key={`${admin.address}-${idx}`} variant="outlined" sx={{mb: 2}}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h4" component="div">
              {admin.firstName.trim().length > 0 ? `${admin.firstName} ${admin.lastName}` : 'Not Assigned'}
            </Typography>
            <IconButton aria-label="fingerprint" color="secondary" onClick={() => toggleAccountAccess(admin.address, !admin.enabled)}>
              {admin.enabled ? <LockOpen /> : <Lock /> }
            </IconButton>
          </Box>
          <AddressBlock address={admin.address} />
        </CardContent>
      </Card>)}
  </div>
}

export default Admins;