import { DatePicker, Dropdown, message } from "antd";
import dayjs from "dayjs";
import { DragEvent, FC, memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useScreenSize from "../../hooks/useScreenSize";
import { listData } from "../../pages/TaskBuddy";
import Accordian from "../inputs/Accordian";
import Button from "../inputs/Button";
import Model from "../Model";
import DropDownFromList from "./DropDownFromList";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { useDeleteMultipleTasksMutation, useUpdateMultipleTasksMutation } from "../../redux/feature/api/taskApi";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/feature/defaultSlice";
import { useDispatch } from "react-redux";

interface AccordianItemType {
  key: string;
  label: string;
  isOpen: boolean;
}

const TaskListView: FC<listData> = ({ items, setItems, handleEdit, handleDelete, handleCreate }) => {
  const isMobile = useScreenSize();
  const navigate = useNavigate();

  const dispatch = useDispatch()

  const [openFormAdd, setOpenFormAdd] = useState(false);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState({ value: false, key: 0 });
  const [selectedIds, setSelectedIds] = useState<any>([])
  const [statusChange, setStatusChange] = useState("To Do");

  const { register, handleSubmit, control } = useForm();

  const [updateMultipleTasks] = useUpdateMultipleTasksMutation()
  const [deleteMultipleTasks] = useDeleteMultipleTasksMutation()

  const [accordianItem, setAccordianItem] = useState<AccordianItemType[]>([
    { key: "todo", label: "To Do", isOpen: true },
    { key: "inprogress", label: "In Progress", isOpen: true },
    { key: "completed", label: "Completed", isOpen: true },
  ]);

  // accordian open&close
  const handleToggle = (key: string) => {
    setAccordianItem((prev: any) =>
      prev.map((acc: any) =>
        acc.key === key ? { ...acc, isOpen: !acc.isOpen } : acc
      )
    );
  };

  // drag and drop logic
  const handleDragStart = (task: any) => setDraggedTask(task);
  const handleDragOver = (e: DragEvent<HTMLTableRowElement>) => e.preventDefault();

  const handleDrop = (newStatus: string) => {
    if (!draggedTask) return;

    const updatedItems = items.map((task) =>
      task._id === draggedTask._id ? { ...task, status: newStatus } : task
    );
    items.forEach((task) =>
      task._id === draggedTask._id ? handleEdit(draggedTask._id, { status: newStatus }) : null
    )
    setItems(updatedItems);
    setDraggedTask(null);
  };
  // drag and drop logic

  const handleSelect = (id: string) => {
    setSelectedIds((prev: any) =>
      prev.includes(id) ? prev.filter((i: any) => i !== id) : [...prev, id]
    );
  };

  const handleMultipleEdit = async () => {
    try {
      dispatch(showLoading());
      const { data } = await updateMultipleTasks({ taskIds: selectedIds, status: statusChange });
      message.success(data?.msg);
      dispatch(hideLoading());
      navigate("/");
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error?.data?.msg || "An error occurred");
    }
  };

  const handleMultipleDelete = async () => {
    try {
      dispatch(showLoading());
      const { data } = await deleteMultipleTasks(selectedIds);
      message.success(data?.msg);
      dispatch(hideLoading());
      navigate("/");
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error?.data?.msg || "An error occurred");
    }
  };

  return (
    <>
      {/* table headers start */}
      {!isMobile && (
        <table className="table">
          <thead className="table-white">
            <tr>
              <th className="col-4">Task Name</th>
              <th className="col-2">Due Date</th>
              <th className="col-3">Status</th>
              <th>Category</th>
            </tr>
          </thead>
        </table>
      )}
      {/* table headers end */}

      {/* accordian start */}
      {accordianItem.map((status) => {
        const filteredTasks = items.filter((task) => task.status === status.label);

        return (
          <div className="mb-3" key={status.key}>
            <Accordian data={status} handleToggle={handleToggle}>
              <>
                {!isMobile && status.label === "To Do" && (
                  <div
                    className="ps-5 py-2"
                    onClick={() => setOpenFormAdd(true)}
                  >
                    + Add Task
                  </div>
                )}

                {/* add task in list start  */}
                {openFormAdd && !isMobile && status.label === "To Do" && (
                  <form onSubmit={handleSubmit(handleCreate)}>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="text"
                              {...register("name", { required: "Name required" })}
                              className="form-control"
                              placeholder="Task name"
                            />
                          </td>
                          <td>
                            <Controller
                              name="dueDate"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  value={field.value ? dayjs(field.value) : null} // Convert stored value to Dayjs
                                  onChange={(date) => field.onChange(date ? date : null)} // Convert Dayjs to ISO
                                  className="form-control"
                                  format="DD-MM-YYYY" // AntD format
                                  placeholder="Select a due date"
                                />
                              )}
                            />
                          </td>
                          <td>
                            <select {...register("status")} className="form-control">
                              <option value="">Select Status</option>
                              <option value="To Do">To Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td>
                            <select {...register("category")} className="form-control">
                              <option value="">Select Category</option>
                              <option value="Work">Work</option>
                              <option value="Personal">Personal</option>
                            </select>
                          </td>
                          <td>
                            <Button type="submit" className="me-2" theme="theme">Submit</Button>
                            <Button type="button" onClick={() => setOpenFormAdd(false)}>
                              Cancel
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </form>
                )}
                {/* add task in list end  */}

                {/* 🔹 Empty Drop Area when no tasks are present */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(status.label)}
                  className={`border border-dashed text-center ${filteredTasks.length === 0 ? "bg-light text-muted" : ""
                    }`}
                  style={{ minHeight: "50px" }} // Ensures there's a space to drop tasks
                >
                  {filteredTasks.length === 0 && <p>Drop tasks here</p>}

                  {filteredTasks.length > 0 && (
                    <table className="table table-hover bg-table">
                      <tbody>
                        {filteredTasks.map((task) => (
                          <tr
                            key={task._id}
                            draggable
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(status.label)}
                            onDragStart={() => handleDragStart(task)}
                            className="align-middle"
                          >
                            <td className="col-4">
                              <div className="d-flex align-items-center">
                                <input type="checkbox" onChange={() => handleSelect(task._id)} className="me-2" />
                                <span className="mx-2">: :</span>
                                <span className={task.status === "Completed" ? "text-decoration-line-through" : ""}>
                                  {task.name}
                                </span>
                              </div>
                            </td>
                            {!isMobile && (
                              <>
                                <td className="col-2 text-start">{task.dueDate ? dayjs(task.dueDate).format("DD-MM-YYYY") : "No date"}</td>
                                <td className="col-3">
                                  <select
                                    value={task.status}
                                    onChange={(e: any) => handleEdit(task._id, { status: e.target.value })}
                                    className="form-control"
                                  >
                                    <option value="">Select Status</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </td>
                                <td className="col-2">{task.category}</td>
                              </>
                            )}
                            <td className="col-1">
                              <DropDownFromList _id={task._id} data={task} handleEdit={() => setIsModalOpen({ value: true, key: task._id })} handleDelete={handleDelete} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            </Accordian>
          </div>
        );
      })}
      {/* accordian end */}

      {!isMobile && <Model title="Edit a" width={1250} isMobile={isMobile} isModalOpen={isModalOpen?.value} setIsModalOpen={setIsModalOpen} input={{ id: "edit", key: isModalOpen.key }} />}

      {isMobile && <Model title="Edit a" isMobile={isMobile} isModalOpen={isModalOpen?.value} setIsModalOpen={setIsModalOpen} input={{ id: "edit", key: isModalOpen.key }} />}

      {/* select update || delete start */}
      {selectedIds && selectedIds?.length > 0 && <>
        <div className="position-relative">
          <div className="position-fixed bottom-0 start-50 translate-middle-x card bg-dark" style={{ width: `${isMobile ? "80vw" : "40vw"}` }}>
            <div className="card-body text-danger">
              <div className="row g-0">
                <div className="col-6 col-sm-8 text-light">
                  <span className="badge me-3">{selectedIds.length} tasks selected</span>
                  <span onClick={handleMultipleEdit}><RiCheckboxMultipleLine /></span>
                </div>
                <div className="col-6 col-sm-4">
                  <Dropdown
                    menu={{
                      items: accordianItem.map(({ key, label }) => ({
                        key,
                        label: <span onClick={() => setStatusChange(label)}>{label}</span>,
                      })),
                    }}
                    placement="bottom"
                    arrow
                  >
                    <button className="btn btn-sm btn-outline-light rounded-5">Status</button>
                  </Dropdown>

                  <button className="btn btn-sm btn-outline-danger rounded-5 ms-2" onClick={handleMultipleDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>}
      {/* select update || delete end */}
    </>
  );
};

export default memo(TaskListView);
