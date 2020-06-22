import React, { useState } from "react";
import { Input, Button } from "reactstrap";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import classes from "./add-todo.module.scss";

export const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text) @client
  }
`;

export const AddTodo: React.FC = () => {
  const [todo, setTodo] = useState("");
  const [createTodo] = useMutation(CREATE_TODO);

  return (
    <form
      className="d-flex mb-2"
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();

        createTodo({
          variables: {
            text: todo,
          },
        });

        setTodo("");
      }}
    >
      <Input
        className={classes.addTodoInput}
        name="todo"
        placeholder="What needs to be done?"
        value={todo}
        onChange={(event) => setTodo(event.target.value)}
      />
      <Button
        disabled={todo.length === 0}
        className={classes.addTodoButton}
        color="primary"
      >
        Add
      </Button>
    </form>
  );
};
