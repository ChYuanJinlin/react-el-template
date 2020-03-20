
import { Add, DECREASE } from './action-types'

export const count = (state = 1, action) => {

    switch (action.type) {
        case Add:
            return state + 1 
        case DECREASE:
           
            return state - 1 
        default:
            return state

    }
}
export default combineReducers({
    count
})

