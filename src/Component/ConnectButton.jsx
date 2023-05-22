import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setaccount } from '../Redux/Accounts';
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import { IoWallet } from "react-icons/io5"
import { ethers, providers } from "ethers";
import Change from '../Common/StringToSub';
import Loader from './Loader';
const ConnectButton = () => {

    const [web3Modal, setWeb3Modal] = useState(null)
    const acc = useSelector((state) => state.account.value);
    const dispatch = useDispatch()
    const checkWalletIsConnected = () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have meta masked installed");
            setMsg("Make sure you have meta masked installed")
            return;
        } else {
            console.log("wallet exists! we are ready to go")
            setMsg("wallet exists! we are ready to go")
        }
    }
    useEffect(() => {
        checkWalletIsConnected();
    }, [])
    useEffect(() => {
        // initiate web3modal
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: "05f311673625f063cd5c0736f5bb17b0",
                }
            },
        };

        const newWeb3Modal = new Web3Modal({
            cacheProvider: true, // very important
            // network: 'binance',
            // chainId: 56,
            providerOptions,
        });

        setWeb3Modal(newWeb3Modal)
    }, []);
    useEffect(() => {
        if (web3Modal && web3Modal.cachedProvider) {
            connectWallet()
        }
    }, [web3Modal])

    async function connectWallet() {
        try {
            const provider = await web3Modal.connect();
            addListeners(provider);
            const ethersProvider = new providers.Web3Provider(provider)
            const userAddress = await ethersProvider.getSigner().getAddress()
            dispatch(setaccount(userAddress));
            console.log('userAddress', userAddress)
            localStorage.setItem('account', userAddress);
        } catch (e) {
            alert(e)
        }
    }

    async function addListeners(web3ModalProvider) {
        web3ModalProvider.on("accountsChanged", (accounts) => {
            // window.location.reload()
        });

        // Subscribe to chainId change
        web3ModalProvider.on("chainChanged", () => {
            // window.location.reload()
        });
    }
    const [msg, setMsg] = useState("");

    return (
        <>
            {
                acc != null ?
                    <span id="connectButtonAddress"><i><IoWallet /></i>{Change(acc)}</span> : <button onClick={connectWallet} className='btnConnect'>Connect</button>
            }
            {
                // console.log(contractABI)
                // localStorage.getItem("account")  
            }
        </>
    )
}

export default ConnectButton