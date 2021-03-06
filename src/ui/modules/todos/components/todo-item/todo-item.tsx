import React, { useState } from 'react';
import {
  ListGroupItem,
  Button,
  CustomInput,
  Input,
  InputGroup,
} from 'reactstrap';
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

  const [removeTodo] = useMutation<{}, { id: string }>(REMOVE_TODO);
  const [toggleTodo] = useMutation<{}, { id: string }>(TOGGLE_TODO);
  const [updateTodo] = useMutation<{}, { id: string; text: string }>(
    UPDATE_TODO
  );

  return (
    <ListGroupItem
      className={cn(classes.todoItem, completed && classes.todoItemCompleted)}>
      <CustomInput
        id={id!}
        type='checkbox'
        checked={todo.completed ?? false}
        onChange={() => toggleTodo({ variables: { id } })}
      />
      {editMode ? (
        <InputGroup size='sm'>
          <Input
            autoFocus
            className='ml-3'
            value={input}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setInput(event.target.value)
            }
          />
        </InputGroup>
      ) : (
        <span className={classes.todoText}>{text}</span>
      )}
      <div className='d-flex mr-2'>
        <Button
          aria-label={editMode ? 'save todo' : 'edit todo'}
          color='success'
          className={cn(classes.edit, 'mr-1')}
          onClick={() => {
            if (editMode) {
              updateTodo({ variables: { id, text: input } });
            }
            setEditMode((editMode) => !editMode);
          }}>
          {editMode ? (
            <span>&#128190;</span>
          ) : (
            <span className={classes.editIcon}>&#9999;</span>
          )}
        </Button>
        <Button
          aria-label='remove todo'
          color='danger'
          onClick={() => removeTodo({ variables: { id } })}>
          <span>&#10006;</span>
        </Button>
      </div>
    </ListGroupItem>
  );
};
