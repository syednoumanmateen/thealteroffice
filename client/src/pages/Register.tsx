import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../redux/feature/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import helper from "../config/helper"
import { message } from "antd";

const Register = () => {
  const { register, handleSubmit } = useForm();//react-hhok-form
  const navigate = useNavigate();//navigate object
  const [registerUser] = useRegisterMutation();//redux register

  const appName = import.meta.env.VITE_APP_NAME ?? 'Application'; // Fallback in case it's undefined

  const onFinish = async (input: any) => {
    const { data, error }: any = await registerUser(input);
    if (data) {
      message.success(data.msg)
      navigate("/login");
    } else {
      message.error(error.msg)
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onFinish, helper.errorHandle)}>
        <div className="mb-3">
          <label className="form-label">Name</label><span style={{ color: "red" }}>*</span>
          <input type="text" {...register("name", { required: "Name required" })} className="form-control" placeholder="your name" />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label><span style={{ color: "red" }}>*</span>
          <input type="email" {...register("email", { required: "Email required" })} className="form-control" placeholder="your email" />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label><span style={{ color: "red" }}>*</span>
          <input type="password" {...register("password", { required: "Password required" })} className="form-control" placeholder="your password" />
        </div>

        <div className='mb-3' style={{fontSize:"14px"}}>
          <span className='text-secondary'>Old to {appName}? </span><Link className="text-decoration-none" to="/auth/login">Login</Link>
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
    </>
  );
};

export default Register;
