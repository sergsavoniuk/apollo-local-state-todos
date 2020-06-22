import React, { useMemo } from "react";
import { ListGroup } from "reactstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  Todo,
  VisibilityFilter as VisibilityFilterType,
  Filter,
} from "ui/modules/todos/types";
import {} from "ui/modules/todos/types";
import { TodoItem } from "ui/modules/todos/components/todo-item";
import { VisibilityFilterView as VisibilityFilter } from "ui/modules/todos/components/visibility-filter";

import classes from "./todo-list.module.scss";

export const TODO_FRAGMENT = gql`
  fragment TodoItem on Todo {
    id
    text
    completed
    createdAt
  }
`;

export const GET_TODOS = gql`
  query GetTodos {
    todos @client {
      ...TodoItem
    }
  }
  ${TODO_FRAGMENT}
`;

export const GET_VISIBILITY_FILTER = gql`
  query GetVisibilityFilter {
    visibilityFilter @client
  }
`;

export const SET_VISIBILITY_FILTER = gql`
  mutation SetVisibilityFilter($visibilityFilter: Filter) {
    setVisibilityFilter(visibilityFilter: $visibilityFilter) @client
  }
`;

export const TodoList: React.FC = () => {
  const { data } = useQuery<{ todos: Todo[] }>(GET_TODOS);
  const { data: filter } = useQuery<VisibilityFilterType>(
    GET_VISIBILITY_FILTER
  );
  const [setVisibilityFilter] = useMutation(SET_VISIBILITY_FILTER);

  const todosLeft = useMemo(() => {
    return data?.todos?.reduce((acc, cur) => acc + (cur.completed ? 0 : 1), 0);
  }, [data]);

  if (data?.todos?.length === 0) {
    return <p>Todo List is empty</p>;
  }

  const todos = getTodoItemsByVisibilityFilter(
    data?.todos,
    filter?.visibilityFilter
  );

  return (
    <>
      <ListGroup flush>
        {todos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ListGroup>
      <div className={classes.todoListFooter}>
        <p className={classes.todoListItemsLeft}>{todosLeft} items left</p>
        <VisibilityFilter
          filter={filter}
          setVisibilityFilter={setVisibilityFilter}
        />
      </div>
    </>
  );
};

export const getTodoItemsByVisibilityFilter = (
  todos?: Todo[],
  filter?: Filter
) => {
  if (filter === Filter.ALL) {
    return todos;
  } else if (filter === Filter.COMPLETED) {
    return todos?.filter(({ completed }) => completed);
  } else {
    return todos?.filter(({ completed }) => !completed);
  }
};
