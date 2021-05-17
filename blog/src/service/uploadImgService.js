import axios from './config/axiosConfig';
import defaultConfig from '@/config/config'

class ImgService {
    async uploadImgFile(uploadData){
        return axios.post(`${defaultConfig.baseApiUrl}/uploadImg`,uploadData)
    }
}

export default new ImgService()