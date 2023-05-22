import React from 'react'
import Dai from "./../Images/dai.png"
const DaiIcon = (props) => {
    return (
        <img src={Dai} alt="dai" className='daiIcon' style={{ width: props.width, marginRight: '5px' }}></img>
    )
}

export default DaiIcon