import React, { useEffect, useState } from 'react'
import "./SideBar.css"
import NavPages from '../../NavPages';
import { NavLink, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Logo from "./../../Images/logo2.png"
import { FaHome, FaTimes } from "react-icons/fa";
import { RiLuggageDepositFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";
import { CgMenuLeft } from "react-icons/cg";
import { FaUserCog } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

// import { GrContactInfo } from "react-icons/gr";
import { MdClear, MdOutlinePermDeviceInformation } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.css';
import useWindowDimensions from '../../Common/useWindowDimensions';
import { ImSwitch } from 'react-icons/im';
const SideBar = () => {
    const [web3Modal, setWeb3Modal] = useState(null)
    const [sideToggle, setSideToggle] = useState("-300px");
    const [rightSideToggle, setRightSideToggle] = useState("0px");
    const { height, width } = useWindowDimensions();
    const navigate = useNavigate();
    useEffect(() => {
        if (width > 900) {
            setSideToggle('0px')
            setRightSideToggle("240px");
        } else {
            setSideToggle("-300px")
            setRightSideToggle("0");
        }
    }, [width])

    function Logout() {
        localStorage.clear();
        navigate('/')
    }
    return (
        < React.Fragment >
            <h1 id="CopiedMsg">Copied!</h1>
            <Container fluid className="p-0">
                <div id="sidebar" style={{ left: sideToggle }}>
                    <div>
                        <div id="logoDiv" style={{ padding: "10px" }}>
                            <img src={Logo} alt="" />
                            <i onClick={() => setSideToggle("-300px")}><MdClear /></i>
                        </div>
                    </div>
                    <div id="sideItemSection">
                        <NavLink to="/dashboard" activeclassname="activeTab" end >
                            <div className="sideItems">
                                <i id="sideItemId"><FaHome /></i>
                                <h5 id="sideItemTitle" className="align-items-center ">Dashboard</h5>
                            </div>
                        </NavLink>
                        <NavLink to="deposit" activeclassname="activeTab">
                            <div className="sideItems" >
                                <i id="sideItemId"><RiLuggageDepositFill /></i>
                                <h5 id="sideItemTitle" className="align-items-center">Deposit</h5>
                            </div>
                        </NavLink>
                        <NavLink to="withdraw" activeclassname="activeTab">
                            <div className="sideItems">
                                <i id="sideItemId"><GiTakeMyMoney /></i>
                                <h5 id="sideItemTitle" className="align-items-center">Withdraw</h5>
                            </div>
                        </NavLink>
                        <NavLink to="myteam" activeclassname="activeTab">
                            <div className="sideItems">
                                <i id="sideItemId"><RiTeamFill /></i>
                                <h5 id="sideItemTitle" className="align-items-center">My Team</h5>
                            </div>
                        </NavLink>
                        <NavLink to="deposit-details" activeclassname="activeTab">
                            <div className="sideItems">
                                <i id="sideItemId"><MdOutlinePermDeviceInformation /></i>
                                <h5 id="sideItemTitle" className="align-items-center">Deposit Details</h5>
                            </div>
                        </NavLink>
                        <div onClick={Logout} className="sideItems" >
                            <i id="sideItemId"><IoMdLogOut /></i>
                            <h5 id="sideItemTitle" className="align-items-center">Logout</h5>
                        </div>
                    </div>
                </div>
                <div id="rightSection" style={{ marginLeft: rightSideToggle }}>
                    <div className="topNav">
                        {
                            width > 900 ?
                                <i onClick={() => sideToggle === "0px" ? (setSideToggle("-300px"), setRightSideToggle("0px")) : (setSideToggle("0px"), setRightSideToggle("240px"))}><CgMenuLeft /></i>
                                :
                                <i onClick={() => sideToggle === "0px" ? (setSideToggle("-300px")) : (setSideToggle("0px"))}><CgMenuLeft /></i>
                        }
                        <div className="d-flex topNavRight">
                            <i onClick={Logout} id="themeConnectBtn" style={{ color: '#fff' }}><ImSwitch /></i>
                        </div>
                    </div>
                    <div id="contentSection" style={{ background: "#141B2D" }}>
                        <NavPages />
                    </div>
                </div>
            </Container>
        </React.Fragment >
    )
}
export default SideBar