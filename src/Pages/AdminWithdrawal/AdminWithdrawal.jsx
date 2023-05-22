import React, { useEffect, useState } from 'react'
import Logo from './../../Images/logo2.png'
import { Row, Col, Container } from 'react-bootstrap'
import './AdminWithdrawal.css'
import GetCreaterWallet from '../../Common/GetCreaterWallet'
import { ethers } from "ethers";
import ContractDetails from "../../Contracts/ContractDetails";
import Loader from '../../Component/Loader'
const AdminWithdrawal = () => {

    const { BigInt } = window;
    const [withdrawAmount, setWithdrawAmount] = useState();
    const [withdrawError, setWithdrawError] = useState('');
    const [createrData, setCreaterData] = useState();
    const [loading, setLoading] = useState(false);
    var withVal;
    useEffect(() => {
        FetchData();
    }, [])

    async function FetchData() {
        const { ethereum } = window
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Found an account! Address: ", accounts[0]);
        const myCreaterData = await GetCreaterWallet(accounts[0]);
        setCreaterData(myCreaterData);
        console.log('createrData', myCreaterData);
    }
    async function withdrawMoney() {
        if (withdrawAmount > 0) {
            withVal = BigInt(withdrawAmount * 1e18)
            withdraw();
        }
    }
    async function withdraw() {
        setLoading(true);
        let inc;
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contractinstance = new ethers.Contract(
                    ContractDetails.contract,
                    ContractDetails.contractABI,
                    signer
                );
                console.log("Instance : " + contractinstance);
                let fee = await contractinstance.estimateGas.withdrawal_creater(
                    withVal
                );
                const overrides = {
                    gasLimit: fee,
                    gasPrice: ethers.utils.parseUnits("5", "gwei"),
                    value: ethers.utils.parseEther("0"),
                };
                inc = await contractinstance.withdrawal_creater(withVal, overrides);
                await inc.wait();
                alert("Withdrawal Success");
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            alert("Something Went Wrong");
            setLoading(false);
        }
    }
    return (
        <>
            {
                loading === true ? <Loader /> : ''
            }
            <div id="adminDiv">
                <Container>
                    <section>
                        <img src={Logo} alt="logo.png" style={{ width: "100px", marginTop: "10px" }} />
                        <Row>
                            <Col md="3"></Col>
                            <Col md="6">
                                <div className="card card-body" >
                                    <div className="withdrawHeading">
                                        <p className="">Creater Wallet</p>
                                        <h5>
                                            <span className="usdtSize">USDT</span>
                                            {parseFloat(createrData / 1e18).toFixed(2)}
                                        </h5>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="depositAmount">Amount*</label>
                                        <input
                                            type="text"
                                            id="depositAmount"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            className="inputMoney"
                                            placeholder="Enter Amount"
                                        />
                                        <p id="error">{withdrawError}</p>
                                    </div>
                                    <div className="form-group">
                                        <button
                                            onClick={withdrawMoney}
                                            style={{ backgroundColor: "#0eed0eeb", marginLeft: 'auto', display: "block" }}
                                            className="btn btn-warning depositBtn "
                                        >
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </section>
                </Container>
            </div></>
    )
}

export default AdminWithdrawal