import customAxios from "@/network/main";


export default {
    getUserGroupList
}

function getUserGroupList(data) {
    return customAxios({
        method: 'get',
        url: '/ug',
        params: data
    })
}
