import { CSSProperties, FC, ReactNode, useMemo } from "react";

interface CenterScreenProps {
    children: ReactNode;
    style?: CSSProperties;
}

const CenterScreen: FC<CenterScreenProps> = ({ children, style }) => {
    const combinedStyle = useMemo<CSSProperties>(
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

export default CenterScreen;
