import { DragEvent, FC, memo, useState } from "react";
import { listData } from "../../pages/TaskBuddy";
import DropDownFromList from "./DropDownFromList";
import dayjs from "dayjs";

const TaskBoardView: FC<listData> = ({ items, setItems, handleEdit, handleDelete, handleCreate }) => {
  const [draggedTask, setDraggedTask] = useState<any>(null);

  const statusCategories = [
    { key: "todo", label: "To Do", bgClass: "bg-todo" },
    { key: "inprogress", label: "In Progress", bgClass: "bg-inprogress" },
    { key: "completed", label: "Completed", bgClass: "bg-completed" },
  ];

  const handleDragStart = (task: any) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: string) => {
    if (!draggedTask) return;

    const updatedItems = items.map((task) =>
      task._id === draggedTask._id ? { ...task, status: newStatus } : task
    );

    setItems(updatedItems);
    setDraggedTask(null);
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-3">
        {statusCategories.map((status) => {
          const filteredTasks = items.filter((task) => task.status === status.label);
          return (
            <div key={status.key} className="col-md-4 col-sm-12">
              <div
                className={`card shadow-sm bg-card rounded overflow-auto`}
                style={{ height: "60vh" }}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(status.label)}
              >
                <div className={`card-header fw-bold ${status.bgClass} text-white`}>
                  {status.label} ({filteredTasks.length})
                </div>
                <div className="card-body p-3">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <div
                        key={task.key}
                        className="card mb-2 shadow-sm border-0"
                        draggable
                        onDragStart={() => handleDragStart(task)}
                      >
                        <div className="card-body p-2">
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="mb-1">
                              <span className={task.status === "Completed" ? "text-decoration-line-through" : ""}>{task.name}</span>
                            </h6>
                            <DropDownFromList _id={task._id} data={task} handleEdit={handleEdit} handleDelete={handleDelete} />
                          </div>
                          <div className="d-flex">
                            {
                              [1, 2].map((itm: number) => (
                                <div key={itm} className={`text-muted ${itm === 1 ? "" : "ms-auto"}`}><small>{itm === 1 ? task.category : task.dueDate ? dayjs(task.dueDate).format("DD-MM-YYYY") : "No date"} </small></div>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted">No tasks available</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div >
  );
};

export default memo(TaskBoardView);
