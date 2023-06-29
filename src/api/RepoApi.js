import customAxios from "@/network/main";

export default {
    getMyRepos
}


function getMyRepos() {
    return customAxios.get("/repo/my");
}