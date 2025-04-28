import Modal from "components/Modal";
import { useState } from "react";
import { ITask } from "types";
import AddTask from "./AddTask";
import TaskDetails from "./TaskDetails";
import { Draggable } from "@hello-pangea/dnd";
import { colorSelection } from "utilis";
interface Props {
  tasks: ITask;
  index: number;
}

export default function TaskItem({ tasks,  index }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);

  return (
    <>
      <Draggable key={tasks.id} draggableId={tasks.id.toString()} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${
                snapshot.isDragging
                  ? "!top-auto !left-auto bg-purple/20"
                  : "bg-white dark:bg-secondary"
              } select-none rounded-lg`}
              data-id={index}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <div
                style={{
                  borderColor: colorSelection(),
                }}
                className="shadow-lg hover:bg-gray/20
              cursor-pointer rounded-lg border-l-2 mb-4 py-6 px-4"
              >
                <p className="font-bold text-sm">{tasks.title} </p>
                
              </div>
            </div>
          );
        }}
      </Draggable>
      <Modal open={isOpen} handleClose={() => setIsOpen(false)}>
        <TaskDetails
          tasks={tasks}
          handleClose={() => setIsOpen(false)}
          handleOpenModal={handleOpenModal}
        />
      </Modal>
      <Modal open={isOpenModal} handleClose={() => setOpenModal(false)}>
        <AddTask
          tasks={tasks}
          handleClose={() => setOpenModal(false)}
        />
      </Modal>
    </>
  );
}
