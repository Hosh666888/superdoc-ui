const token_key = "super_doc_key"
const login_user_key = "super_doc_login"

export default {
    getToken,
    clearAll,
    setToken,
    setLoginUser
}

function getToken() {
    return localStorage.getItem(token_key)
}

function clearAll() {
    return localStorage.clear()
}

function setToken(token) {
    localStorage.setItem(token_key, token)
}

function setLoginUser(data) {
    localStorage.setItem(login_user_key, JSON.stringify(data))
    localStorage.removeItem(token_key)
    localStorage.setItem(token_key, data.token)
}









