import { CSSProperties, FC, memo, ReactNode } from 'react'

interface propsTypes {
    children: ReactNode;
    style?: CSSProperties
}

const CenterScreen: FC<propsTypes> = ({ children, style }) => {
    return (
        <div className="d-flex justify-content-center align-items-center hght-100" style={style}>
            {children}
        </div>
    )
}

export default memo(CenterScreen)
