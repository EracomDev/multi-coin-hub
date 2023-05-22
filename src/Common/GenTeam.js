import {ethers } from 'ethers';
import ContractDetails from '../Contracts/ContractDetails';

export default async function GenTeam(ids) {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractinstance = new ethers.Contract(ContractDetails.contract, ContractDetails.contractABI, signer);   
    console.log('contractinstance',contractinstance)
    let level_team=[];
    let total_team=[];
    let level_team_cnt=[];
    let global_team_cnt=[];
    let global_team=[];
    let total_team_cnt=0;

    for (let ii = 0; ii < 1 ; ii++) {
        try{
        var cnt = await contractinstance.genTeam(ids);
        console.log('cnt',cnt)
    }catch(e){
        console.log('GenTeam',e)
    }
    }
    total_team_cnt = String(total_team_cnt);
    return {level_team:level_team,level_team_count:level_team_cnt,total_team:total_team,total_team_count:total_team_cnt,global_team:global_team,global_team_count:global_team_cnt};   

}
 