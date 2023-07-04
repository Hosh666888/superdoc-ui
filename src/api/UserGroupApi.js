import customAxios from "@/network/main";


export default {
    getUserGroupList, modifyUserGroup, deleteUserGroupById, addUserGroup, removeUserByUid, dropDown
}

function getUserGroupList(data) {
    return customAxios({
        method: 'get',
        url: '/ug',
        params: data
    })
}

function modifyUserGroup(data) {
    return customAxios.post("/ug/modify", data)
}


function deleteUserGroupById(id) {
    let arr = [];
    arr.push(id)
    let data = {
        ids: arr
    }
    return customAxios.post("/ug/batchDelete", data)
}

function addUserGroup(data) {
    return customAxios.post("/ug", data)
}

function removeUserByUid(groupId, uid) {
    let data = {
        groupId: groupId,
        uid: uid
    }
    return customAxios.post("/ug/removeUser", data)
}

function dropDown() {
    return customAxios({
        method: 'get',
        url: '/ug/dropDown'
    })
}