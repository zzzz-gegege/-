import axios from './config/axiosConfig';
import defaultConfig from '@/config/config'

class TopOffservice{
    async tipoffservice(data){
        return axios.post(`${defaultConfig.baseApiUrl}/topoff/article`,data)
    }

    async getTipoffblog(data){
        return axios.get(`${defaultConfig.baseApiUrl}/topoff/getarticle`,{
            params: data
        })
    }

    async DeleteTipoffblog(data){
        return axios.delete(`${defaultConfig.baseApiUrl}/topoff/deleteTipoff/${data._id}`)
    }

    async Deleteblog(data){
        return axios.delete(`${defaultConfig.baseApiUrl}/topoff/deleteblog/${data.blogId}`)
    }
}

export default new TopOffservice()