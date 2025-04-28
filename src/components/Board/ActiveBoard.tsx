import { useState } from "react";
import AddBoard from "./AddBoard";
import AddTask from "./AddTask";
import TaskItem from "./TaskItem";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { addTask, appData, deleteTask } from "redux/boardSlice";
import { v4 as uuidv4 } from "uuid";
import Modal from "components/Modal";
import { AppState, IColumn, ITask } from "types";
import DeleteItem from "components/DeleteItem";

export default function ActiveBoard() {
  const dispatch = useDispatch();
  const [isAddTask, setAddTask] = useState(false);
  const [isEditBoard, setEditBoard] = useState(false);
  const [isDeleteColumn, setDeleteColumn] = useState(false);
  const [selectedColumn] = useState<IColumn>();
  const data: AppState = useSelector(appData);
  console.log(data, "datadatsssa");
  const { active } = data;
  const staticColumns = [
    "To Do",
    "In Progress",
    "Needs Review",
    "Future Date",
    "Done",
  ];

  // GROUP TASKS based on status
  const tasksByStatus: { [key: string]: ITask[] } = {};

  staticColumns.forEach((col) => {
    tasksByStatus[col] = [];
  });

  active.columns?.forEach((column) => {
    column.tasks.forEach((task) => {
      if (tasksByStatus[task.status]) {
        tasksByStatus[task.status].push(task);
      }
    });
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const activeCopy = { ...active };
    const sourceList = activeCopy.columns.find(
      (item: IColumn) => item.name === result.source.droppableId
    );

    const sourceTask = sourceList?.tasks.find(
      (item: ITask, index: number) => index === result.source.index
    );
    dispatch(deleteTask(sourceTask));
    const updatedTasks = {
      ...sourceTask,
      id: uuidv4(),
      status: result.destination.droppableId,
    };
    const position = result.destination.index;
    dispatch(addTask({ updatedTasks, position }));
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="h-[90vh] mb-10">
          <div className="z-10 h-full flex gap-x-10 w-full">
            {staticColumns.map((columnName, index) => (
              <div key={index} className="w-[250px] shrink-0">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-bold uppercase">{columnName}</h2>
                  <span>({tasksByStatus[columnName]?.length || 0})</span>
                </div>

                <Droppable droppableId={columnName}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[400px] bg-gray-100 dark:bg-secondary/20 rounded-lg p-2"
                    >
                      {tasksByStatus[columnName]?.length > 0 ? (
                        tasksByStatus[columnName].map((task, index) => (
                          <TaskItem key={task.id} tasks={task} index={index} />
                        ))
                      ) : (
                        <div className="h-[100px] border-2 border-dashed border-gray-300 rounded-lg"></div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      <Modal
        open={isAddTask || isEditBoard || isDeleteColumn}
        handleClose={() => {
          setAddTask(false), setEditBoard(false);
        }}
      >
        {isEditBoard ? (
          <AddBoard active={active} handleClose={() => setEditBoard(false)} />
        ) : isDeleteColumn ? (
          <DeleteItem
            handleClose={() => setDeleteColumn(false)}
            selectedColumn={selectedColumn}
          />
        ) : (
          <AddTask
            activeColumn={selectedColumn}
            handleClose={() => setAddTask(false)}
          />
        )}
      </Modal>
    </>
  );
}
