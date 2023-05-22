import { ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';
import React from 'react'; 


    
export default async function GetOrders (acc, count) {
    try{
    var arr = [];
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer); 
    for(let i=1; i<=count; i++){
        const bl = await contractinstance.orders(acc , i);
        arr.push(bl);
    }
    // console.log("data " , arr);
    return arr;
}catch(e){
    console.log(e);
}
}
 