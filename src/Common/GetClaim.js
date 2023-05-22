import { ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';

export default async function GetClaim (id) {
    const { ethereum } = window;
    if(ethereum){
        try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer); 
        console.log( 'contractinstance',contractinstance)
        await contractinstance.claim(id);
        alert('success');
        }catch(e){
            console.log("GetClaim",e);
        }
    }
}