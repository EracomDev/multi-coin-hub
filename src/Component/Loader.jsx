import React from 'react'
import Logo from './../Images/logo2.png'
const Loader = () => {
    return (
        <div className="spinner-box">
            <div className="blue-orbit leo">
            </div>

            <div className="green-orbit leo" style={{ color: 'rgb(255 200 0)' }}>
                Multi Coin Hub
                {/* <img style={{ width: '30px' }} src={Logo} alt="" /> */}
            </div>

            <div className="red-orbit leo">
            </div>

            <div className="white-orbit w1 leo">
            </div><div className="white-orbit w2 leo">
            </div><div className="white-orbit w3 leo">
            </div>
        </div>
    )
}

export default Loader