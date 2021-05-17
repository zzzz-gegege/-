import axios from './config/axiosConfig';
import defaultConfig from '@/config/config';

class UserDetailService{
    async setlikes(args){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/likes`,args)
    }

    async unlikes(args){
        return axios.delete(`${defaultConfig.baseApiUrl}/blog/likes/${args}`)
    }

    async setblacklist(args){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/blacklist`,args)
    }

    async unblacklist(args){
        return axios.delete(`${defaultConfig.baseApiUrl}/blog/blacklist/${args}`)
    }
    async setattention(args){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/attention`,args)
    }
    async unattention(args){
        return axios.delete(`${defaultConfig.baseApiUrl}/blog/attention/${args}`)
    }

    //获取评论
    async getComment(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getcomment`,{
            params: args
        })
    }
}

export default new UserDetailService()