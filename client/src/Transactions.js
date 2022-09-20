import {useContract} from "./hooks/useContract";
import FamilyTrustContract from "./contracts/FamilyTrust.json"
import React, {useEffect, useState} from "react";
import {CardActions, CardContent, FormControl, Icon, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddressBlock from "./AddressBlock2";




const GAS_AMOUNT = 3000000


const Transactions = () => {
    
    const {contract} = useContract(FamilyTrustContract);
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [Data, setData] = useState([])

    useEffect(() => {

      const getData = async () => {
        setLoading(true);
        const Data = await contract?.methods.getTransactionCount().call();
        console.log(Data);
  
        const availableTransactions = await contract?.methods.getAllTransactions().call();
        console.log(availableTransactions); 
        setData(availableTransactions);


      };
      getData();




    },[contract])

        
return(
<div>
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
        <TableContainer component={Paper}>
           <Table sx={{ maxWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="center">SenderAddress</TableCell>
                <TableCell align="center">receiverAddressAddress</TableCell>
                <TableCell align="center">receiverFullName</TableCell>
                <TableCell align="center">Amount&nbsp;(ETH)</TableCell>
                <TableCell align="center">timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Data?.map((data) => (
              <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {data.TransactID}
              </TableCell>
              <TableCell align="right"><AddressBlock address={data.sender} /></TableCell>
              <TableCell align="right"><AddressBlock address={data.receiver} /></TableCell>
              <TableCell align="right">{data.receiverFullName}</TableCell>
              <TableCell align="right">{data.amount / 1000000000000000000}</TableCell>
              <TableCell align="right">{(data.timestamp)}</TableCell>
              </TableRow>
              ))}
            </TableBody>
           </Table>
        </TableContainer>

    
    </Box>
</div>
)
}



export default Transactions;
