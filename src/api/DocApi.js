import customAxios from "@/network/main";

export default {
    getMyDocVO
}


function getMyDocVO(parentId) {
    return customAxios.get("/doc/my", {params: {parentId: parentId}})
}