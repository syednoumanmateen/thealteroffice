import { Dropdown } from "antd";
import {  memo } from "react";


const DropDown = ({ children, items }) => (
    <Dropdown menu={{ items }} placement="bottom" arrow>
        {children}
    </Dropdown>
);

export default memo(DropDown);
