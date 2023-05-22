import { configureStore } from '@reduxjs/toolkit'
import Accounts from './Redux/Accounts'
import BaseInfo from './Redux/BaseInfo'
import Contract from './Redux/Contract'

export default configureStore({
    reducer: {
        account:Accounts,
        contract:Contract,
        baseInfo:BaseInfo,
    },
})