import { ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';

export default async function GetMaticBalance (id) {
    const { ethereum } = window;
    if(ethereum){
        try{
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const bl = await provider.getBalance(id);
        return bl;
        }catch(e){
            console.log('GetMaticBalance',e)
        }
    }
}
