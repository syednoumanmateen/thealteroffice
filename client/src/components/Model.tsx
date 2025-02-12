import { Drawer, Modal } from "antd";
import { FC, memo } from "react";
import TaskForm from "./task/TaskForm";

interface PropsType {
    title: string;
    isMobile: boolean;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: any) => void;
    input?: any;
    width?: number;
}

const Model: FC<PropsType> = ({ title, isMobile, isModalOpen, setIsModalOpen, input, width }) => {
    const handleClose = () => setIsModalOpen(false);

    const commonProps = {
        title: `${title} Task`,
        open: isModalOpen,
        onCancel: handleClose,
        footer: null,
    };

    return isMobile ? (
        <Drawer
            {...commonProps}
            placement="bottom"
            onClose={handleClose}
            height="95vh"
            style={{ borderRadius: "15px 15px 0 0" }}
        >
            <TaskForm closeModal={setIsModalOpen} input={input} />
        </Drawer>
    ) : (
        <Modal {...commonProps} width={width} centered>
            <TaskForm closeModal={setIsModalOpen} input={input} />
        </Modal>
    );
};

export default memo(Model);
