export enum Filter {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  UNCOMPLETED = 'UNCOMPLETED',
}

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  __typename: string;
};

export type Todos = {
  todos: Todo[];
};

export type VisibilityFilter = {
  filter: Filter;
};
