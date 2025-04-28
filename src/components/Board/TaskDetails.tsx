import { AppState, IBoard, IColumn, ITask } from "types";
import { FiMoreVertical } from "react-icons/fi";
import SelectBox from "../SelectBox";
import { useState } from "react";
import Popup from "components/Popup";
import DeleteItem from "components/DeleteItem";
import {  useSelector } from "react-redux";
import { appData } from "redux/boardSlice";

interface Props {
  tasks: ITask;
  handleClose: () => void;
  handleOpenModal: () => void;
}

export default function TaskDetails({
  tasks,
  handleClose,
  handleOpenModal,
}: Props) {
  const data: AppState = useSelector(appData);
  const active: IBoard = data.active;

  const [selectedColumn, setSelectedColumn] = useState<string | any>(
    tasks
      ? active.columns.find((item: IColumn) =>
          item.tasks.find((o) => o == tasks)
        )?.name
      : active.columns.find((item: IColumn) =>
          item.tasks.find((o, index) => index === 0)
        )?.name
  );
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isDeleteTask, setDeleteTask] = useState(false);
 
  const handleOpenMenu = () => setOpenMenu(false);
 

  const editTaskHandler = () => {
    handleOpenModal();
    handleClose();
  };

  return (
    <>
      {!isDeleteTask ? (
        <>
          <div className="text-lg font-bold flex items-center justify-between">
            <p className=""> {tasks.title}</p>{" "}
            <div className="relative">
              <button className="text-3xl hover:text-primary">
                <FiMoreVertical onClick={() => setOpenMenu(!isOpenMenu)} />
              </button>
              {isOpenMenu && (
                <Popup
                style={{}}
                  items={[
                    {
                      title: "Edit Task",
                      handler: editTaskHandler,
                    },
                    {
                      title: "Delete Task",
                      handler: () => {
                        setDeleteTask(true);
                      },
                    },
                  ]}
                  handleOpenMenu={handleOpenMenu}
                />
              )}
            </div>
          </div>
        
          <div className="mt-6 pb-6">
            <p className="text-sm font-bold mb-1">Column</p>
            <SelectBox
              selectedColumn={selectedColumn}
              handleClose={handleClose}
              setSelectedColumn={setSelectedColumn}
              tasks={tasks}
            />
          </div>
        </>
      ) : (
        <DeleteItem
          handleClose={() => {
            setDeleteTask(false), handleClose();
          }}
          tasks={tasks}
          name={tasks.title}
        />
      )}
    </>
  );
}
