import { ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';

export default async function GetBusiness (acc) {
    const { ethereum } = window;
    if(ethereum){
        try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer); 
        // console.log( 'contractinstance',contractinstance)
        const business  = await contractinstance.business(acc);
        // console.log('business' , business)
        return business;
        }catch(e){
            console.log('GetBusiness',e);
        }
    }
}