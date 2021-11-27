import {useEffect, useMemo, useState} from 'react';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import Web3 from "web3";
import config from "../config.json";

export function useContract(contractJson) {
  const [address, setAddress] = useState(AddressZero)
  const [instance, setInstance] = useState();

  const { library, account } = useWeb3React();

  const signerOrProvider = account ? library.getSigner(account).connectUnchecked() : library;

  useEffect(() => {
    const web3 = new Web3(new Web3.providers.HttpProvider(
      config.url
    ));
    web3.eth.net.getId().then(networkId => {
      if (networkId) {
        const _address = contractJson.networks[networkId].address
        setAddress(_address)
        setInstance(new web3.eth.Contract(contractJson.abi, _address));
      }
    })
  }, [contractJson])


  return useMemo(() => {
    return {
      contract: instance,
      address
    };
  }, [address, contractJson, signerOrProvider]);
}
