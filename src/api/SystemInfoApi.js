import customAxios from "@/network/main";

export default {
    systemInfo
}


function systemInfo() {
    return customAxios({
        url: '/sys/info',
        method: 'get'
    })
}