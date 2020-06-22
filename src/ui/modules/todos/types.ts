export enum Filter {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
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
  visibilityFilter: Filter;
};
