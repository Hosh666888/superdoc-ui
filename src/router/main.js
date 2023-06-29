import {createRouter, createWebHashHistory} from 'vue-router'
import UserApi from "@/api/UserApi";
import LocalstorageUtil from "@/utils/LocalstorageUtil";


const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/home",
        component: () => import("@/components/Home")
    },
    {
        path: "/repos",
        component: () => import("@/components/Repos")
    },
    {
        path: "/docs/:repoId",
        component: () => import("@/components/Docs"),
        name: "Docs"
    },
    {
        path: "/manage",
        component:()=>import("@/components/manage/Manage")
    }
]


const customRouter = createRouter({
    history: createWebHashHistory(),
    routes
})


customRouter.beforeEach((to, from, next) => {
    if (to.path === "/" || to.path === "/home") return
    if (to.matched < 0) return;

    UserApi.auth().then(res => {
        if (res.data.code === 0) {
            LocalstorageUtil.setLoginUser(res.data.data)
            next()
        } else {
            location.replace("/")
        }
    }).catch(err => {
        console.log(err)
        location.replace("/")
    })


})


export default customRouter



