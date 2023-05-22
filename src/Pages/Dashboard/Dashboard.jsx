import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Container, Row, Col } from "react-bootstrap";
import { GiStarSwirl } from "react-icons/gi";
import { BiTime } from "react-icons/bi";
import { TbCalendarTime } from "react-icons/tb";
import { BsPersonPlusFill } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { SiOpslevel } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
import { ethers } from "ethers";
import { MdAccountBalanceWallet } from "react-icons/md";
import PoolCard from "../../Component/PoolCard/PoolCard";
import UserInfo from "../../Common/UserInfo";
import Income from "../../Common/Income";
import ContractBasicInfo from "../../Common/ContractBasicInfo";
import RewardStatus from "../../Common/RewardStatus";
import ContractDetails from "../../Contracts/ContractDetails";
import GetOrders from "../../Common/GetOrders";
import Loader from "../../Component/Loader";
import CopyToClipboard from "../../Common/CopyToClipboard";
import Change from "../../Common/StringToSub";
import { IoCopyOutline } from "react-icons/io5";
import { SiStartrek } from "react-icons/si";
import GetBalance from "../../Common/GetBalance";
import GetMaticBalance from "../../Common/GetMaticBalance";
import TimestampToDate from "../../Common/TimestampToDate";
import DaiIcon from "../../Component/DaiIcon";
import Tree from "./../../Images/tree.png";
import { FaUserAlt, FaLink } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import IdToAddress from "../../Common/IdToAddress";
import GetTriggers from "../../Common/GetTriggers";
const Dashboard = () => {
  const { BigInt } = window;
  const [userDetails, setUser] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [planInfo, setPlanInfo] = useState([]);
  const [rewardStatus, setRewardStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [depositValue, setDepositValue] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [orders, setOrders] = useState();
  const [maticBalance, setMaticBalace] = useState();
  const [balance, setBalance] = useState();
  const [depositError, setDepositError] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [triggerData, setTriggerData] = useState([]);
  const [run, setRun] = useState(true);
  var x = 0;
  const [userInformation, setUserInformation] = useState();
  const acc = localStorage.getItem("viewId");
  let uplineId = localStorage.getItem("upline");
  const [userId, setUserId] = useState(0);
  useEffect(() => {
    if (run) {
      CheckWallet();
      fatch_Details();
      setRun(false);
    }
  }, []);

  function refresh() {
    CheckWallet();
    fatch_Details();
  }

  async function fatch_Details() {
    setLoading(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const userInfo = await UserInfo(acc);
        setUserInformation(userInfo);
        // console.log("userinfo", userInfo?.userInfo);
        setUser(userInfo?.userInfo);
        setUserId(parseInt(userInfo?.userInfo?.id));

        let trigger = await GetTriggers(acc);
        // console.log('99999999999999999999999999999999999999999999', trigger)
        setTriggerData(trigger);

        try {
          const userID = parseInt(userInfo?.userInfo?.id);
          const addr = await IdToAddress(userID);
          setUserAddress(addr);
        } catch (e) {
          console.log(e);
        }

        const income = await Income(acc);
        console.log("income", income);
        setIncomes(income);

        const BasicInfo = await ContractBasicInfo();
        // console.log("BasicInfo", BasicInfo)
        setPlanInfo(BasicInfo);

        const retus = await RewardStatus(acc);
        // console.log("rewardStatus", retus);
        setRewardStatus(retus);

        const balance = await GetBalance(acc);
        // console.log("balance", String(balance));
        setBalance(balance / 1e18);

        const maticBal = await GetMaticBalance(acc);
        setMaticBalace(maticBal);

        let count = parseInt(userInfo.userInfo.orderCount);
        const order = await GetOrders(acc, count);
        setOrders(order);

        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      alert("Something Went Wrong Please Check Your Network");
      console.log(error);
      setLoading(false);
    }
  }
  const CheckWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let addr = await signer.getAddress();
      setWalletAddress(addr);
    }
  };

  // ------------------------------Deposit Function----------------------------------------
  async function CheckBalance(amount) {
    try {
      setLoading(true);
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const balance = await GetBalance(accounts[0]);
      let DaiBal = parseFloat(balance / 1e18);
      // console.log("balance", DaiBal);

      // const maticBal = await GetMaticBalance(accounts[0]);
      // let MaticBal = String(maticBal / 1e18)
      // console.log("maticBal", MaticBal);
      if (DaiBal >= amount) {
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (e) {
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
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (e) {
      setLoading(false);
      setDepositError("Something went wrong");
    }
  }
  const Deposit = async () => {
    try {
      if (uplineId == 1) {
        const bal = await CheckBalance(depositValue);
        const val = await CheckMaxValue(depositValue);

        if (bal == true) {
          if (val == true) {
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
              // console.log('value of x = ', x);
              increaseAllowance();
              // UpgradeFun();
            }
          } else {
            setDepositError(
              "Amount should be greater or equal then your previous deposit"
            );
          }
        } else {
          setDepositError("Insufficient Funds");
        }
      } else {
        alert("Login With Your Account");
      }
    } catch (e) {
      console.log("deposit", e);
    }
  };
  // ---------------------------------increaseAllowance-------------------------------------
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
      setLoading(false);
      console.log("UpgradeFun : " + error);
    }
  }

  // ----------------------------Upgrade---------------------------------
  async function UpgradeFun() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log("1", provider);
        const signer = provider.getSigner();
        console.log("2", signer);
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
        // console.log("Instance : " + contractInstance);
        let inc = await contractInstance.upgrade(x, overrides);
        await inc.wait();
        alert("success");
        refresh();
        setLoading(false);
        setDepositError("");
      }
    } catch (error) {
      console.log("UpgradeFun", error);
      setLoading(false);
    }
  }
  var withVal = 0;

  function toTimestamp(time) {
    const mydate = new Date();
    var date = new Date(time * 1000);
    if (mydate >= date) {
      return true;
    } else {
      return false;
    }
  }
  async function WithdrawFun() {
    setLoading(true);
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
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        let inc = await contractinstance.withdrawal(withVal, {
          from: accounts[0],
          value: ethers.utils.parseEther("0"),
        });
        await inc.wait();
        alert("Withdrawal Success");
        fatch_Details();
        setLoading(false);
      }
    } catch (error) {
      alert("Something Went Wrong");
      setLoading(false);
    }
  }
  async function GetClaim(id) {
    setLoading(true);
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
        console.log("contractinstance", contractinstance);
        let claimed = await contractinstance.claim(id);
        await claimed.wait();
        // window.location.reload(true);
        refresh();
        alert("Claimed Successfully");

        setLoading(false);
      } catch (e) {
        setLoading(false);
        alert("something went wrong");
        console.log(e);
      }
    } else {
      alert("something went wrong");
      setLoading(false);
    }
  }
  async function GetPrincipal() {
    if (uplineId == 1) {
      const confirmBox = window.confirm("Do you really want to claim this?");
      if (confirmBox === true) {
        setLoading(true);
        const { ethereum } = window;
        if (ethereum) {
          try {
            const provider1 = new ethers.providers.Web3Provider(ethereum);
            const signer1 = provider1.getSigner();
            const contractinstance1 = new ethers.Contract(
              ContractDetails.contract,
              ContractDetails.contractABI,
              signer1
            );
            console.log("contractinstance", contractinstance1);
            let claimed1 = await contractinstance1.claim_p();
            await claimed1.wait();
            // window.location.reload(true);
            setLoading(false);
            alert("Principal Claimed Successfully");
          } catch (e) {
            setLoading(false);
            alert("something went wrong");
            console.log(e);
          }
        } else {
          setLoading(false);
          alert("something went wrong");
        }
      }
    } else {
      alert("Please login with your account");
    }
  }

  return (
    <React.Fragment>
      {loading === true ? <Loader /> : ""}
      <div className="topColor">
        <h4>Dashboard</h4>
      </div>
      <Row className="p-2" style={{ marginTop: "-90px" }}>
        <Col lg="12">
          <Row>
            <Col lg="4" md="6" className="py-1">
              <PoolCard
                img={GiStarSwirl}
                title="Cycle Income"
                price={parseFloat(incomes?.roi / 1e18)}
                bgColor="#AB47BC"
              />
            </Col>
            <Col lg="4" md="6" className="py-1">
              <PoolCard
                img={GiStarSwirl}
                title="Level Income "
                price={parseFloat(incomes?.level / 1e18)}
                bgColor="#9FCC2E"
              />
            </Col>
            <Col lg="4" md="6" className="py-1">
              <PoolCard
                img={GiStarSwirl}
                title="Top Leader"
                price={parseFloat(incomes?.leader / 1e18)}
                bgColor="#FA9F1B"
              />
            </Col>
            <Col lg="4" md="6" className="py-1">
              <PoolCard
                img={GiStarSwirl}
                title="Grand Leader"
                price={parseFloat(incomes?.grand / 1e18)}
                bgColor="#03A9F4"
              />
            </Col>
            <Col lg="4" md="6" className="py-1">
              <PoolCard
                img={GiStarSwirl}
                title="Dynamic Leader"
                price={parseFloat(incomes?.DLeader / 1e18)}
                bgColor="#AB47BC"
              />
            </Col>
            <Col lg="4" md="6" className="py-1">
              <PoolCard
                img={GiStarSwirl}
                title="1000 Club"
                price={parseFloat(incomes?.thclub / 1e18)}
                bgColor="#9FCC2E"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="px-2">
        <Col lg="8" md="8">
          <Container id="detailCardContainer" className="mb20">
            {/* <div className="detailCard">
                        <p><i><ImLocation2 /></i>Contract Address :</p>
                        <span className='d-none' id="contractAddress">{contract}</span>
                        <span>{Change(contract)} <i onClick={() => CopyToClipboard('contractAddress')}><IoCopyOutline /></i></span>
                    </div> */}
            {/* <div className="detailCard">
              <p>
                <i>
                  <FaUserAlt />
                </i>
                User ID :
              </p>
              <span>{parseInt(userDetails?.id)} </span>
            </div> */}
            <div className="detailCard">
              <p>
                <i>
                  <BiTime />
                </i>
                Platform Running time :
              </p>
              <span>{TimestampToDate(String(planInfo?.startTime))}</span>
            </div>
            <div className="detailCard">
              <p>
                <i>
                  <MdAccountBalanceWallet />
                </i>
                Working Wallet :
              </p>
              <span>
                {parseFloat(userDetails?.wallet30 / 1e18).toFixed(2)} (30%)
              </span>
            </div>
            <div className="detailCard">
              <p>
                <i>
                  <MdAccountBalanceWallet />
                </i>
                Non-Working Wallet :
              </p>
              <span>
                {parseFloat(userDetails?.wallet70 / 1e18).toFixed(2)} (70%)
              </span>
            </div>
            <div className="detailCard">
              <p>
                <i>
                  <MdAccountBalanceWallet />
                </i>
                Freeze Wallet :
              </p>
              <span>{parseFloat(incomes?.freeze / 1e18).toFixed(2)}</span>
            </div>
            <div className="detailCard">
              <p>
                <i>
                  <TbCalendarTime />
                </i>
                Joining Time :{" "}
              </p>
              <span>
                {TimestampToDate(String(rewardStatus?.timestamp, 16))}
              </span>
            </div>
            <div className="detailCard">
              <p>
                <i>
                  <BsPersonPlusFill />
                </i>
                Referrals :
              </p>
              <span>{parseInt(userDetails?.directs, 16)} </span>
            </div>
            <div className="detailCard">
              <p>
                <i>
                  <ImConnection />
                </i>
                Connection Status :
              </p>
              {walletAddress != null ? (
                <div>
                  <span className="d-none" id="dashboardWalletAddress">
                    {walletAddress}
                  </span>
                  <span className="text-success" style={{ color: "#23d551" }}>
                    {Change(walletAddress)}{" "}
                    <i
                      onClick={() => CopyToClipboard("dashboardWalletAddress")}
                    >
                      <IoCopyOutline />
                    </i>
                  </span>
                </div>
              ) : (
                <span className="text-success" style={{ color: "red" }}>
                  Not Connected
                </span>
              )}
            </div>
            <div className="detailCard">
              <p>
                <i>
                  <GiTakeMyMoney />
                </i>
                My Deposit :
              </p>
              <div>
                <span>
                  <span className="usdtSize">USDT</span>
                  {parseFloat(userDetails?.totalDeposit / 1e18).toFixed(2)}
                </span>
                <span>
                  {" "}
                  <button
                    style={{ marginLeft: "5px" }}
                    className="actionBtn"
                    onClick={GetPrincipal}
                  >
                    Principal Claim
                  </button>
                </span>
              </div>
            </div>
          </Container>
        </Col>
        <Col lg="4" md="4" className="d-grid gap-20">
          <div className="card card-body">
            <img src={Tree} id="tree"></img>
            <center>
              <span className="depositHeading" style={{ fontSize: "20px" }}>
                Make Deposit
              </span>
            </center>
            <div className="form-group">
              <label htmlFor="depositAmount">Amount*</label>
              <input
                type="text"
                id="depositAmount"
                value={depositValue}
                onChange={(e) => setDepositValue(e.target.value)}
                className="inputMoney"
                placeholder="Enter Amount"
              />
              <p id="error">{depositError}</p>
            </div>
            <div className="form-group">
              <p id="note">
                Note: The deposit Value Should Be Greater Or Equal Then Your
                Previous Deposit
              </p>
              <center>
                <button
                  onClick={Deposit}
                  className="btn btn-warning depositBtn"
                >
                  Deposit
                </button>
              </center>
            </div>
          </div>
        </Col>
      </Row>

      <Container fluid className="p-2">
        <div id="detailCardContainer">
          <div className="detailCard">
            <p>
              <i>
                <MdAccountBalanceWallet />
              </i>
              BNB Balance :
            </p>
            <span>{parseFloat(maticBalance / 1e18).toFixed(5)}</span>
          </div>
          <div className="detailCard">
            <p>
              <i>
                <MdAccountBalanceWallet />
              </i>
              USDT Balance :
            </p>
            <span>{parseFloat(balance).toFixed(2)}</span>
          </div>
          <div className="detailCard">
            <p>
              <i>
                <SiOpslevel />
              </i>
              Level Open :
            </p>
            <span>{String(userDetails?.openLevel)}</span>
          </div>
          <div className="detailCard">
            <p>
              <i>
                <IoIosPeople />
              </i>
              My Team :
            </p>
            <span>{String(userDetails?.teamNum)}</span>
          </div>
          <div className="detailCard">
            <p>
              <i>
                <SiStartrek />
              </i>
              Trigger Status :
            </p>
            {triggerData?.freezewallet == true ? (
              <span>Enable</span>
            ) : (
              <span>Disable</span>
            )}
          </div>
          <div className="detailCard">
            <p>
              <i>
                <MdAccountBalanceWallet />
              </i>
              My Orders :
            </p>
            <span>{parseInt(userDetails?.orderCount, 16)}</span>
          </div>
          <div className="detailCard">
            <p>
              <i>
                <BsPersonPlusFill />
              </i>
              Referral :
            </p>
            <span className="d-none" id="refLink">
              {userDetails?.sponsor}
            </span>
            <span>
              {Change(userDetails?.sponsor)}{" "}
              <i onClick={() => CopyToClipboard("refLink")}>
                <IoCopyOutline />
              </i>
            </span>
          </div>
          <div className="detailCard">
            <p>
              <i>
                <BsPersonPlusFill />
              </i>
              My Directs :
            </p>
            <span className="d-none" id="refLink">
              {userDetails?.sponsor}
            </span>
            <span>{String(userDetails?.directs)} </span>
          </div>
          {/* <div className="detailCard">
                        <p><i><GiTakeMyMoney /></i>My Deposit :</p>
                        <span>{parseFloat(userDetails?.totalDeposit / 1e18).toFixed(2)}</span>
                    </div> */}
          <div className="detailCard">
            <p className="d-none " id="myLink">
              {userId != 0
                ? window.location.origin + "/?ref=" + userAddress
                : "Not Register"}
            </p>
            <p>
              <i>
                <FaLink />
              </i>
              Referral Link :
            </p>
            <span>
              {Change(window.location.origin + "/?ref=" + userAddress)}{" "}
              <i>
                <IoCopyOutline onClick={() => CopyToClipboard("myLink")} />
              </i>
            </span>
          </div>
        </div>
      </Container>
      <Container fluid className="p-2 pt-0" style={{ overflowX: "scroll" }}>
        <table className="tableSection">
          <thead>
            <tr>
              <th>Sno.</th>
              <th>Amount</th>
              <th>Claimed</th>
              <th>Cycles</th>
              <th>Last Claim</th>
              <th>Next Claim</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((x, i) =>
              x.status == false ? (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{String(x.amount / 1e18)}</td>
                  <td>{String(x.claimed / 1e18)}</td>
                  <td>{String(x.cycle)}</td>
                  <td>
                    {x.lastClaim == 0
                      ? "Not Claimed Yet"
                      : TimestampToDate(x.lastClaim)}
                  </td>
                  <td>{TimestampToDate(String(x.nextClaim))}</td>
                  <td>
                    {(triggerData?.freezewallet == false &&
                      triggerData?.triggers?.status == true) ||
                      incomes.income_status == true ? (
                      toTimestamp(x.nextClaim) === true ? (
                        <button
                          style={{ background: "#03ff03" }}
                          onClick={() => GetClaim(i + 1)}
                          className="actionBtn"
                        >
                          Claim
                        </button>
                      ) : (
                        <button
                          style={{ background: "#5c3f09" }}
                          className="actionBtn"
                        >
                          Claim
                        </button>
                      )
                    ) : (
                      <button
                        style={{ background: "#5c3f09" }}
                        className="actionBtn"
                      >
                        Claim
                      </button>
                    )}
                  </td>

                  {/* {
                                    String(x.cycle) <= 50 ? <td><button onClick={() => GetClaim(i + 1)} className="actionBtn">Claim</button></td> :
                                        <td><button style={{ background: "green" }} className="actionBtn">Claim</button></td>
                                } */}
                </tr>
              ) : (
                ""
              )
            )}
          </tbody>
        </table>
      </Container>
    </React.Fragment>
  );
};
export default Dashboard;
