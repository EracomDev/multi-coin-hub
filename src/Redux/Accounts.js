import { createSlice } from '@reduxjs/toolkit'

export const Accounts = createSlice({
  name: 'account',
  initialState: {
    value: null,
  },
  reducers: {     
    setaccount: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setaccount } = Accounts.actions

export default Accounts.reducer