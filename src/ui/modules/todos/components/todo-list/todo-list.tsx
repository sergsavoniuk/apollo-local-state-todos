import React from 'react';
import { ListGroup } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Todo } from 'ui/modules/todos/types';
import { TodoItem } from 'ui/modules/todos/components/todo-item';

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

export const TodoList: React.FC = () => {
  const { data } = useQuery<{ todos: Todo[] }>(GET_TODOS);

  if (data?.todos?.length === 0) {
    return <p>Todo List is empty</p>;
  }

  return (
    <ListGroup flush>
      {data?.todos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ListGroup>
  );
};
