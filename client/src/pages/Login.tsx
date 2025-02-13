import { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "../redux/feature/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import helper from "../config/helper";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/feature/authSlice";
import { hideLoading, showLoading } from "../redux/feature/defaultSlice";
import GoogleLoginButton from "../components/GoogleLoginButton";

// Define form data structure
interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>({
    mode: "onBlur", 
    defaultValues: { email: "", password: "" },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();
  const appName = import.meta.env.VITE_APP_NAME ?? "Application";

  // Form Submission Handler
  const onFinish: SubmitHandler<LoginFormInputs> = useCallback(async (input) => {
    try {
      dispatch(showLoading());
      const { data, error }: any = await loginUser(input);
      dispatch(hideLoading());

      if (data) {
        message.success(data.msg);
        dispatch(setCredentials(data));
        navigate("/");
      } else {
        message.error(error?.data?.msg || "Invalid credentials");
      }
    } catch (e: any) {
      console.log("🚀 ~ login~ e:", e)
      dispatch(hideLoading());
      message.error(e?.message || "An unexpected error occurred");
    }
  }, [dispatch, loginUser, navigate]);

  return (
    <>
      <fieldset disabled={isLoading} className="mb-5">
        <form onSubmit={handleSubmit(onFinish, helper.errorHandle)}>
          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email <span className="text-danger">*</span></label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              className="form-control"
              placeholder="Enter your email"
              aria-label="Email Address"
            />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password <span className="text-danger">*</span></label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              className="form-control"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>

          {/* Register Link */}
          <div className="mb-3" style={{ fontSize: "14px" }}>
            <span className="text-secondary">New to {appName}? </span>
            <Link className="text-decoration-none" to="/auth/register">Register</Link>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </fieldset>

      {/* Google Login Button */}
      <div className="d-flex justify-content-center">
        <GoogleLoginButton />
      </div>
    </>
  );
};

export default Login;
