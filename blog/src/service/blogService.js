import axios from './config/axiosConfig';
import defaultConfig from '@/config/config'

class blogService {
    async createBlog(blogData){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/createBlogItem`,blogData)
    }

    async pubilckBlog(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getpulickBlog`,{
            params: args
        })
    }

    async getBlogByid(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getBlogDetailByid`,{
            params:args
        })
    }

    async createComment(args){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/comment/create`,args)
    }
    //获取我的文章数据
    async getMyBlog(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getmyblog`,{
            params: args
        })
    }

     //获取我喜欢的文章
     async mylikes(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/mylikes`,{
            params: args
        })
    }

     //获取我喜欢的关注
     async myattention(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getattentions`,{
            params: args
        })
    }

    //获取我喜欢的黑名单
    async myblacklist(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getblacklist`,{
            params: args
        })
    }

    //搜索功能
    async searchBlog(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/searchblog`,{
            params: args
        })
    }

    async unapprovedblog(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/unapprovedblog`,{
            params: args
        })
    }

    async approvedblog(args){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/approvedblog`,args)
    }

    async deleteblog(args){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/deleteblog`,args)
    }

}

export default new blogService()