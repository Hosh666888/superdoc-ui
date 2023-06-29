import customAxios from "@/network/main";


export default {
    login, logout,auth
}


function login(data) {
    return customAxios.post("/u/login", data)
}

function logout() {
    return customAxios.post("/u/logout")
}

function auth(){
    return customAxios.get("/u/auth")
}
