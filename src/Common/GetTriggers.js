import { ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';

export default async function GetTriggers (id) {
    // alert();
    const { ethereum } = window;
    if(ethereum){
        try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer); 
        // console.log( 'contractinstance',contractinstance)
        // await contractinstance.claim(id);
        const inc = await contractinstance.enableTrigger.call();
        const isFreezeReward = await contractinstance.isFreezeReward.call();
        const usertriggers =  await contractinstance.usertriggers(id , inc)
        // alert('success');
        let val = parseInt(inc)
        let freezewallet = isFreezeReward
        // console.log('triggers1111' , usertriggers.trigger_status)
        // console.log('isFreezeReward' , freezewallet)

        const triggers = await contractinstance.triggers(val);
        // console.log('triggers2222',triggers.status);

        return {triggers:triggers , freezewallet : freezewallet}
        // if((usertriggers.trigger_status == true && frew == false)){
        //     return true;
        // }else{
        //     return false;
        // }

        }catch(e){
            console.log('Something Went Wrong');
        }
    }
}