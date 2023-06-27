import {createRouter, createWebHashHistory} from 'vue-router'


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
    }
]


const customRouter = createRouter({
    history: createWebHashHistory(),
    routes
})

export default customRouter



