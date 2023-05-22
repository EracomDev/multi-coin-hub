import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MdAccountBalance } from "react-icons/md";
import "./Deposit.css";
import { ethers } from "ethers";
import ContractDetails from "../../Contracts/ContractDetails";
import Loader from "../../Component/Loader";
import GetBalance from "../../Common/GetBalance";
import GetMaticBalance from "../../Common/GetMaticBalance";
import UserInfo from "../../Common/UserInfo";
const Deposit = () => {
  const { BigInt } = window;
  const [DAI, setDAI] = useState(0);
  const [daiAmount, setDaiAmount] = useState(0);
  const [maticAmount, setMaticAmount] = useState(0);
  const [depositError, setDepositError] = useState();
  const [depositValue, setDepositValue] = useState();
  const [totalDAI, setTotalDAI] = useState(0);
  const [acc, setAccount] = useState(localStorage.getItem("viewId"));
  const [walletAddress, setWalletAddress] = useState();
  const [loading, setLoading] = useState(false);
  var x;

  const [run, setRun] = useState(true);
  let uplineId = localStorage.getItem("upline");
  useEffect(() => {
    if (run) {
      Fetch_detals();
      setRun(false);
    }
  }, []);
  async function Fetch_detals() {
    setLoading(true);
    if (window.ethereum) {
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let addr = await signer.getAddress();
        setWalletAddress(addr);

        const balance = await GetBalance(acc);
        // console.log("balance", String(balance));
        setDaiAmount(balance / 1e18);

        const maticBal = await GetMaticBalance(acc);
        setMaticAmount(maticBal);
        setLoading(false);
      } catch (e) {
        alert("something went wrong");
        setLoading(false);
      }
    } else {
      alert("Wallet Not Exist");
      setLoading(false);
    }
  }
  const handleChange = (event) => {
    setDepositValue(event.target.value);
    console.log(event.target.value.length);
    if (event.target.value.length == 0) {
      setDAI(0);
      setTotalDAI(0);
    }
    setDAI(event.target.value);
    let x = event.target.value * 5;
    setTotalDAI(x);
  };

  async function CheckBalance(amount) {
    try {
      setLoading(true);
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const balance = await GetBalance(accounts[0]);
      let DaiBal = parseFloat(balance / 1e18);
      console.log("balance", DaiBal);

      if (DaiBal >= amount) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      setLoading(false);
      alert("Something Went Wrong");
    }
  }
  async function CheckMaxValue(value) {
    setLoading(true);
    try {
      const userInfo = await UserInfo(acc);
      const maxValue = parseFloat(userInfo.userInfo?.maxDeposit / 1e18);
      let myval = parseFloat(value);
      if (maxValue <= myval) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      setLoading(false);
      setDepositError("Something went wrong");
    }
  }
  const Deposit = async () => {
    if (uplineId == 1) {
      const bal = await CheckBalance(depositValue);
      const val = await CheckMaxValue(depositValue);
      if (bal == true) {
        if (val == true) {
          console.log(depositValue);
          if (depositValue > 2500) {
            setDepositError("value cannot be greater then 2500");
          } else if (depositValue % 25 != 0) {
            setDepositError("value should be multiple of 25");
          } else if (depositValue <= 0) {
            setDepositError("value should be multiple of 25");
          } else {
            setDepositError("");
            setDepositValue(depositValue);
            x = BigInt(depositValue * 1e18);
            increaseAllowance();
          }
        } else {
          setLoading(false);
          setDepositError(
            "Amount should be greater or equal then your previous deposit"
          );
        }
      } else {
        setLoading(false);
        setDepositError("Insufficient Funds");
      }
    } else {
      setLoading(false);
      alert("Login With Your Account");
    }
  };

  async function increaseAllowance() {
    setLoading(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const busdInstance = new ethers.Contract(
          ContractDetails.BUSD,
          ContractDetails.BUSD_ABI,
          signer
        );
        // console.log("Instance : " + busdInstance);
        // console.log("value", x)
        let inc = await busdInstance.increaseAllowance(
          ContractDetails.contract,
          x,
          { value: ethers.utils.parseEther("0") }
        );
        await inc.wait();
        UpgradeFun();
        // console.log("Tr Hash 1: " + inc.hash);
      }
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  }

  // ----------------------------Upgrade---------------------------------
  async function UpgradeFun() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log("11", provider);
        const signer = provider.getSigner();
        console.log("22", signer);
        const contractInstance = new ethers.Contract(
          ContractDetails.contract,
          ContractDetails.contractABI,
          signer
        );
        let fee = await contractInstance.estimateGas.upgrade(x);
        const overrides = {
          gasLimit: fee,
          gasPrice: ethers.utils.parseUnits("3", "gwei"),
          value: ethers.utils.parseEther("0"),
        };
        console.log("Instance : " + contractInstance);
        let inc = await contractInstance.upgrade(x, overrides);
        await inc.wait();
        alert("success");
        setLoading(false);
        setDepositError("");
        console.log("Tr Hash : " + inc.hash);
      }
    } catch (error) {
      alert("something went wrong");
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      {loading === true ? <Loader /> : ""}
      <Container className=" p-2">
        <Row>
          <Col lg="2"></Col>
          <Col lg="8">
            <div className="depositContainer">
              <h5 className="text-center depositHeading">Deposit</h5>
              <Row>
                <Col md="6">
                  <div className="depositCard mb10">
                    <i>
                      <MdAccountBalance />
                    </i>
                    <div>
                      <p>USDT Balance</p>
                      <p>{parseFloat(daiAmount).toFixed(2)}</p>
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="depositCard">
                    <i>
                      <MdAccountBalance />
                    </i>
                    <div>
                      <p>BNB Balance</p>
                      <p>{parseFloat(maticAmount / 1e18).toFixed(4)}</p>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="inputBusd">
                <p>
                  <i>
                    <MdAccountBalance />
                  </i>
                  USDT
                </p>
                <input
                  min={0}
                  max={2000}
                  className="d-block"
                  type="number"
                  placeholder="Enter Amount"
                  value={depositValue}
                  onChange={(e) => handleChange(e)}
                ></input>
              </div>
              <p id="error" style={{ marginTop: "-8px" }}>
                {depositError}
              </p>
              <p style={{ color: "orange" }}>
                Minimum deposit 25 USDT. A ratio of 25 max 2500
              </p>
              <div>
                <Row>
                  <Col xs="4">
                    <p>Deposit</p>
                    <p>
                      {DAI}
                      <span> USDT</span>
                    </p>
                  </Col>
                  <Col xs="4">
                    <p>Each Cycle</p>
                    <p>
                      10<span>%</span>
                    </p>
                  </Col>
                  <Col xs="4">
                    <p>Deposit & interest</p>
                    <p>
                      {totalDAI}
                      <span> USDT</span>
                    </p>
                  </Col>
                </Row>
              </div>
              {walletAddress !== null ? (
                <p
                  style={{ wordBreak: "break-all" }}
                  className="text-success"
                >{`Connected : ${walletAddress}`}</p>
              ) : (
                <p style={{ color: "red", letterSpacing: "1px" }}>
                  Wallet Not Connected
                </p>
              )}

              <button className="btnDeposit" onClick={Deposit}>
                Confirm
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Deposit;
