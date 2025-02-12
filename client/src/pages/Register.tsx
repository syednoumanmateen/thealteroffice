import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../redux/feature/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import helper from "../config/helper";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/feature/defaultSlice";

// Define form data structure
interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit } = useForm<RegisterFormInputs>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "" },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser] = useRegisterMutation();
  const appName = import.meta.env.VITE_APP_NAME ?? "Application";

  // Form Submission Handler
  const onFinish = useCallback(
    async (input: RegisterFormInputs) => {
      try {
        dispatch(showLoading()); // Show loading
        const { data, error }: any = await registerUser(input);
        dispatch(hideLoading()); // Hide loading

        if (data) {
          message.success(data.msg);
          navigate("/login");
        } else {
          message.error(error?.data?.msg || "Registration failed");
        }
      } catch (e: any) {
        console.log("🚀 ~ e:", e)
        dispatch(hideLoading());
        message.error(e?.message || "An unexpected error occurred");
      }
    },
    [registerUser, navigate, dispatch]
  );

  return (
    <>
      <fieldset className="mb-5">
        <form onSubmit={handleSubmit(onFinish, helper.errorHandle)}>
          {/* Name Input */}
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className="form-control"
              placeholder="Enter your name"
              aria-label="Full Name"
            />
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email <span className="text-danger">*</span>
            </label>
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
            <label className="form-label" htmlFor="password">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              className="form-control"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>

          {/* Login Link */}
          <div className="mb-3" style={{ fontSize: "14px" }}>
            <span className="text-secondary">Already registered on {appName}? </span>
            <Link className="text-decoration-none" to="/auth/login">
              Login
            </Link>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
      </fieldset>
    </>
  );
};

export default Register;
