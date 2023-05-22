import { createSlice } from '@reduxjs/toolkit'
//import  BUSD_ABI  from '../Contracts/BUSD_ABI.json';
//import  contractABI  from '../Contracts/contract_ABI.json';
import {ContractDetails} from '../Contracts/ContractDetails'
const arr  = ContractDetails;//{contract:"0xc30711CcbF93469c4F695a75b9Ec8EB6AeCFA509",contractABI:contractABI,BUSD:"0xe37b70Ef457899F0afdFB71CEd2671CFA84ef770",BUSD_ABI:BUSD_ABI} 

export const Contract = createSlice({
  name: 'details',
  initialState: {
    value: arr,
  },
  reducers: {    
     
  },
})
 
// Action creators are generated for each case reducer function

export default Contract.reducer

