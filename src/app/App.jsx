import React, {useEffect} from "react";
import './App.scss';
import Home from "../components/Pages/Home";
import Create from "../components/Pages/Create";
import Mint from "../components/Pages/Mint";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from "../components/Pages/Login";
import {ThemeContext, themes} from "../api/Theme";
import musicDB from "../db/music";
import {useDispatch, useSelector} from "react-redux";

import MarketplaceAbi from '../components/contractsData/Marketplace.json'
import MarketplaceAddress from '../components/contractsData/Marketplace-address.json'
import NFTAbi from '../components/contractsData/NFT.json'
import NFTAddress from '../components/contractsData/NFT-address.json'
import { useState } from 'react'
import { ethers } from "ethers"
let flag=0;

const App = () => {

{/*}
    const dispatch = useDispatch();
    useEffect(()=>{
        if (language === null || language.includes("any")){
            dispatch(setPlaylist(musicDB))
        }
        else if (language.includes('hindi')){
            alert("No hindi tracks available")
        } else {
            let x = musicDB.filter((item)=>(
                item.lang && language.includes(item.lang.toLowerCase())
            ))
            dispatch(setPlaylist(x))
        }
    },[dispatch, language]);
*/}
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  
  // MetaMask Login/Connect
  /*console.log("App.jsx running")
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    console.log("App.jsx running")

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    console.log("This is nft::",nft)
    setNFT(nft)
  }
 
  if(!flag){
    web3Handler();
    flag++;
  }*/
    return (
        <ThemeContext.Provider value={themes.light}>
            <>
                <Router>
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <Route path="/home" component={Home}/>
                        <Route path="/create" component={Create} />
                    </Switch>
                </Router>
            </>
        </ThemeContext.Provider>
    );
}

export default App;