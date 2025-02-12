import { Drawer, Modal } from 'antd'
import { FC, memo } from 'react'
import TaskForm from './task/TaskForm'

interface propsType {
    title: string;
    isMobile: boolean;
    isModalOpen: boolean;
    setIsModalOpen: (data: any) => void;
    input?: any;
    width?: number;
}

const Model: FC<propsType> = ({ title, isMobile, isModalOpen, setIsModalOpen, input, width }) => {
    return (
        <>
            {!isMobile && <Modal
                title={`${title} Task`}
                open={isModalOpen}
                width={width}
                centered
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <TaskForm closeModal={setIsModalOpen} input={input} />
            </Modal>}

            {isMobile && <Drawer
                title={`${title} Task`}
                placement='bottom'
                onClose={() => setIsModalOpen(false)}
                height="95vh"
                style={{ borderRadius: "15px 15px 0 0" }}
                open={isModalOpen}>
                <TaskForm closeModal={setIsModalOpen} input={input} />
            </Drawer>}
        </>
    )
}

export default memo(Model)
