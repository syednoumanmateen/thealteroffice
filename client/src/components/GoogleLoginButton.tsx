import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleUserInfoMutation } from "../redux/feature/api/authApi";
import { setCredentials } from "../redux/feature/authSlice";

const GoogleLoginButton = () => {
    const dispatch = useDispatch();
    const [googleUserInfo] = useGoogleUserInfoMutation();

    // navigation object
    const navigate = useNavigate()

    const login = useGoogleLogin({
        onSuccess: async (response: any) => {
            const { access_token } = response;
            const { data }: any = await googleUserInfo(access_token);
            dispatch(setCredentials({ user: data?.user, token: data?.token }));
            navigate("/")
        },
        onError: () => console.error("Google Login Failed"),
    });



    return (
        <button onClick={() => login()} className="btn btn-dark fs-6 fw-bold py-2 px-5 rounded-4 d-flex align-items-enter">
            <img className="me-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png?20230822192911" alt="Google Logo" width="20" height="20" />
            <span> Continue with Google</span>
        </button>)
};

export default GoogleLoginButton;
