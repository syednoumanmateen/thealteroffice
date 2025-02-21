const Button = ({ children, type = "button", onClick, theme, className = "" }) => {
    const themeClasses = {
        theme: "btn-theme",
        dark: "btn-dark",
        "theme-outline": "btn-outline-theme",
    };

    return (
        <button type={type} onClick={onClick} className={`btn rounded-5 ${themeClasses[theme] || "btn-outline-dark"} ${className}`}>
            {children}
        </button>
    );
};

export default Button;
