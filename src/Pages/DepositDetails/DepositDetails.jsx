import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BiTime } from 'react-icons/bi'
import { MdAttachMoney } from 'react-icons/md'
import { TbCalendarTime } from 'react-icons/tb'
import { ImLocation2 } from 'react-icons/im'
import { ImConnection } from 'react-icons/im'
import { TbDatabaseOff } from 'react-icons/tb';
import GetOrders from '../../Common/GetOrders'
import { ethers } from 'ethers';
import UserInfo from '../../Common/UserInfo'
import Loader from '../../Component/Loader'
import ContractBasicInfo from '../../Common/ContractBasicInfo'
import TimestampToDate from '../../Common/TimestampToDate'
import ContractDetails from '../../Contracts/ContractDetails'
const DepositDetails = () => {
    const [orders, setOrders] = useState();
    const [walletAddress, setWalletAddress] = useState();
    const [loading, setLoading] = useState(false);
    const [planInfo, setPlanInfo] = useState('');
    const [run, setRun] = useState(true);
    const [acc, setAccount] = useState(localStorage.getItem("viewId"));
    let cntr = 0;
    useEffect(() => {
        if (run) {
            fatch_Details();
            setRun(false)
        }
    }, [])

    async function fatch_Details() {
        cntr++
        setLoading(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const userInfo = await UserInfo(acc);
                // console.log("userinfo", userInfo?.userInfo);

                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    let addr = await signer.getAddress();
                    setWalletAddress(addr);
                }
                const BasicInfo = await ContractBasicInfo();
                // console.log("BasicInfo", BasicInfo)
                setPlanInfo(BasicInfo);

                let count = parseInt(userInfo.userInfo.orderCount)
                const order = await GetOrders(acc, count);
                // console.log('orders', order)
                setOrders(order);
                setLoading(false);
            } else {
                alert('Wallet Not Exist')
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }
    async function GetClaim(id) {
        setLoading(true);
        const { ethereum } = window;
        if (ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer);
                console.log('contractinstance', contractinstance)
                await contractinstance.claim(id);
                setLoading(false);
            } catch (e) {
                setLoading(false);
                console.log(e);
            }
        } else {
            alert('something went wrong');
            setLoading(false);
        }
    }
    return (
        <React.Fragment>
            {
                loading === true ? <Loader /> : ''
            }
            <div className='LatestDepositDiv'>
                <h4 className="dashboardHeading">Deposit details</h4>
                <Container id="detailCardContainer">
                    {/* <div className="detailCard">
                        <p><i><ImLocation2 /></i>Contract Address :</p>
                        <span>0x7bbE50919aDa0962ec76746f02bb2e5D3c1Ee468</span>
                    </div> */}
                    <div className="detailCard">
                        <p><i><BiTime /></i>Platform Running time :</p>
                        <span>{TimestampToDate(String(planInfo?.startTime))}</span>
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
                <Container className='p-0 pt-4' style={{ overflowX: 'scroll' }}>
                    <table className="tableSection">
                        <thead>
                            <tr>
                                <th>Sno.</th>
                                <th>Amount</th>
                                <th>Claimed</th>
                                <th>Cycles</th>
                                <th>Last Claim</th>
                                <th>Next Claim</th>
                                {/* <th>Action</th>   */}
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((x, i) =>
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{String(x.amount / 1e18)}</td>
                                    <td>{String(x.claimed / 1e18)}</td>
                                    <td>{String(x.cycle)}</td>
                                    <td>{x.lastClaim == 0 ? 'Not Claimed Yet' : TimestampToDate(x.lastClaim)}</td>
                                    <td>{String(TimestampToDate(String(x.nextClaim)))}</td>
                                    {/* <td><button onClick={() => GetClaim(i + 1)} className="actionBtn">Claim</button></td> */}
                                </tr>
                            )}

                        </tbody>
                    </table>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default DepositDetails