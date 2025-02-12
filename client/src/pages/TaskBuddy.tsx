import { useEffect, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { HiViewBoards } from 'react-icons/hi'
import Model from '../components/Model'
import TaskBoardView from '../components/task/TaskBoardView'
import TaskListView from '../components/task/TaskListView'
import useScreenSize from '../hooks/useScreenSize'
import Button from '../components/inputs/Button'
import { useFetchAllTasksMutation, useDeleteTaskMutation, useUpdateTaskByIdMutation, useCreateTaskMutation } from '../redux/feature/api/taskApi'
import { DatePicker, Dropdown, message } from 'antd'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/feature/defaultSlice'

export interface listData {
  items: any[];
  setItems: (data: any) => void;
  handleEdit: (_id: string, data: any) => void;
  handleDelete: (_id: string) => void;
  handleCreate: (data: any) => void
}

const TaskBuddy = () => {
  const [view, setView] = useState("list")
  const isMobile = useScreenSize()

  const dispatch = useDispatch()

  const [getAllTasks] = useFetchAllTasksMutation()
  const [createTask] = useCreateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [updateTaskById] = useUpdateTaskByIdMutation()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { reset } = useForm()
  const [items, setItems] = useState([])

  const fetchAllTask = async () => {
    try {
      const { data, error }: any = await getAllTasks({});

      if (data) {
        message.success(data?.msg);
        setItems(data?.tasks)
      } else {
        message.error(error?.data?.msg);
      }
    } catch (err: any) {
      message.error(err.message);
    }
  }

  const handleDelete = async (_id: string) => {
    try {
      dispatch(showLoading())
      const { data, error }: any = await deleteTask(_id);
      dispatch(hideLoading());
      if (data) {
        message.success(data?.msg);
        fetchAllTask()
      } else {
        message.error(error?.data?.msg);
      }
    } catch (e: any) {
      dispatch(hideLoading());
      message.error(e.message);
    }
  }

  const handleEdit = async (id: string, updateData: any) => {
    try {
      dispatch(showLoading())
      const { data, error }: any = await updateTaskById({ id, updateData });
      dispatch(hideLoading());
      if (data) {
        message.success(data?.msg);
        fetchAllTask()
      } else {
        message.error(error?.data?.msg);
      }
    } catch (e: any) {
      dispatch(hideLoading());
      message.error(e.message);
    }
  }


  const handleCreate = async (input: any) => {
    try {
      dispatch(showLoading())
      const { data, error }: any = await createTask(input);
      dispatch(hideLoading());
      if (data) {
        message.success(data?.msg);
        reset({})
        fetchAllTask()
      } else {
        message.error(error?.data?.msg);
      }
    } catch (e: any) {
      dispatch(hideLoading());
      message.error(e.message);
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      fetchAllTask()
    }
  }, [isModalOpen])

  return (
    <>
      <div className="container">
        <div className={`d-flex justify-content-end ${isMobile ? "mb-3" : ""}`}>
          <Button type="submit" className="" theme="theme" onClick={() => setIsModalOpen(true)}>Add Task</Button>
        </div>
        <div className='row mb-3'>
          <div className="col-6">
            Filter by :
            <Dropdown
              menu={{
                items: [
                  { key: "Work", label: "Work" },
                  { key: "Personal", label: "Personal" }
                ].map(({ key, label }) => ({
                  key,
                  label: <span onClick={() => { }}>{label}</span>,
                })),
              }}
              placement="bottom"
              arrow
            >
              <button className="btn btn-outline-theme rounded-5 me-2">Status</button>
            </Dropdown>
            <DatePicker
              value={null} // Convert stored value to Dayjs
              onChange={() => { }} // Convert Dayjs to ISO
              className="btn btn-outline-theme rounded-5"
              format="DD-MM-YYYY" // AntD format
              placeholder="Select a due date"
            />
          </div>
          <div className="col-6">
            <input
              type="text"
              onChange={() => { }}
              className="btn btn-outline-theme rounded-5"
              placeholder="Search"
            />
          </div>
        </div>
        <>
          {!isMobile && <ul className="nav nav-underline mb-3 bg-white">
            <li className="nav-item">
              <div className={`${view === "list" ? "active" : ""}`} onClick={() => setView("list")}> <GiHamburgerMenu /> List</div>
            </li>
            <li className="nav-item">
              <div className={`${view === "board" ? "active" : ""}`} onClick={() => setView("board")}><HiViewBoards /> Board</div>
            </li>
          </ul>
          }

          {view === "board" && <TaskBoardView items={items} setItems={setItems} handleEdit={handleEdit} handleDelete={handleDelete} handleCreate={handleCreate} />}

          {view === "list" && <TaskListView items={items} setItems={setItems} handleEdit={handleEdit} handleDelete={handleDelete} handleCreate={handleCreate} />}

          {!isMobile && <Model title="Add a new" width={1000} isMobile={isMobile} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} input="" />}

          {isMobile && <Model title="Add a new" isMobile={isMobile} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} input="" />}
        </>
      </div>
    </>
  )
}

export default TaskBuddy

