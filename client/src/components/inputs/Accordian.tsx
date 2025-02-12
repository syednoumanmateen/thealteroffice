import { FC, ReactNode } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface AccordianData {
    key: string;
    label: string;
    isOpen: boolean;
}

interface AccordianProps {
    children: ReactNode;
    data: AccordianData;
    handleToggle: (key: string) => void;
}

const Accordian: FC<AccordianProps> = ({ children, data, handleToggle }) => {
    const getBgClass = () => ({
        "To Do": "bg-todo",
        "In Progress": "bg-inprogress",
        "Completed": "bg-completed",
    }[data.label] || "bg-default");

    return (
        <div className="card bg-card">
            <div onClick={() => handleToggle(data.key)} className={`card-header fw-bold ${getBgClass()}`}>
                <div className="row g-0 align-items-center">
                    <div className="col-11">{data.label}</div>
                    <div className="col-1 d-flex justify-content-end">
                        {data.isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </div>
            </div>
            {data.isOpen && <div className="card-body p-0">{children}</div>}
        </div>
    );
};

export default Accordian;
