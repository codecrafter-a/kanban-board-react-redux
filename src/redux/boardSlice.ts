import { createSlice } from "@reduxjs/toolkit";
import { IBoard, IColumn } from "types";
import { loadState } from "utilis";
import type { RootState } from "./store";
import { v4 as uuidv4 } from "uuid";
const loadedBoard = loadState();

const boardSlice = createSlice({
  name: "boarddata",
  initialState: {
    board: loadedBoard.board,
    active: loadedBoard.active,
    profile: loadedBoard.profile,
  },
  reducers: {
    activeItem: (state, action) => {
      return {
        ...state,
        active: state.board.find(
          (item: IBoard) => item.id === action.payload.id
        ),
      };
    },
    deleteBoard: (state, action) => {
      const filteredBoard: IBoard[] = state.board.filter(
        (item: IBoard) => item.id !== action.payload.id
      );
      return {
        ...state,
        board: filteredBoard,
        active: filteredBoard.find(
          (item: IBoard, index: number) => index === 0
        ),
      };
    },
    addWorkspace: (state, action) => {
      return {
        ...state,
        profile: action.payload,
      };
    },
    addBoard: (state, action) => {
      state.board.push(action.payload);
      state.active = state.board.find(
        (item: IBoard) => item.id === action.payload.id
      );
      state.profile;
    },
    editBoard: (state, action) => {
      const updatedBoard: IBoard[] = state.board.map((item: IBoard) =>
        item.id === state.active.id ? { ...item, ...action.payload } : item
      );
      return {
        ...state,
        board: updatedBoard,
        active: updatedBoard.find(
          (item: IBoard) => item.id === action.payload.id
        ),
      };
    },
    addTask: (state, action) => {
      const boardIndex = state.board.findIndex((item: any) => item.id === state.active.id);
      if (boardIndex === -1) return;
    
      const board = state.board[boardIndex];
    
      let columnIndex = board.columns.findIndex((col: any) => col.name === action.payload.updatedTasks.status);
    
      // 🛠 If column not found, create the column dynamically
      if (columnIndex === -1) {
        const newColumn = {
          id: uuidv4(),
          name: action.payload.updatedTasks.status,
          tasks: [],
        };
        board.columns.push(newColumn);
        columnIndex = board.columns.length - 1; // Set columnIndex to the newly created column
      }
    
      // Add task at specified position
      const position = action.payload.position || 0;
      board.columns[columnIndex].tasks.splice(position, 0, action.payload.updatedTasks);
    
      state.active = { ...board };
      state.board[boardIndex] = board;
    },
    editColumnName: (state, action) => {
      state.board.find((ele: IBoard) =>
        ele.id === state.active.id
          ? ele.columns.find((o: IColumn) =>
              o.id === action.payload.selectedColumn.id
                ? (o.name = action.payload.editedText)
                : null
            )
          : null
      );
      state.active = state.board.find(
        (item: IBoard) => item.id === state.active.id
      );
    },
    deleteColumn: (state, action) => {
      state.board.find((ele: IBoard) =>
        ele.id === state.active.id
          ? ele.columns.find((o: IColumn) =>
              o.id === action.payload.id
                ? (ele.columns = ele.columns.filter(
                    (s) => s.id !== action.payload.id
                  ))
                : null
            )
          : null
      );
      state.active = state.board.find(
        (item: IBoard) => item.id === state.active.id
      );
    },

    deleteTask: (state, action) => {
      state.board.find((item: IBoard) =>
        item.name === state.active.name
          ? item.columns.find((o: IColumn) =>
              o.name === action.payload.status
                ? (o.tasks = o.tasks.filter(
                    (s: any) => s.id !== action.payload.id
                  ))
                : null
            )
          : null
      );
      state.active = state.board.find(
        (item: IBoard) => item.id === state.active.id
      );
    },
    editTask: (state, action) => {
      const boardIndex = state.board.findIndex((item: any) => item.id === state.active.id);
      if (boardIndex === -1) return;
    
      const board = state.board[boardIndex]; // Safe reference
    
      const column = board.columns.find((col:any) => col.name === action.payload.values.status);
      if (!column) return;
    
      const taskIndex = column.tasks.findIndex((task:any) => task.id === action.payload.tasks.id);
      if (taskIndex !== -1) {
        column.tasks[taskIndex] = action.payload.values;
      }
      state.active = board;
    },

  },
});

export const {
  activeItem,
  deleteBoard,
  editBoard,
  addBoard,
  editTask,
  addTask,
  deleteTask,
  addWorkspace,
  deleteColumn,
  editColumnName,
} = boardSlice.actions;
export const appData = (state: RootState) => state.boarddata;
export default boardSlice.reducer;


