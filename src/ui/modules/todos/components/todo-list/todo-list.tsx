import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Todo } from 'ui/modules/todos/types';

export const GET_TODOS = gql`
  query GetTodos {
    todos @client {
      id
      text
      completed
      createdAt
    }
  }
`;

export const TodoList: React.FC = () => {
  const { data } = useQuery<{ todos: Todo[] }>(GET_TODOS);

  if (data?.todos?.length === 0) {
    return <p>Todo List is empty</p>;
  }

  return (
    <ListGroup>
      {data?.todos?.map((todo) => (
        <ListGroupItem key={todo.id}>{JSON.stringify(todo)}</ListGroupItem>
      ))}
    </ListGroup>
  );
};
