import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import SplitImg from "./../../Images/split3.png"
import { BiTransferAlt } from 'react-icons/bi'
import "./SplitAccount.css"
import AnimatedButton from '../../Component/PoolCard/AnimatedButton'
import "./../../../src/style.scss"
const SplitAccount = () => {
    return (
        <React.Fragment>
            <Container className="splitAccountContainer">
                <Row className="splitAccountRow">
                    <Col md="6" className="splitAccountLeftCol">
                        <img src={SplitImg} alt="logo.png" />
                    </Col>
                    <Col md="6" className="splitAccountRightCol">
                        <div className="splitAccountDiv">
                            <h4>
                                Split Account
                            </h4>
                        </div>
                        <div>
                            <label htmlFor="">BUSD</label>
                            <input type="text" className="inputPrimary" placeholder='Enter BUSD'></input>
                        </div>
                        <div>
                            <label htmlFor="">Amount (BUSD)</label>
                            <input type="text" className="inputPrimary" placeholder='Enter Amount'></input>
                        </div>
                        <div>
                            <label htmlFor="">Receiver Address</label>
                            <input type="text" className="inputPrimary" placeholder='Enter Receiver Address'></input>
                        </div>
                        {/* <button className="btnIcon">Transfer <i><BiTransferAlt /></i></button>
                        <button className="btnIcon">Deposit</button> */}
                        <div style={{ display: "flex" }}>
                            <AnimatedButton title="Transfer" />
                            <AnimatedButton marginLeft="20px" title="Deposit" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default SplitAccount