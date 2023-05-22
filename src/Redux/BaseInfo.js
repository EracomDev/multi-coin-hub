import { createSlice } from '@reduxjs/toolkit'

const arr  = {tx_URL:"https://mumbai.polygonscan.com"} 

export const BaseInfo = createSlice({
  name: 'baseInfo',
  initialState: {
    value: arr,
  },
  reducers: {    
     
  },
})
 
// Action creators are generated for each case reducer function

export default BaseInfo.reducer

