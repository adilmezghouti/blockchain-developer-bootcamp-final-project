import React from "react";
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import "./App.css";
import Main from "./Main";


const getLibrary = (provider) => {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Main />
    </Web3ReactProvider>
  );
}


export default App;
