import React from 'react';
import { ListGroupItem, Button, CustomInput } from 'reactstrap';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import cn from 'classnames';

import { Todo } from 'ui/modules/todos/types';

import classes from './todo-item.module.scss';

export const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id) @client
  }
`;

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: String!) {
    toggleTodo(id: $id) @client
  }
`;

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, text, completed } = todo;

  const [removeTodo] = useMutation(REMOVE_TODO, { variables: { id } });
  const [toggleTodo] = useMutation(TOGGLE_TODO, { variables: { id } });

  return (
    <ListGroupItem
      className={cn(classes.todoItem, completed && classes.todoItemCompleted)}>
      <CustomInput
        id={id!}
        type='checkbox'
        checked={todo.completed ?? false}
        onChange={() => toggleTodo()}
      />
      <div className={classes.todoItemSecondColumn}>
        <span>{text}</span>
        <Button
          aria-label='remove todo'
          color='danger'
          onClick={() => removeTodo()}>
          X
        </Button>
      </div>
    </ListGroupItem>
  );
};
