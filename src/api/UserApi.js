import customAxios from "@/network/main";


export default {
    login, logout, auth, authControlPage, getUserPageList, addUser, restPassword,dropDown
}


function login(data) {
    return customAxios.post("/u/login", data)
}

function logout() {
    return customAxios.post("/u/logout")
}

function auth() {
    return customAxios.get("/u/auth")
}

function authControlPage() {
    return customAxios.get("/u/authControlPage")
}

function getUserPageList(data) {
    return customAxios({
        method: "get",
        url: "/u/list",
        params: data
    })
}


function addUser(data) {
    return customAxios.post("/u", data)
}


function restPassword(uid) {
    return customAxios.post('u/restPassword/' + uid)
}

function dropDown(role) {
    return customAxios({
        method: 'get',
        url: '/u/dropDown',
        params: {
            role: role
        }
    })
}