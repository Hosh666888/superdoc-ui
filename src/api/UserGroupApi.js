import customAxios from "@/network/main";


export default {
    getUserGroupList, modifyUserGroup, deleteUserGroupById, addUserGroup, removeUserByUid
}

function getUserGroupList(data) {
    return customAxios({
        method: 'get',
        url: '/ug',
        params: data
    })
}

function modifyUserGroup(data) {
    // let newUsers = []
    // for (let item of data.users) {
    //     newUsers.push(item.id)
    // }
    // data.users = newUsers
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