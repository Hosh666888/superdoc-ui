import customAxios from "@/network/main";

export default {
    getMyDocVO
}


function getMyDocVO(parentId, repoId) {
    return customAxios.get("/doc/my", {params: {parentId: parentId, repoId: repoId}})
}