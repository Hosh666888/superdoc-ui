import axios from "axios";
import LocalstorageUtil from "@/utils/LocalstorageUtil";

const customAxios = axios.create({
    baseURL: "http://localhost:89/",
    timeout: 5000
})


customAxios.interceptors.request.use(config => {
    let token = LocalstorageUtil.getToken();
    if (token != null) {
        config.headers["token"] = token
    }
    return config
}, err => {
    return Promise.reject(err)
})

customAxios.interceptors.response.use(
    (response) => {

        let code = response.data.code

        if (code === -2) {
            LocalstorageUtil.clearAll()
            this.$router.push("/")
        }

        return response

    },
    err => {
        console.log(err);
        return Promise.reject(err)
    }
)


export default customAxios