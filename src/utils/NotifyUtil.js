import {ElNotification} from "element-plus";

export default {
    success, warning, info, error
}


function success(title, message) {
    ElNotification({
        title: title,
        message: message,
        type: 'success',
        duration: 2500,
        offset:28
    })
}


function warning(title, message) {
    console.log(message)
    ElNotification({
        title: title,
        message: message,
        type: 'warning',
        duration:3500,
        offset:28
    })
}

function info(title, message) {
    console.log(message)
    ElNotification({
        title: title,
        message: message,
        type: 'info',
        duration:3500,
        offset:28
    })
}


function error(title, message) {
    console.log(message)
    ElNotification({
        title: title,
        message: message,
        type: 'error',
        offset:28
    })
}

