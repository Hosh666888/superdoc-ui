import axios from "axios";

const customAxios = axios.create({
    baseURL: "http://localhost:89/",
    timeout: 5000
})

export default customAxios