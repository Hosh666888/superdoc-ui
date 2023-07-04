import {ElNotification} from "element-plus";

export default {
    success, warning, info, error
}

const offset = 30


function success(title, message) {
    ElNotification({
        title: title,
        message: message,
        type: 'success',
        duration: 1000,
        offset: offset
    })
}


function warning(title, message) {
    console.log(message)
    ElNotification({
        title: title,
        message: message,
        type: 'warning',
        duration: 3500,
        offset: offset
    })
}

function info(title, message) {
    console.log(message)
    ElNotification({
        title: title,
        message: message,
        type: 'info',
        duration: 3500,
        offset: offset
    })
}


function error(title, message) {
    console.log(message)
    ElNotification({
        title: title,
        message: message,
        type: 'error',
        offset: offset
    })
}

