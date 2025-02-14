import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleLoginMutation } from "../redux/feature/api/authApi";
import { setCredentials } from "../redux/feature/authSlice";
import { message } from "antd";
import { FC, useCallback } from "react";
import { hideLoading, showLoading } from "../redux/feature/defaultSlice";

const GoogleLoginButton: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [googleLogin] = useGoogleLoginMutation();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async ({ access_token }: { access_token: string }) => {
            try {
                dispatch(showLoading())
                const { data, error }: any = await googleLogin(access_token);
                dispatch(hideLoading())
                if (data) {
                    message.success(data.msg);
                    dispatch(setCredentials(data));
                    navigate("/");
                } else {
                    throw new Error(error?.msg || "Google login failed");
                }
            } catch (e: any) {
                dispatch(hideLoading())
                console.log("🚀 ~ onSuccess: ~ e:", e)
                message.error(e?.message);
            }
        },
        onError: () => message.error("Google Login Failed"),
    });

    return (
        <button
            onClick={useCallback(() => handleGoogleLogin(), [handleGoogleLogin])}
            className="btn btn-dark fs-6 fw-bold py-2 px-5 rounded-4 d-flex align-items-center"
        >
            <img
                className="me-2"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png?20230822192911"
                alt="Google Logo"
                width="20"
                height="20"
            />
            <span>Continue with Google</span>
        </button>
    );
};

export default GoogleLoginButton;
