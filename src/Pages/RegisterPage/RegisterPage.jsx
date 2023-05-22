import React, { useEffect, useState } from 'react'
import "./RegisterPage.css"
import { useNavigate } from "react-router-dom"
import { ethers } from 'ethers';
import { useSelector } from 'react-redux'
import Loader from '../../Component/Loader';
import IdToAddress from '../../Common/IdToAddress';
import GetBalance from '../../Common/GetBalance';
import GetMaticBalance from '../../Common/GetMaticBalance';
import UserInfo from '../../Common/UserInfo';
const RegisterPage = () => {
    const navigate = useNavigate();
    const [spons, setSponsor] = useState("");
    const contract = useSelector((state) => state.contract.value.contract);//"0xe41C82120c8363a118A700718858A406aca63598";
    const BUSD = useSelector((state) => state.contract.value.BUSD);
    const contractABI = useSelector((state) => state.contract.value.contractABI);
    const BUSD_ABI = useSelector((state) => state.contract.value.BUSD_ABI);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let len = window.location.href.length;
        const after = window.location.search.slice(window.location.search.indexOf('=') + 1);
        console.log("url here", after);
        setSponsor(after)
    }, [])

    async function CheckBalance() {
        try {
            const { ethereum } = window
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            const balance = await GetBalance(accounts[0]);
            let DaiBal = String(balance / 1e18)
            console.log("balance", DaiBal);

            // const maticBal = await GetMaticBalance(accounts[0]);
            // let MaticBal = String(maticBal / 1e18)
            // console.log("maticBal", MaticBal);

            if (DaiBal >= 25) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            setMsg(<span className='text-danger'>Something Went Wrong</span>);
        }
    }
    // async function increaseAllowance() {
    //     setLoading(true);
    //     const { ethereum } = window;
    //     if (spons.length > 0) {
    //         // const addr = await IdToAddress(spons);
    //         const userInfo = await UserInfo(spons);
    //         const userId = String(userInfo?.userInfo?.id)
    //         console.log('userInfo', userId)
    //         if (userId > 0) {
    //             const chekBal = await CheckBalance();
    //             if (chekBal == true) {

    //                 if (ethereum) {
    //                     try {
    //                         const provider = new ethers.providers.Web3Provider(ethereum);
    //                         const signer = provider.getSigner();
    //                         const busdInstance = new ethers.Contract(BUSD, BUSD_ABI, signer);
    //                         console.log("Instance : " + busdInstance);

    //                         let inc = await busdInstance.increaseAllowance(contract, '100000000000000000000', { value: ethers.utils.parseEther('0') });
    //                         await inc.wait();
    //                         const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    //                         localStorage.setItem("viewId", accounts[0]);
    //                         localStorage.setItem("loginBy", 'automatic');
    //                         register();
    //                         console.log("Tr Hash : " + inc.hash);
    //                     }
    //                     catch (error) {
    //                         setLoading(false);
    //                         setMsg(<span className='text-danger'>Something Went Wrong</span>);
    //                     }
    //                 }
    //                 else {
    //                     setMsg(<span className='text-danger'>Wallet Not Exist.</span>);
    //                     setLoading(false);
    //                 }
    //             } else {
    //                 setMsg(<span className='text-danger'>Insufficient Funds</span>);
    //                 setLoading(false);
    //             }
    //         } else {
    //             setLoading(false);
    //             setMsg(<span className='text-danger'>Sponsor Not Exist</span>);
    //         }
    //     }
    //     else {
    //         setLoading(false);
    //         setMsg(<span className='text-danger'>Enter Sponsor ID</span>);
    //     }
    // }

    async function CheckExist() {
        setLoading(true);
        try {
            const { ethereum } = window
            let myaccounts = await ethereum.request({ method: 'eth_requestAccounts' });
            let usInfo = await UserInfo(myaccounts[0]);
            let userIdd = String(usInfo?.userInfo?.id)
            // alert(userIdd)
            if (userIdd <= 0) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            setLoading(false);
            setMsg(<span className='text-danger'>Something Went Wrong</span>);
        }
    }
    async function register() {
        setLoading(true);
        try {
            let userEx = await CheckExist();
            if (userEx == true) {
                const userInfo = await UserInfo(spons);
                const userId = String(userInfo?.userInfo?.id)
                // console.log('userInfo', userInfo)
                const userDeposit = parseFloat(userInfo?.userInfo?.totalDeposit / 1e18);
                // alert(userDeposit)
                // console.log('userInfo', userId)
                const { ethereum } = window;
                if (ethereum) {
                    if (userId > 0) {
                        if (userDeposit > 0) {
                            const provider = new ethers.providers.Web3Provider(ethereum);
                            const signer = provider.getSigner();
                            const contractinstance = new ethers.Contract(contract, contractABI, signer);
                            console.log("Instance : " + contractinstance);
                            let inc = await contractinstance.register(spons, { value: ethers.utils.parseEther('0') });

                            await inc.wait();
                            console.log("Tr Hash : " + inc.hash);

                            setMsg("Register Success.");
                            localStorage.setItem('upline', 1);
                            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                            localStorage.setItem("viewId", accounts[0]);
                            localStorage.setItem("loginBy", 'automatic');
                            navigate("/dashboard");
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setMsg(<span className='text-danger'>Sponsor Not Active</span>);
                        }
                    }
                    else {
                        setLoading(false);
                        setMsg(<span className='text-danger'>Sponsor Not Exist</span>);
                    }
                }
            } else {
                setLoading(false);
                setMsg(<span className='text-danger'>User Already Exist</span>);
            }
        } catch (error) {
            setMsg(<span className='text-danger'>Something went wrong</span>)
            console.log(error);
            setLoading(false);
        }
    }

    const [msg, setMsg] = useState("");
    useEffect(() => {
        const viewInput = document.getElementById('sponsor');
        viewInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("registerBtn").click();
            }
        });
    }, [])
    return (
        <>
            {
                loading === true ? <Loader /> : ''
            }
            <span className='text-danger'>{msg}</span>
            <div className="connectRegisterLeft">

                <input type="text" placeholder="Enter Sponsor ID." value={spons} onChange={(e) => setSponsor(e.target.value)} id="sponsor" />
                <div className="registerButtons">
                    <button className="viewing bgOrange" id="registerBtn" onClick={register}>Register</button>
                </div>

            </div>
        </>
    )
}

export default RegisterPage