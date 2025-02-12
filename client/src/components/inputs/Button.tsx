import { FC, ReactNode } from "react";

interface propsType {
    children: ReactNode;
    type: any;
    onClick?: (data: any) => void;
    theme?: string;
    className?: string
}

const Button: FC<propsType> = ({ children, type, onClick, theme, className }) => {
    let btnBg = "btn-outline-dark"
    if (theme === "theme") btnBg = "btn-theme";
    if (theme === "dark") btnBg = "btn-dark";
    if (theme === "theme-outline") btnBg = "btn-outline-theme";

    return (
        <button type={type} onClick={onClick} className={`btn rounded-5 ${btnBg} ${className}`}>
            {children}
        </button>
    )
}

export default Button
