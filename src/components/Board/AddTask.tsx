import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextInput, TextArea } from "../InputField";
import { AppState, IBoard, ITask, IColumn } from "types";
import { appData, addTask, editTask } from "redux/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import { checkDuplicatedTask } from "utilis";
import { v4 as uuidv4 } from "uuid";

interface Props {
  handleClose: () => void;
  tasks?: ITask;
  activeColumn?: IColumn;
}

export default function AddTask({ handleClose, tasks, activeColumn }: Props) {
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const active: IBoard = data.active;
  console.log(data, "datadata");
  const TaskSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    description: Yup.string(),
    status: Yup.string().required("Required"),
  });

  const addTaskHandler = (values: ITask) => {
    const foundDuplicate = checkDuplicatedTask(values, active);
    console.log(values, "valuesvaluesvalues");
    if (!foundDuplicate) {
      console.log(values, "valuesvaluesvalues");
      dispatch(addTask({ updatedTasks: values, position: 0 }));
    } else {
      // toast({
      //   title: "Task already exists.",
      //   position: "top",
      //   status: "error",
      //   duration: 2000,
      //   isClosable: true,
      // });
    }
    handleClose();
  };

  const editTaskHandler = (values: ITask) => {
    dispatch(editTask({ values, tasks }));
    handleClose();
  };

  return (
    <div>
      <h1 className="font-bold text-lg pb-2 px-4">
        {tasks ? "Edit" : "Add New"} Task
      </h1>
      <div className="overflow-y-auto h-[30rem] pl-0 pr-4 md:px-4">
        <Formik
          initialValues={
            tasks
              ? {
                  id: tasks.id,
                  title: tasks.title,
                  description: tasks.description,
                  status: tasks.status,
                }
              : {
                  id: uuidv4(),
                  title: "",
                  description: "",
                  status: activeColumn?.name || "To Do",
                }
          }
          validationSchema={TaskSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values) => {
            tasks ? editTaskHandler(values) : addTaskHandler(values);
          }}
        >
          {() => (
            <Form className="pb-4">
              <div className="mb-6">
                <TextInput
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="E.g Pending design task"
                />
              </div>
              <div className="my-6">
                <TextArea
                  placeholder="E.g The hero page design is not completed"
                  name="description"
                  label="Description"
                />
              </div>

              <div className="relative flex items-center my-6 gap-x-8 justify-between">
                <div className="w-1/2">
                  <TextInput label="Deadline" name="deadline" type="date" />
                </div>
                <div className="w-1/2">
                  <TextInput label="Time" name="time" type="time" />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-bold">Column</label>
                <Field
                  as="select"
                  name="status"
                  className="border-[1px] mt-2 rounded-lg block outline-none py-2 px-4 text-sm w-full"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Needs Review">Needs Review</option>
                  <option value="Future Date">Future Date</option>
                  <option value="Done">Done</option>
                </Field>
              </div>

              <div className="my-8">
                <button
                  aria-label="Create Task"
                  className="text-white bg-primary/70 hover:bg-primary px-2 py-3 w-full font-bold text-sm dark:hover:text-white rounded-full"
                  type="submit"
                >
                  {tasks ? "Update" : "Create"} Task
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
