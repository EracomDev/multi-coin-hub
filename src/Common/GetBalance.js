import { ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';

export default async function GetBalance (id) {
    const { ethereum } = window;
    if(ethereum){
        try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractinstance = new ethers.Contract(ContractDetails.BUSD, ContractDetails.BUSD_ABI, signer); 
        // console.log( contractinstance)
        const bl = await contractinstance.balanceOf(id);
        return bl;
        }catch(e){
            console.log('GetBalance',e);
        }
    }
}