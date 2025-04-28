export interface IBoard {
  id: string;
  name: string;
  columns: IColumn[];
}

export interface IColumn {
  name: string;
  id: string;
  tasks: ITask[];
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
}


export interface IProfile {
  id: string;
  name: string;
  email: string;
}

type AppState = {
  board: IBoard[];
  active: IBoard;
  profile: IProfile;
};
