import React, { useState } from 'react';
import { ListGroupItem, Button, CustomInput, Input } from 'reactstrap';
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

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $text: String!) {
    updateTodo(id: $id, text: $text) @client
  }
`;

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, text, completed } = todo;

  const [input, setInput] = useState(text);
  const [editMode, setEditMode] = useState(false);

  const [removeTodo] = useMutation(REMOVE_TODO, { variables: { id } });
  const [toggleTodo] = useMutation(TOGGLE_TODO, { variables: { id } });
  const [updateTodo] = useMutation(UPDATE_TODO, {
    variables: { id, text: input },
  });

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
        {editMode ? (
          <Input
            autoFocus
            className='ml-3'
            value={input}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setInput(event.target.value)
            }
          />
        ) : (
          <span className={classes.todoText}>{text}</span>
        )}
        <div className='d-flex'>
          <Button
            aria-label='edit todo'
            color='success'
            className={cn(classes.edit, 'mr-1')}
            onClick={() => {
              if (editMode) {
                updateTodo();
              }
              setEditMode((editMode) => !editMode);
            }}>
            {editMode ? <span>&#128190;</span> : <span>&#9999;</span>}
          </Button>
          <Button
            aria-label='remove todo'
            color='danger'
            onClick={() => removeTodo()}>
            X
          </Button>
        </div>
      </div>
    </ListGroupItem>
  );
};
