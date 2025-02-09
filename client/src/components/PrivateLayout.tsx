import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"

const PrivateLayout = () => {
    // navigate object
    const navigate = useNavigate()

    // redux
    const { isAuthenticated, user } = useSelector((state: any) => state.auth)
    const dispatch = useDispatch()


    return (
        <>
            {!isAuthenticated ? <Navigate to="/auth/login" /> :
                <>

                </>
            }
        </>
    )
}

export default memo(PrivateLayout)
