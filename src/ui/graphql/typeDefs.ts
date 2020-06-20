export const typeDefs = `
  enum Filter {
    ALL
    COMPLETED
    UNCOMPLETED
  }

  type Todo {
    id: String!
    text: String!
    completed: Boolean!
    createdAt: String!
    __typename: String!
  }

  type VisibilityFilter {
    filter: Filter!
  }

  type Query {
    todos(visibilityFilter: Filter = Filter.ALL): [Todo]!
  }

  type Mutation {
    createTodo(text: String!): Todo!
    updateTodo(id: String!, text: String!): Todo!
    removeTodo(id: String!): Todo!
    toggleTodo(id: String!): Todo!
    setVisibilityFilter(visibilityFilter: Filter!): Filter!
  }
`;