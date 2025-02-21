import { Dropdown } from 'antd';
import {  memo } from 'react';
import { SlOptions } from 'react-icons/sl';

const DropDownFromList= ({ _id, data, handleEdit, handleDelete }) => {
    const dropdownItems= [
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
