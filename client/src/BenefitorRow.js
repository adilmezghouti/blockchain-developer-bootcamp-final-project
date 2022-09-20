import {useWeb3React} from "@web3-react/core";
import React, {Fragment, useEffect, useState} from "react";
import Web3 from "web3";
import {CardActions, CardContent, FormControl, Icon, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Lock, LockOpen} from "@mui/icons-material";
import AddressBlock from "./AddressBlock";




const GAS_AMOUNT = 3000000
const BucketMetaData = {
  UNIVERSITY: {
    color: '#e91e63',
    icon: 'school'
  },
  ALLOWANCES: {
    color: '#1976d2',
    icon: 'savings'
  },
  INHERITANCE: {
    color: '#10797A',
    icon: 'attach_money'
  }
}

const BenefitorRow = ({contract, address, actionEnabled}) => {
  const {account, library} = useWeb3React()
  const [error, setError] = useState('')
  const [amount, setAmount] = useState(0)
  const [name, setName] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [balances, setBalances] = useState([])
  const [totalBalance, setTotalBalance] = useState(Web3.utils.toBN(0))
  const [selectedBucket, setSelectedBucket] = useState("UNIVERSITY")
  const [areFundsLocked, setAreFundsLocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unlockDate, setUnlockDate] = useState(0)




  const toggleAccountAccess = async (_address, hasAccess) => {
    const {status} = await contract.methods.toggleAccountAccess(_address, hasAccess).send({from: account, gas: GAS_AMOUNT});
    if (!status) setError('Action failed. Please try again!')
  }
  
  const handleAddFunds = async () => {
    if (parseFloat(amount) === 0) setError('Invalid amount')
    setError('')

    setLoading(true)
    const response = await contract.methods.addFunds(address, selectedBucket).send({from: account, gas: GAS_AMOUNT, value: Web3.utils.toWei(amount, "ether")});
    if (!response.status) {
      setError('Transaction Failed. Please try again!')
    } else {
      library.once(response.transactionHash, () => {
        //For simplicity we will only wait for one block
        getBuckets().then(async () => {
          //setLoading(false)
          const {firstName, lastName, timestamp} = await contract.methods.getAccountInfo(address).call();
          console.log(firstName);
          console.log(lastName);
          console.log(timestamp);
          console.log(address);
          console.log(amount);
          setName(`${firstName} ${lastName}`);
          setUnlockDate(timestamp);
          console.log(name);
          console.log(unlockDate);
          
          await contract.methods.addToBlockchain(address, name, Web3.utils.toWei(amount, "ether"), unlockDate ).send({from: account, gas: GAS_AMOUNT})

          const availableTransactions = await contract?.methods?.getAllTransactions().call();
          console.log(availableTransactions);


        //Dans le code qui suit, on utilise un tableau d'objets pour créer un autre tableau contenant de nouveaux objets dans un autre format :
        //a l'aide de la fonction map 
        
        const structuredTransactions = availableTransactions.map((transaction) => ({
          TransactionID: transaction.TransactID,
          addressFrom: transaction.sender,
          addressTo: transaction.receiver,
          receiverFullName: transaction.receiverFullName,
          amount: transaction.amount / 1000000000000000000,
          timestamp: transaction.timestamp,
          unlockDate: transaction.unlockDate
        }));
        console.log(structuredTransactions);
        
          setLoading(false);
      
          const transactionsCount = await contract.methods.getTransactionCount().call();
          console.log((transactionsCount))
          console.log('done');
          

        })
      })





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

    const {firstName, lastName, enabled: _enabled, timestamp} = await contract.methods.getAccountInfo(address).call();
    setName(`${firstName} ${lastName}`)
    setEnabled(_enabled)
    setUnlockDate(timestamp)

    for (const bucket of ['UNIVERSITY', 'ALLOWANCES', 'INHERITANCE']) {
      const {balance, locked} = await contract.methods.getBucketInfo(address, bucket).call()
      buckets.push({bucket, balance: Web3.utils.fromWei(balance)})
      total = total.add(Web3.utils.toBN(balance))
      setAreFundsLocked(locked)
    }

    setBalances(buckets)
    setTotalBalance(total)
  }

  useEffect(() => {
    if (!contract) {
      setError('Make sure to create your Trust Fund first')
      return
    }

    getBuckets()
  }, [address, contract])

  
  
  return <Fragment>
    {!!error && <div style={{color: '#e91e63', fontWeight: 'bold', marginBottom: 10}}>{error}</div>}
    <CardContent sx={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1}}>
        <Typography variant="h4" component="div" sx={{marginRight: 5 }}>
          {name.trim().length > 0 ? name : 'Not Assigned'}
        </Typography>
        <Typography variant="h4" component="div">
          {Web3.utils.fromWei(totalBalance)} ETH
        </Typography>
        <IconButton aria-label="fingerprint" color="secondary" sx={{ml: 1}} onClick={() => toggleAccountAccess(address, !enabled)}>
          {enabled ? <LockOpen /> : <Lock /> }
        </IconButton>
      </Box>
      <AddressBlock address={address} />
      <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
        {balances.map(({bucket, balance}) =>
          <Fragment key={`${name}-${bucket}`}>
            <Icon color={BucketMetaData[bucket].color} sx={{color: BucketMetaData[bucket].color, pb:1, mr: 0.5, fontSize: 20, lineHeight: '20px' }}>{BucketMetaData[bucket].icon}</Icon>
            <Typography key={`${name}-${bucket}`} sx={{ fontSize: 20, fontWeight: "700", marginRight: 5, lineHeight: '20px' }} color={BucketMetaData[bucket].color} gutterBottom>
              {balance} ETH
            </Typography>
          </Fragment>)}
      </Box>
      {actionEnabled && <CardActions style={{justifyContent: "space-between"}}>
        <TextField label="Amount" value={amount} onChange={onChange} variant="outlined" size="small" />
        <FormControl size="small">
          <InputLabel id="bucket-simple-select-label" size="small" variant="outlined">Bucket</InputLabel>
          <Select
            labelId="bucket-simple-select-label"
            id="bucket-simple-select"
            value={selectedBucket}
            label="Bucket"
            onChange={handleBucketChange}
            fullWidth
          >
            <MenuItem value="UNIVERSITY" sx={{alignItems: 'center'}}>
              <Icon color={BucketMetaData['UNIVERSITY'].color} sx={{color: BucketMetaData['UNIVERSITY'].color, mr: 0.5, fontSize: 15}}>{BucketMetaData['UNIVERSITY'].icon}</Icon>
              University</MenuItem>
            <MenuItem value="ALLOWANCES">
              <Icon color={BucketMetaData['ALLOWANCES'].color} sx={{color: BucketMetaData['ALLOWANCES'].color, mr: 0.5, fontSize: 15}}>{BucketMetaData['ALLOWANCES'].icon}</Icon>
              Allowances
            </MenuItem>
            <MenuItem value="INHERITANCE">
              <Icon color={BucketMetaData['INHERITANCE'].color} sx={{color: BucketMetaData['INHERITANCE'].color, mr: 0.5, fontSize: 15}}>{BucketMetaData['INHERITANCE'].icon}</Icon>
              Inheritance
            </MenuItem>
          </Select>
        </FormControl>
        <Button variant={'outlined'} size="small" onClick={handleAddFunds} sx={{p: 1}}>{loading ? 'Processing...' : 'Submit'}</Button>
      </CardActions> }
    </CardContent>
  </Fragment>
}

export default BenefitorRow