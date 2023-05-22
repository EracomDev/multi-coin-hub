import React from 'react'
import "./PoolCard.css"
import dai from "./../../Images/dai.png"

const PoolCard = (props) => {
    return (
        <React.Fragment>
            <div className="poolCard d-flex" >
                <div className="cardImg"><i><props.img /></i></div>
                <div className="cardText">
                    <p>{props.title}</p>
                    <h4>{parseFloat(props.price).toFixed(2)}</h4>
                </div>
            </div>
        </React.Fragment>
    )
}
export default PoolCard