import { Dropdown, MenuProps } from 'antd';
import { FC, memo } from 'react';
import { SlOptions } from 'react-icons/sl';

interface Props {
    _id: string;
    data?: Record<string, any>; // Explicit type for data
    handleEdit: (_id: string, data: Record<string, any> | undefined) => void;
    handleDelete: (_id: string) => void;
}

const DropDownFromList: FC<Props> = ({ _id, data, handleEdit, handleDelete }) => {
    const dropdownItems: MenuProps['items'] = [
        {
            key: 'edit',
            label: <span onClick={() => handleEdit(_id, data)}>Edit</span>,
        },
        {
            key: 'delete',
            label: <span onClick={() => handleDelete(_id)}>Delete</span>,
        }
    ];

    return (
        <Dropdown menu={{ items: dropdownItems }} placement="bottom" arrow>
            <SlOptions />
        </Dropdown>
    );
};

export default memo(DropDownFromList);
