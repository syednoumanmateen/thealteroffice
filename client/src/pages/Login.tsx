import GoogleLoginButton from "../components/GoogleLoginButton";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "../redux/feature/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import helper from "../config/helper";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/feature/authSlice";

// Define form data structure
interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>(); // Type-safe form
  const navigate = useNavigate(); // Navigation
  const [loginUser, { isLoading }] = useLoginMutation(); // API call state tracking
  const dispatch = useDispatch(); // Redux Dispatch

  const appName = import.meta.env.VITE_APP_NAME ?? "Application"; // Fallback if undefined

  const onFinish: SubmitHandler<LoginFormInputs> = async (input) => {
    try {
      const { data, error }: any = await loginUser(input);

      if (data) {
        message.success(data?.msg);
        dispatch(setCredentials(data));
        navigate("/"); // Redirecting to dashboard instead of login
      } else {
        message.error(error?.data?.msg);
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <>
      <form className="mb-5" onSubmit={handleSubmit(onFinish, helper.errorHandle)}>
        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label">Email <span className="text-danger">*</span></label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="form-control"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label className="form-label">Password <span className="text-danger">*</span></label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="form-control"
            placeholder="Enter your password"
          />
        </div>

        {/* Register Link */}
        <div className="mb-3" style={{ fontSize: "14px" }}>
          <span className="text-secondary">New to {appName}? </span>
          <Link className="text-decoration-none" to="/auth/register">Register</Link>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      {/* Google Login Button */}
      <div className="d-flex justify-content-center">
        <GoogleLoginButton />
      </div>
    </>
  );
};

export default Login;
