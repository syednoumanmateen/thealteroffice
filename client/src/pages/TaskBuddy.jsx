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
import dayjs from 'dayjs'

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchAllTask = async () => {
    try {
      const { data } = await getAllTasks({
        search: searchQuery,
        dueDate: selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "",
        category: selectedCategory,
      });

      if (data) {
        // message.success(data?.msg);
        setItems(data?.tasks)
        setSearchQuery("")
        setSelectedDate(null)
        setSelectedCategory("")
      } else {
        // message.error(error?.data?.msg);
      }
    } catch (err) {
      message.error(err.message);
    }
  }

  const handleDelete = async (_id) => {
    try {
      dispatch(showLoading())
      const { data, error } = await deleteTask(_id);
      dispatch(hideLoading());
      if (data) {
        message.success(data?.msg);
        fetchAllTask()
      } else {
        message.error(error?.data?.msg);
      }
    } catch (e) {
      dispatch(hideLoading());
      message.error(e.message);
    }
  }

  const handleEdit = async (id, updateData) => {
    try {
      dispatch(showLoading())
      const { data, error } = await updateTaskById({ id, updateData });
      dispatch(hideLoading());
      if (data) {
        message.success(data?.msg);
        fetchAllTask()
      } else {
        message.error(error?.data?.msg);
      }
    } catch (e) {
      dispatch(hideLoading());
      message.error(e.message);
    }
  }


  const handleCreate = async (input) => {
    try {
      dispatch(showLoading())
      const { data, error } = await createTask(input);
      dispatch(hideLoading());
      if (data) {
        message.success(data?.msg);
        reset({})
        fetchAllTask()
      } else {
        message.error(error?.data?.msg);
      }
    } catch (e) {
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
        <div className={`d-flex justify-content-end mb-3`}>
          <Button type="button" theme="theme" onClick={() => setIsModalOpen(true)}>+ Add Task</Button>
        </div>

        <div className="row align-items-center mb-3">
          {/* Filters Section */}
          <div className="col-md-8 d-flex align-items-center gap-2">
            <span className="fw-bold">Filter:</span>

            {/* Status Dropdown */}
            <Dropdown
              menu={{
                items: [
                  { key: "Work", label: "Work" },
                  { key: "Personal", label: "Personal" }
                ],
                onClick: ({ key }) => setSelectedCategory(key) // Set selected category
              }}
              placement="bottom"
              arrow
            >
              <button className="btn btn-outline-theme rounded-5">
                {selectedCategory ? selectedCategory : "Category"} {/* Display selected value */}
              </button>
            </Dropdown>


            {/* Due Date Picker */}
            <DatePicker
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(date) => setSelectedDate(date?.toISOString() || null)}
              className="btn btn-outline-theme rounded-5"
              format="DD-MM-YYYY"
              placeholder="Select due date"
            />
            {isMobile && <div className="col-md-1 p-0">
              <Button type="button" theme="theme" onClick={() => fetchAllTask()}>Filter</Button>
            </div>}
          </div>

          {/* Search Bar */}
          <div className={`col-md-3 ${isMobile ? "mt-3" : "ms-auto"}`}>
            <input
              type="text"
              className="form-control btn-outline-theme rounded-5"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {!isMobile && <div className="col-md-1 p-0">
            <Button type="button" theme="theme" onClick={() => fetchAllTask()}>Filter</Button>
          </div>}
        </div>

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
      </div >
    </>
  )
}

export default TaskBuddy

