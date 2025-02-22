import { Drawer, Modal } from "antd";
import {  memo } from "react";
import TaskForm from "./task/TaskForm";

const Model = ({ title, isMobile, isModalOpen, setIsModalOpen, input, width }) => {
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
