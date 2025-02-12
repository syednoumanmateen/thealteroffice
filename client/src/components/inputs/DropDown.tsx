import { Dropdown } from 'antd'
import { FC, memo, ReactNode } from 'react'

interface propsType {
    children: ReactNode;
    items: any
}

const DropDown: FC<propsType> = ({ children, items }) => {
    return (
        <Dropdown menu={items } placement="bottom" arrow>
            {children}
        </Dropdown>

    )
}

export default memo(DropDown)
