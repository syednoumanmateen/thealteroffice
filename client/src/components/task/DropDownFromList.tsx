import { Dropdown, MenuProps } from 'antd';
import { FC, memo } from 'react';
import { SlOptions } from 'react-icons/sl';

interface propsType {
    _id: string;
    data?: any;
    handleEdit: (_id: string, data: any) => void;
    handleDelete: (_id: string) => void;
}

const DropDownFromList: FC<propsType> = ({ _id, data, handleEdit, handleDelete }) => {
    const dropdownItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div className='' onClick={() => handleEdit(_id, data)}>Edit</div>
            )
        },
        {
            key: '2',
            label: (
                <div className='' onClick={() => handleDelete(_id)}>Delete</div>
            )
        }
    ];

    return (
        <Dropdown menu={{ items: dropdownItems }} placement="bottom" arrow><SlOptions /></Dropdown>
    )
}

export default memo(DropDownFromList)
