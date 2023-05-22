import React from 'react'
import "./LatestDeposit.css"
import { BiTime } from 'react-icons/bi'
import { MdAttachMoney } from 'react-icons/md'
import { TbCalendarTime } from 'react-icons/tb'
import { ImLocation2 } from 'react-icons/im'
import { ImConnection } from 'react-icons/im'
import { Container } from 'react-bootstrap'
import { TbDatabaseOff } from 'react-icons/tb';
const LatestDeposit = () => {
    return (
        <React.Fragment>
            <div className='LatestDepositDiv'>
                <Container id="detailCardContainer">
                    <div className="detailCard">
                        <p><i><ImLocation2 /></i>Contract Address :</p>
                        <span>0x7bbE50919aDa0962ec76746f02bb2e5D3c1Ee468</span>
                    </div>
                    <div className="detailCard">
                        <p><i><BiTime /></i>Platform Running time :</p>
                        <span></span>
                    </div>
                    <div className="detailCard">
                        <p><i><MdAttachMoney /></i>Income :</p>
                        <span>17% in Each Cycle</span>
                    </div>
                    <div className="detailCard">
                        <p><i><ImConnection /></i>Connection status :</p>
                        <span style={{ color: "red" }}>Wallet not Connected.</span>
                    </div>
                </Container>
                <Container className="p-0">
                    <div className="tableOuter">
                        <div className="myTeamTable">
                            <table >
                                <tr>
                                    <th>Amount</th>
                                    <th>Deposit Date</th>
                                    <th>Unlock Time</th>
                                    <th>Order Status</th>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <h3 className="noData">No Data To Show <i><TbDatabaseOff /></i></h3>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default LatestDeposit