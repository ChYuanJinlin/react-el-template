import { Add, DECREASE } from './action-types'
const addCount = () => {
    return {
        type: Add
    }
}
export const decrease = () => {
    return {
        type: DECREASE
    }
}
// 发送异步请求
export const addCountAsync = () => {
    return dispatch => {
        setTimeout(() => {
            dispatch(addCount());
        }, 1000);
    }
}
