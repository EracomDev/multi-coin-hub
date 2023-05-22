import { BigNumber, ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';

    
export default async function ContractBasicInfo () {
    const { ethereum } = window;
    if (ethereum) {
        try{
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer); 
            const startTime = await contractinstance.startTime();
        return {startTime:startTime}
        }catch(e){
            console.log('ContractBasicInfo',e);
        }
    }else{
        return [];
    } 
        
}
 
