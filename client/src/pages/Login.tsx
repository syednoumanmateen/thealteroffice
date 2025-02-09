import { useForm } from "react-hook-form";
import { useLoginMutation } from "../redux/feature/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/feature/authSlice";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import helper from "../config/helper"

const Login = () => {
  const { register, handleSubmit } = useForm();//react-hhok-form
  const [login] = useLoginMutation();//redux login
  const dispatch = useDispatch();//dispatch object
  const navigate = useNavigate();//navigate object

  const appName = import.meta.env.VITE_APP_NAME ?? 'Application'; // Fallback in case it's undefined

  const onFinish = async (data: any) => {
    const response: any = await login(data);
    if (response?.data) {
      dispatch(setCredentials(response.data));
      navigate("/");
    }
  };

  return (
    <>
      <form className="mb-3" onSubmit={handleSubmit(onFinish, helper.errorHandle)}>
        <div className="mb-3">
          <label className="form-label">Email</label><span style={{ color: "red" }}>*</span>
          <input type="email" {...register("email", { required: "Email required" })} className="form-control" placeholder="please enter email" />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label><span style={{ color: "red" }}>*</span>
          <input type="password" {...register("password", { required: "Password required" })} className="form-control" placeholder="please enter password" />
        </div>

        <div className='mb-3'>
          <span className='text-secondary'>New to {appName}? </span><Link className="text-decoration-none" to="/auth/register">Register</Link>
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </form>
      <GoogleLoginButton />
    </>
  );
};

export default Login;
