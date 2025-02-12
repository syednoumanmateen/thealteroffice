import { Dropdown } from "antd";
import { FC, memo, ReactNode } from "react";

interface DropDownProps {
    children: ReactNode;
    items: { key: string; label: string; onClick?: () => void }[];
}

const DropDown: FC<DropDownProps> = ({ children, items }) => (
    <Dropdown menu={{ items }} placement="bottom" arrow>
        {children}
    </Dropdown>
);

export default memo(DropDown);
