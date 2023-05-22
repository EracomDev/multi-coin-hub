import { BigNumber, ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';
export default async function IdToAddress (ids) {
    try{
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer);   
        let iddd = parseInt(ids)
        // console.log('idididiididiididi' , iddd)
    const addr = await contractinstance.idToAddress(ids);
    return addr;  
    }catch(e){
        console.log(e)
    } 
    
}
 