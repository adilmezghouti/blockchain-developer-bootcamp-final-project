import {useWeb3React} from "@web3-react/core";
import React, {Fragment, useEffect, useState} from "react";
import Web3 from "web3";
import {CardActions, CardContent, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const GAS_AMOUNT = 3000000
const colors = {
  UNIVERSITY: '#e91e63',
  ALLOWANCES: '#1976d2',
  INHERITANCE: '#10797A'
}

const BenefitorRow = ({contract, address, actionEnabled}) => {
  const {account} = useWeb3React()
  const [error, setError] = useState('')
  const [amount, setAmount] = useState(0)
  const [name, setName] = useState('')
  const [balances, setBalances] = useState([])
  const [totalBalance, setTotalBalance] = useState(Web3.utils.toBN(0))
  const [selectedBucket, setSelectedBucket] = useState("UNIVERSITY")

  const handleAddFunds = async () => {
    if (parseFloat(amount) === 0) setError('Invalid amount')
    setError('')

    const response = await contract.methods.addFunds(address, selectedBucket).send({from: account, gas: GAS_AMOUNT, value: Web3.utils.toWei(amount, "ether")});
    if (response.status) {
      setAmount(0)
    } else {
      setError('Transaction Failed. Please try again!')
    }
  }

  const handleBucketChange = (event) => {
    setSelectedBucket(event.target.value)
  }

  const onChange = (event) => {
    setAmount(event.target.value)
  }

  const getBuckets = async () => {
    const buckets = []
    let total = Web3.utils.toBN(0)

    for (const bucket of ['UNIVERSITY', 'ALLOWANCES', 'INHERITANCE']) {
      const {balance} = await contract.methods.getBucketInfo(address, bucket).call()
      buckets.push({bucket, balance: Web3.utils.fromWei(balance)})
      total = total.add(Web3.utils.toBN(balance))
    }

    setBalances(buckets)
    setTotalBalance(total)
  }

  useEffect(() => {
    if (!contract) {
      setError('Make sure to create your Trust Fund first')
      return
    }

    contract.methods.getAccountInfo(address).call().then(response => {
      setName(`${response.firstName} ${response.lastName}`)
    })

    getBuckets()
  }, [address])

  return <Fragment>
    {!!error && <div style={{color: '#e91e63', fontWeight: 'bold', marginBottom: 10}}>{error}</div>}
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, mb: 1 }}>
        <Typography variant="h5" component="div" sx={{marginRight: 5 }}>
          {name.trim().length > 0 ? name : 'Not Assigned'}
        </Typography>
        <Typography variant="h5" component="div">
          {Web3.utils.fromWei(totalBalance)} ETH
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 14, mb: 1 }} color="text.secondary" gutterBottom>
        {address}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
        {balances.map(({bucket, balance}) => <Typography key={`${name}-${bucket}`} sx={{ fontSize: 14, fontWeight: "700", marginRight: 5 }} color={colors[bucket]} gutterBottom>
          {balance} ETH
        </Typography>)}
      </Box>
      {actionEnabled && <CardActions>
        <TextField label="Amount" value={amount} onChange={onChange} variant="outlined" size="small" style={{marginLeft: 10}} />
        <FormControl size="small" fullWidth>
          <InputLabel id="bucket-simple-select-label" size="small">Bucket</InputLabel>
          <Select
            labelId="bucket-simple-select-label"
            id="bucket-simple-select"
            value={selectedBucket}
            label="Bucket"
            onChange={handleBucketChange}
          >
            <MenuItem value="UNIVERSITY">University</MenuItem>
            <MenuItem value="ALLOWANCES">Allowances</MenuItem>
            <MenuItem value="INHERITANCE">Inheritance</MenuItem>
          </Select>
        </FormControl>
        <Button variant={'outlined'} size="small" onClick={handleAddFunds} style={{marginLeft: 10}}>Submit</Button>
      </CardActions> }
    </CardContent>
  </Fragment>
}

export default BenefitorRow