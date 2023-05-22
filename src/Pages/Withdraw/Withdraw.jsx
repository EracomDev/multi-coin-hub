import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UserInfo from "../../Common/UserInfo";

import { BigNumber, ethers } from "ethers";
import Loader from "../../Component/Loader";
import "./Withdraw.css";
import ContractDetails from "../../Contracts/ContractDetails";
import { useSelector } from "react-redux";
import Income from "../../Common/Income";
const Withdraw = () => {
  const { BigInt } = window;
  const [acc, setAccount] = useState(localStorage.getItem("viewId"));
  const [userinfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [depositAmount, setdepositAmount] = useState();
  const [withdrawAmount70, setWithdrawAmount70] = useState();
  const [depositError, setdepositError] = useState("");
  const [withdrawError70, setWithdrawError70] = useState();
  const [inputAddress, setInputAddress] = useState("");
  const [freezeAmount, setFreezeAmount] = useState("");
  const [freezeError, setFreezeError] = useState("");
  const acc2 = useSelector((state) => state.account.value);
  var uplineId = localStorage.getItem("upline");
  const [run, setRun] = useState(true);
  var val70;
  var x;

  var cntr = 0;
  useEffect(() => {
    if (run) {
      fatch_Details();
      setRun(false);
    }
  }, []);
  useEffect(() => { }, [depositError]);

  async function fatch_Details() {
    if (cntr == 0) {
      cntr++;
      setLoading(true);
      try {
        const { ethereum } = window;
        if (ethereum) {
          const userInfo = await UserInfo(acc);
          // console.log("userinfo", userInfo?.userInfo);
          setUserInfo(userInfo?.userInfo);

          const income = await Income(acc);
          // console.log("income", income)
          setIncomes(income);

          setLoading(false);
        } else {
          setLoading(false);
          alert("Wallet Not Exist");
        }
      } catch (error) {
        alert("Something went wrong");
        setLoading(false);
      }
    }
  }
  function FreezeDeposit() {
    if (uplineId == 1) {
      if (freezeAmount > 2500) {
        setFreezeError("value cannot be greater then 2500");
      } else if (freezeAmount % 25 != 0) {
        setFreezeError("value should be multiple of 25");
      } else if (freezeAmount <= 0) {
        setFreezeError("value should be multiple of 25");
      } else {
        setFreezeError("");
        let ll = String(freezeAmount * 1e18);
        console.log("value of x = ", ll);
        FreezeDepositFun(ll);
      }
    } else {
      alert("Login With Your Account");
    }
  }
  function Deposit() {
    if (uplineId == 1) {
      if (depositAmount > 2500) {
        setdepositError("value cannot be greater then 2500");
      } else if (depositAmount % 25 != 0) {
        setdepositError("value should be multiple of 25");
      } else if (depositAmount <= 0) {
        setdepositError("value should be multiple of 25");
      } else {
        setdepositError("");
        setdepositAmount(depositAmount);
        x = String(depositAmount * 1e18);
        console.log("value of x = ", x);
        increaseAllowance();
      }
    } else {
      alert("Login With Your Account");
    }
  }
  function Transfer() {
    if (uplineId == 1) {
      if (depositAmount > 2500) {
        setdepositError("value cannot be greater then 2500");
      } else if (depositAmount % 25 != 0) {
        setdepositError("value should be multiple of 25");
      } else if (depositAmount <= 0) {
        setdepositError("value should be multiple of 25");
      } else {
        setdepositError("");
        setdepositAmount(depositAmount);
        x = String(depositAmount * 1e18);
        console.log("value of x = ", x);
        TransferFun(x);
      }
    } else {
      alert("Login With Your Account");
    }
  }

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
        console.log("Instance : " + busdInstance);
        console.log("value", x);
        let inc = await busdInstance.increaseAllowance(
          ContractDetails.contract,
          x,
          { value: ethers.utils.parseEther("0") }
        );
        await inc.wait();
        UpgradeFun();
        console.log("Tr Hash 1: " + inc.hash);
      }
    } catch (error) {
      setLoading(false);
      alert("Something Went Wrong");
    }
  }

  // ----------------------------Upgrade---------------------------------
  async function UpgradeFun() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          ContractDetails.contract,
          ContractDetails.contractABI,
          signer
        );

        let fee = await contractInstance.estimateGas.splitdeposit(
          inputAddress,
          x
        );
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const overrides = {
          from: accounts[0],
          gasLimit: fee,
          gasPrice: ethers.utils.parseUnits("5", "gwei"),
          value: ethers.utils.parseEther("0"),
        };
        console.log("Instance : " + contractInstance);
        let inc = await contractInstance.splitdeposit(
          inputAddress,
          x,
          overrides
        );
        await inc.wait();
        alert("Deposit Success");
        // window.location.reload();
        setLoading(false);
      }
    } catch (error) {
      alert("Transaction Failed");
      console.log(error);
      setLoading(false);
    }
  }

  async function with70() {
    if (uplineId == 1) {
      const userInfo = await UserInfo(acc);
      let amt = parseFloat(userInfo.userInfo.wallet70 / 1e18);
      // console.log("userInfo", amt)
      // alert(amt)
      if (amt >= withdrawAmount70) {
        if (withdrawAmount70 >= 5 && withdrawAmount70 % 5 === 0) {
          setWithdrawError70("");
          console.log("1221", withdrawAmount70);
          val70 = BigInt(withdrawAmount70 * 1e18);
          withdraw70();
        } else {
          setWithdrawError70("Value should be multiple of 5");
        }
      } else {
        setWithdrawError70("Insufficient funds in wallet");
      }
    } else {
      alert("Login With Your Account");
    }
  }
  async function TransferFun(x) {
    setLoading(true);
    const { ethereum } = window;
    if (ethereum) {
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractinstance = new ethers.Contract(
          ContractDetails.contract,
          ContractDetails.contractABI,
          signer
        );
        console.log("Instance : " + contractinstance);
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        {
          console.log("DepoVal", x);
        }
        let inc = await contractinstance.transferSplit(inputAddress, x, {
          from: accounts[0],
          value: ethers.utils.parseEther("0"),
        });
        await inc.wait();
        alert("Transfer Success");
        fatch_Details();
        setLoading(false);
      } catch (error) {
        alert("Transaction Failed");
        console.log(error);
        setLoading(false);
      }
    }
  }
  async function FreezeDepositFun(freezeVal) {
    setLoading(true);
    const { ethereum } = window;
    if (ethereum) {
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractinstance = new ethers.Contract(
          ContractDetails.contract,
          ContractDetails.contractABI,
          signer
        );
        console.log("Instance : " + contractinstance);
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        {
          console.log("DepoVal", freezeVal);
        }
        let inc = await contractinstance.freezedeposit(freezeVal, {
          from: accounts[0],
          value: ethers.utils.parseEther("0"),
        });
        await inc.wait();
        alert("Deposit Success");
        fatch_Details();
        setLoading(false);
      } catch (error) {
        alert("Transaction Failed");
        console.log(error);
        setLoading(false);
      }
    }
  }
  async function withdraw70() {
    setLoading(true);
    let inc;
    try {
      const { ethereum } = window;
      if (ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contractinstance = new ethers.Contract(
            ContractDetails.contract,
            ContractDetails.contractABI,
            signer
          );
          console.log("Instance : " + contractinstance);
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          {
            console.log("value70", val70);
          }
          let fee = await contractinstance.estimateGas.withdrawal_nonworking(
            val70
          );
          const overrides = {
            gasLimit: fee,
            gasPrice: ethers.utils.parseUnits("5", "gwei"),
            value: ethers.utils.parseEther("0"),
          };
          inc = await contractinstance.withdrawal_nonworking(val70, overrides);
        } catch (e) {
          alert("Something Went Wrong");
          console.log(e);
        }
        await inc.wait();
        alert("Withdrawal Success");
        fatch_Details();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      alert("Something Went Wrong");
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      {loading === true ? <Loader /> : ""}
      <Container className="p-4">
        <h4 className="dashboardHeading">Withdraw</h4>
        <Row>
          <Col lg="6">
            <div className="card card-body mb20">
              <div className="withdrawHeading">
                <p className="">Working Wallet</p>
                <h5>
                  <span className="usdtSize">USDT</span>
                  {String(userinfo?.wallet30 / 1e18)}
                </h5>
              </div>
              <div className="form-group">
                <label htmlFor="depositAmount">Amount*</label>
                <input
                  type="text"
                  id="depositAmount"
                  value={depositAmount}
                  onChange={(e) => setdepositAmount(e.target.value)}
                  className="inputMoney"
                  placeholder="Enter Amount"
                />
                <p id="error">{depositError}</p>
                <label htmlFor="DepositAddress">Address*</label>
                <input
                  type="text"
                  id="DepositAddress"
                  className="inputMoney"
                  placeholder="Enter Address"
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Row>
                  <Col sm="6">
                    <button
                      onClick={Deposit}
                      className="btn btn-warning  depositBtn"
                    >
                      Deposit
                    </button>
                  </Col>
                  <Col sm="6">
                    <button
                      onClick={Transfer}
                      className="btn btn-warning colSky depositBtn"
                    >
                      Transfer
                    </button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col lg="6">
            <div className="card card-body">
              <div className="withdrawHeading">
                <p className="">Non Working Wallet</p>
                <h5>
                  <span className="usdtSize">USDT</span>
                  {String(userinfo?.wallet70 / 1e18)}
                </h5>
              </div>
              <div className="form-group">
                <label htmlFor="depositAmount">Amount*</label>
                <input
                  type="text"
                  id="depositAmount"
                  value={withdrawAmount70}
                  onChange={(e) => setWithdrawAmount70(e.target.value)}
                  className="inputMoney"
                  placeholder="Enter Amount"
                />
                <p id="error">{withdrawError70}</p>
              </div>
              <div className="form-group">
                <center>
                  <button
                    onClick={with70}
                    style={{ backgroundColor: "#0eed0eeb" }}
                    className="btn btn-warning depositBtn"
                  >
                    Withdraw
                  </button>
                </center>
              </div>
            </div>
          </Col>
          <Col lg="6" className="mt-4">
            <div className="card card-body">
              <div className="withdrawHeading">
                <p className="">Freeze Wallet</p>
                <h5>
                  <span className="usdtSize">USDT</span>
                  {parseFloat(incomes?.freeze / 1e18).toFixed(2)}
                </h5>
              </div>
              <div className="form-group">
                <label htmlFor="FreezeAmount">Amount*</label>
                <input
                  type="text"
                  id="FreezeAmount"
                  value={freezeAmount}
                  onChange={(e) => setFreezeAmount(e.target.value)}
                  className="inputMoney"
                  placeholder="Enter Amount"
                />
                <p id="error">{freezeError}</p>
                <p id="note">
                  Note: The deposit Value Should Be Greater Or Equal Then Your
                  Previous Deposit
                </p>
              </div>
              <div className="form-group">
                <center>
                  <button
                    onClick={FreezeDeposit}
                    className="btn btn-warning depositBtn"
                  >
                    Deposit From Freeze
                  </button>
                </center>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
export default Withdraw;
