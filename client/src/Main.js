import React, {useEffect} from "react";
import Container from "@mui/material/Container";
import Header from "./Header";
import {useWeb3React} from "@web3-react/core";
import VerticalTabs from "./VerticalTabs";
import {injected} from "./connectors";
import useInactiveListener from "./hooks/useInactiveListener";
import useEagerConnect from "./hooks/useEagerConnect";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Main = () => {
  const { active, error, activate  } = useWeb3React();
  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager);

  useEffect(() => {
    activate(injected)
  }, [])

  if (!active && !error) {
    return <div>Loading Web3, accounts, and contract...</div>;
  } else if (error) {
    return <div>Failed to load dapp</div>;
  }

  return <Container fixed>
    <Box
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
        padding: '10px',
        justifySelf: 'center'
      }}
    >
      <Typography variant="h6" component="div" gutterBottom>
        FAMILY TRUST - INVEST IN THE FUTURE OF YOUR FAMILY
      </Typography>
    </Box>
    <Header />
    <VerticalTabs />
  </Container>
}

export default Main