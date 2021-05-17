import axios from './config/axiosConfig';
import defaultConfig from '@/config/config';

class identifyService{
    async register(userData){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/registerUser`,userData)
    }

    async AuthorService(){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/checkPermission`)
    }

    async loginService(userData){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/loginuser`,userData)
    }
    //更改用户信息
    async UserInfoSetting(userData){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/updateUserInfo`,userData)
    }

    //获取未审核的用户
    async unapproveduserlist(args){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/unapprovedUser`,{
            params: args
        })
    }

    //用户通过审核
    async approveduser(args){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/approveduser`,args)
    }

    //删除审核未通过的用户
    async deleteuser(args){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/deleteuser`,args)
    }

    async getUnapprovedBlog(args){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/getUnapprovedBlog`,{
            params: args
        })
    }

    async getUnapproveduser(args){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/getUnapproveduser`,{
            params: args
        })
    }

    async switchAdmin(args){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/switchAdmin`,args)
    }

    async switchapproved(args){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/switchapproved`,args)
    }

    async getUserInfo(){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/userRegisterInfo`)
    }

    async getblogInfo(){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/getblogInfo`)
    }
}

export default new identifyService()