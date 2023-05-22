import { BigNumber, ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';

    
export default async function RewardStatus (id) {
    const { ethereum } = window;
    if (ethereum) {
        try{
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer);           
            const rewardStatus = await contractinstance.rewardStatus(id);
            return rewardStatus;
        }catch(e){
            console.log('RewardStatus',e);
        }
    }else{
        return [];
    } 
        
}
 
