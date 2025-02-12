import { FC, ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    theme?: "theme" | "dark" | "theme-outline";
    className?: string;
}

const Button: FC<ButtonProps> = ({ children, type = "button", onClick, theme, className = "" }) => {
    const themeClasses = {
        theme: "btn-theme",
        dark: "btn-dark",
        "theme-outline": "btn-outline-theme",
    };

    return (
        <button type={type} onClick={onClick} className={`btn rounded-5 ${themeClasses[theme!] || "btn-outline-dark"} ${className}`}>
            {children}
        </button>
    );
};

export default Button;
