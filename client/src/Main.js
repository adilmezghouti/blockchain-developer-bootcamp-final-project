import React, {useEffect} from "react";
import Container from "@mui/material/Container";
import Header from "./Header";
import {useWeb3React} from "@web3-react/core";
import VerticalTabs from "./VerticalTabs";
import {injected} from "./connectors";
import useInactiveListener from "./hooks/useInactiveListener";
import useEagerConnect from "./hooks/useEagerConnect";

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
    <Header />
    <VerticalTabs />
  </Container>
}

export default Main