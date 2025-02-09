import { message } from "antd"
let obj: any = {}

// form Error handle
obj.errorHandle = (e: any) => {
    const arr = Object.keys(e)
    message.error(e[arr[0]].message)
}

export default obj