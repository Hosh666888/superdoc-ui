import customAxios from "@/network/main";

export default {
    getMyRepos, addRepo, updateRepo, deleteRepo, getRepoList, dropDown
}


function getMyRepos() {
    return customAxios.get("/repo/my");
}


function addRepo(data) {
    return customAxios.post("/repo", data)
}

function updateRepo(data) {
    return customAxios.post("/repo/modify", data)
}

function deleteRepo(repoId) {
    return customAxios.post("/repo/delete/" + repoId)
}

function getRepoList(name, pageIndex, pageSize) {
    return customAxios({
        method: 'get',
        url: '/repo',
        params: {
            name: name,
            pageIndex: pageIndex,
            pageSize: pageSize
        }
    })
}

function dropDown(name) {
    return customAxios({
        method: 'get',
        url: '/repo/dropDown',
        params: {
            name: name
        }
    })
}