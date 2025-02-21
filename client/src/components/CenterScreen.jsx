import { memo, useMemo } from "react";

const CenterScreen = ({ children, style }) => {
    const combinedStyle = useMemo(
        () => ({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            ...style, // Merge user-provided styles
        }),
        [style]
    );

    return <div style={combinedStyle}>{children}</div>;
};

export default memo(CenterScreen);
