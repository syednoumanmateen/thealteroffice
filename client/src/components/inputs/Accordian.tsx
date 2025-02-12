import { FC, ReactNode } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

interface propsType {
    children: ReactNode;
    data: any;
    handleToggle: (data: any) => void
}

const Accordian: FC<propsType> = ({ children, data, handleToggle }) => {
    return (
        <>
            <div className="card bg-card">
                <div onClick={() => handleToggle(data.key)} className={`card-header fw-bold ${data.label === "To Do" ? "bg-todo" : data.label === "In Progress" ? "bg-inprogress" : "bg-completed"}`}          >
                    <div className="row g-0 align-items-center">
                        <div className="col-11">{data.label}</div>
                        <div className="col-1 d-flex justify-content-end">
                            {data.isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </div>
                </div>
                {data.isOpen && <div className="card-body p-0">
                    {children}
                </div>}
            </div>
        </>
    )
}

export default Accordian
