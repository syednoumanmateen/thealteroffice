import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import helper from "../../config/helper";
import { useMultipleUploadMutation } from "../../redux/feature/api/uploadApi";
import FileUpload from "../inputs/FileUpload";
import Button from "../inputs/Button";
import useScreenSize from "../../hooks/useScreenSize";
import { useCreateTaskMutation, useFetchTaskByIdMutation, useUpdateTaskByIdMutation } from "../../redux/feature/api/taskApi";
import { message } from "antd";
import { memo, useEffect, useState } from "react";
import { useFetchAllLogsMutation } from "../../redux/feature/api/logsApi";
import dayjs from "dayjs";
import { hideLoading, showLoading } from "../../redux/feature/defaultSlice";
import { useDispatch } from "react-redux";

const TaskForm = ({ closeModal, input }: any) => {
    const { register, handleSubmit, control, reset } = useForm();
    const isMobile = useScreenSize();
    const dispatch = useDispatch()

    const [multipleUpload] = useMultipleUploadMutation();
    const [createTask] = useCreateTaskMutation()
    const [updateTaskById] = useUpdateTaskByIdMutation()
    const [fetchAllLogs] = useFetchAllLogsMutation()
    const [fetchTaskById] = useFetchTaskByIdMutation()

    const [logs, setLogs] = useState([])
    const [task, setTask] = useState<any>(null)
    const [tabActive, setTabActive] = useState(true)

    const onFinish = async (input: any) => {
        try {
            dispatch(showLoading());
            let uploadres: any = {};
            if (input.attachments?.length) {
                const formData = new FormData();
                input?.attachments?.forEach((file: any) => formData.append("images", file));

                uploadres = await multipleUpload(formData);
            }

            const { data } = input.id === "edit" ? await updateTaskById({ id: task?.key, updateData: { ...task, attachments: uploadres?.data?.imageIds } }) : await createTask({ ...input, attachments: uploadres?.data?.imageIds })
            dispatch(hideLoading());
            if (data) {
                message.success(data?.msg)
                reset({})
                closeModal(false)
            } else {
                message.error("Creation failed");
            }
        } catch (e) {
            dispatch(hideLoading());
            console.error("Failed to create task", e);
        }
    };

    const fetchAllLogData = async (id: string) => {
        try {
            const { data }: any = await fetchAllLogs(id);

            if (data) {
                // message.success(data?.msg);
                setLogs(data?.logs)
            } else {
                // message.error(error?.data?.msg);
            }
        } catch (e: any) {
            message.error(e.message);
        }
    }

    const fetchTaskData = async () => {
        try {
            const { data }: any = await fetchTaskById(input.key);

            if (data) {
                // message.success(data?.msg);
                reset({
                    name: data.task.name,
                    description: data.task.description,
                    category: data.task.category,
                    dueDate: data.task.dueDate ? dayjs(data.task.dueDate) : null,
                    status: data.task.status
                });
                setTask(data.task)
                fetchAllLogData(data.task._id)
            } else {
                // message.error(error?.data?.msg);
            }
        } catch (err: any) {
            message.error(err.message);
        }
    }

    useEffect(() => {
        if (input.id === "edit") {
            fetchTaskData()
        }
    }, [])

    const form = (<form className="row p-3" onSubmit={handleSubmit(onFinish, helper.errorHandle)}>
        {/* Name Field */}
        <div className="col-12 mb-3">
            <label className="form-label fw-bold">Name <span className="text-danger">*</span></label>
            <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="form-control"
                placeholder="Enter task name"
            />
        </div>

        {/* Description Field */}
        <div className="col-12 mb-3">
            <label className="form-label fw-bold">Description</label>
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <ReactQuill {...field} theme="snow" className="bg-white rounded border" />
                )}
            />
        </div>

        {/* Category Selection */}
        <div className="col-md-4 col-12 mb-3">
            <label className="form-label fw-bold">Category <span className="text-danger">*</span></label>
            <select {...register("category")} className="form-control">
                <option value="">Select Category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
            </select>
            {/* <div className="d-flex gap-3">

        <input
            type="radio"
            {...register("category")}
            value="Work"
            className="btn-check"
            id="Work"
        />
        <label className="btn btn-outline-theme rounded-5" htmlFor="Work">
            Work
        </label>

        <input
            type="radio"
            {...register("category")}
            value="Personal"
            className="btn-check"
            id="Personal"
        />
        <label className="btn btn-outline-theme rounded-5" htmlFor="Personal">
            Personal
        </label>
    </div> */}
        </div>

        {/* Due Date Picker */}
        <div className="col-md-4 col-12 mb-3">
            <label className="form-label fw-bold">Due Date <span className="text-danger">*</span></label><br />
            <Controller
                name="dueDate"
                control={control}
                rules={{ required: "Due date is required" }}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date ? date : null)}
                        className="form-control"
                        dateFormat="dd-MM-yyyy" // Correct format
                        placeholderText="Select a due date"
                    />
                )}
            />
        </div>

        {/* Priority Selection */}
        <div className="col-md-4 col-12 mb-3">
            <label className="form-label fw-bold">Status</label>
            <select {...register("status")} className="form-select">
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        </div>

        {/* File Upload */}
        <div className="col-12 mb-4">
            <label className="form-label fw-bold">Attachments</label>
            <FileUpload control={control} name="attachments" />
        </div>

        {/* Form Buttons */}
        <div className={`d-flex justify-content-end ${isMobile ? "position-fixed start-0 bottom-0  bg-white shadow py-1" : ""}`}>
            <Button type="button" onClick={() => closeModal(false)} className="me-2 btn-outline-secondary">
                Cancel
            </Button>
            <Button type="submit" theme="theme" className="btn-primary">{input.id === "edit" ? "Update" : "Create"}</Button>
        </div>
    </form>)

    const activityLogs = (<div className={`card shadow-sm bg-card rounded overflow-auto`} style={{ height: "60vh" }}>
        <div className="card-header bg-white">Activity Logs</div>
        <div className="card-body">
            {logs && logs.length > 0 && logs?.map((log: any) => (
                <div className="mb-3" key={log._id}>
                    <span className="">{log.message}</span>
                    <span className="float-end">{dayjs(log.time).format("DD-MM-YYYY")}</span>
                </div>
            ))}
            {logs && logs.length <= 0 && <p className="text-center text-muted">No tasks available</p>}
        </div>
    </div>)

    return (
        <div className="row g-0">
            <div className="col-12 mb-3">
                {isMobile && input.id === "edit" && <div className="d-flex ">
                    <Button className="w-50 me-1" type="button" theme={tabActive ? "dark" : ""} onClick={() => setTabActive(true)}>Details</Button>
                    <Button className="w-50 ms-1" type="button" theme={!tabActive ? "dark" : ""} onClick={() => setTabActive(false)}>Activity</Button>
                </div>}
            </div>
            {
                isMobile ? <>
                    {tabActive && <div className={`col-12`}>
                        {form}
                    </div>}
                    {!tabActive && <div className={`col-12`}>
                        {activityLogs}
                    </div>}
                </> : <>
                    <div className={`${(input.id === "edit") ? "col-7" : "col-12"}`}>
                        {form}
                    </div>
                    {input.id === "edit" && <div className="col-5">
                        {activityLogs}
                    </div>}
                </>
            }

        </div>
    );
};

export default memo(TaskForm);
