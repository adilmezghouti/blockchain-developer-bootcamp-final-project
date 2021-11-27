import React, {useEffect} from "react";
import Container from "@mui/material/Container";
import Header from "./Header";
import {useWeb3React} from "@web3-react/core";
import {InjectedConnector} from "@web3-react/injected-connector";
import VerticalTabs from "./VerticalTabs";

const Main = () => {
  const { active, error, activate  } = useWeb3React();
  const connector = new InjectedConnector({ supportedChainIds: [1, 3, 4, 42, 1337] });

  useEffect(() => {
    activate(connector)
  }, [])

  if (!active && !error) {
    return <div>Loading Web3, accounts, and contract...</div>;
  } else if (error) {
    return <div>Failed to load dapp</div>;
  }

  return <Container fixed>
    <Header />
    <VerticalTabs />
  </Container>
}

export default Main