import customAxios from "@/network/main";

export default {
    list, littleChange, deleteById,add,modify
}

function add(data) {
    return customAxios.post("/repoAuth/add", data)
}

function modify(data) {
    return customAxios.post("/repoAuth/modify", data)
}


function list(param) {
    return customAxios({
        method: 'get',
        url: '/repoAuth/list',
        params: param
    })
}

function littleChange(data) {
    return customAxios.post("/repoAuth/change", data)
}

function deleteById(id) {
    return customAxios.post("/repoAuth/delete/" + id)
}