import { message } from "antd"
let obj: any = {}

// form Error handle
obj.errorHandle = (e: any) => {
    const arr = Object.keys(e)
    message.error(e[arr[0]].message)
}

obj.groupByStatus = (tasks: any) => {
    return tasks.reduce((acc: any, task: any) => {
        acc[task.status] = acc[task.status] || [];
        acc[task.status].push(task);
        return acc;
    }, {});
};

obj.reload = () => {
    window.location.reload()
}

export default obj