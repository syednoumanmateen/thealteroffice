import { message } from "antd"
let obj = {}

// form Error handle
obj.errorHandle = (e) => {
    const arr = Object.keys(e)
    message.error(e[arr[0]].message)
}

obj.groupByStatus = (tasks) => {
    return tasks.reduce((acc, task) => {
        acc[task.status] = acc[task.status] || [];
        acc[task.status].push(task);
        return acc;
    }, {});
};

obj.reload = () => {
    window.location.reload()
}

export default obj