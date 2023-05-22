import React, { useEffect, useState } from 'react'
import "./MyTeam.css"
import { Container, Row, Col } from 'react-bootstrap'
import { BiTime } from 'react-icons/bi'
import { ImLocation2 } from 'react-icons/im'
import { ImConnection } from 'react-icons/im'
import { ethers } from 'ethers';
import { useSelector } from 'react-redux'
import UserInfo from "./../../Common/UserInfo"
import ContractBasicInfo from '../../Common/ContractBasicInfo'
import Loader from "./../../Component/Loader"
import TimestampToDate from '../../Common/TimestampToDate'
import Income from '../../Common/Income'
import GetBusiness from '../../Common/GetBusiness'
const MyTeam = () => {
    const [contract, setContract] = useState(useSelector((state) => state.contract.value.contract));
    const [planInfo, setPlanInfo] = useState('');
    const [userInformation, setUserInformation] = useState([]);
    const [walletAddress, setWalletAddress] = useState('');
    const [loading, setLoading] = useState(false)
    const [minor, setMinor] = useState(0)
    const [businessData, setBusinessData] = useState([]);
    const [minorBusinessData, setMinorBusinessData] = useState(0);
    const [run, setRun] = useState(true);
    const [acc, setAccount] = useState(localStorage.getItem("viewId"));
    useEffect(() => {
        if (run) {
            Fetch_data();
            setRun(false)
        }
    }, [])

    async function Fetch_data() {
        if (window.ethereum) {
            setLoading(true);
            try {
                const BasicInfo = await ContractBasicInfo();
                // console.log("BasicInfo", BasicInfo)
                setPlanInfo(BasicInfo);

                const userInfo = await UserInfo(acc);
                setUserInformation(userInfo);
                // console.log("userinfo", userInfo?.userInfo);

                const provider1 = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider1.getSigner();
                let addr = await signer.getAddress();
                setWalletAddress(addr);

                const business = await GetBusiness(acc);
                // console.log('business', parseFloat(business / 1e18));
                // console.log('business2222', parseFloat(userInfo?.userInfo?.teamBusiness / 1e18));
                let minor = parseFloat(userInfo?.userInfo?.teamBusiness / 1e18) - parseFloat(business / 1e18);
                setMinorBusinessData(minor);
                setBusinessData(parseFloat(business / 1e18))


                setLoading(false)
            } catch (e) {
                setLoading(false)
                console.log(e);
            }
        }
    }
    return (
        <React.Fragment>
            {
                loading === true ? <Loader /> : null
            }
            <div className='LatestDepositDiv'>
                <h4 className="dashboardHeading">my team</h4>
                <Container id="detailCardContainer">
                    {/* <div className="detailCard">
                        <p><i><ImLocation2 /></i>Contract Address :</p>
                        <span>{contract}</span>
                    </div> */}
                    <div className="detailCard">
                        <p><i><BiTime /></i>Platform Running time :</p>
                        <span>{TimestampToDate(String(planInfo?.startTime), 1)}</span>
                    </div>
                    <div className="detailCard">
                        <p><i><ImConnection /></i>Connection status :</p>
                        {
                            walletAddress !== null ?
                                <span style={{ color: "green" }}>{walletAddress}</span> :
                                <span style={{ color: "red" }}>Wallet not Connected.</span>
                        }
                    </div>
                </Container>
                <Container>
                    <Row id="myTeamRow">
                        <Col xs="6" lg="3" id="myTeamCol">
                            <h1 style={{ color: "#1f818b" }}>{String(userInformation?.userInfo?.directs)}</h1>
                            <p>Direct Referrals</p>
                        </Col>
                        <Col xs="6" lg="3" id="myTeamCol">
                            <h1 style={{ color: "green" }}>{parseFloat(userInformation?.userInfo?.directBusiness / 1e18).toFixed(2)}</h1>
                            <p>Direct Business </p>
                        </Col>
                        <Col xs="6" lg="3" id="myTeamCol">
                            <h1 style={{ color: "rebeccapurple" }}>{parseFloat(userInformation?.userInfo?.balance / 1e18).toFixed(2)}</h1>
                            <p>My Income </p>
                        </Col>
                        <Col xs="6" lg="3" id="myTeamCol">
                            <h1 style={{ color: "orange" }}>{String(userInformation?.userInfo?.teamNum)}</h1>
                            <p>Downline</p>
                        </Col>
                        <Col xs="6" lg="3" id="myTeamCol">
                            <h1 style={{ color: "blue" }}>{parseFloat(userInformation?.userInfo?.teamBusiness / 1e18).toFixed(2)}</h1>
                            <p>Sales</p>
                        </Col>
                        <Col xs="6" lg="3" id="myTeamCol">
                            <h1 style={{ color: "orange" }}>{parseFloat(businessData).toFixed(2)}</h1>
                            <p>Major Performance</p>
                        </Col>
                        <Col xs="6" lg="3" id="myTeamCol">
                            <h1 style={{ color: "orange" }}>{parseFloat(minorBusinessData).toFixed(2)}</h1>
                            <p>Miner Performance</p>
                        </Col>
                    </Row>
                </Container>

            </div >
        </React.Fragment >
    )
}

export default MyTeam