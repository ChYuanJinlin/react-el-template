
import ajax from './axios'
// 统一暴露
export default {
    // 获取轮播图
    getBanner(typeid, menuid, loc) {
        /**
         * @param ajax(url,data[,loading],method='get')
         */
        return ajax('banner_imgs/list', { typeid, menuid, loc },{},'post')
    },
    gethotlist(page, limit) {
        return ajax('news/hotlist', { page, limit })
    }
}


