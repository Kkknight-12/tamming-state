import React from 'react';
import ReactDOM from 'react-dom';
// import { normalize, schema } from 'normalizr';
import { combineReducers, createStore} from 'redux';
import { Provider, connect } from 'react-redux';
import { denormalize, schema } from 'normalizr';


import './index.css';

const todos = [
  {
    id:0,
    name: 'learn redux',
  },
  {
    id:1,
    name: 'learn mobx',
  }
]

// Defining schema for entity
// we are naming assignedTo as the name of key value in output 
// const idSchema = new schema.Entity('ids');

// const normalizedData = normalize( todos, [ idSchema ] );
// console.log(normalizedData)
/* 
entities:
  ids:
    0: {id: 0, name: "learn redux"}
    1: {id: 1, name: "learn mobx"}
result: (2) [0, 1]
*/

const todoSchema = new schema.Entity('todos');

const todosSchema = { todos: [todoSchema] };
// console.log( todosSchema )
// {todos: Array(1)}
// todos: [EntitySchema]

function TodoList( { todos }){
  return (
    <div>
      {
        todos.map( todo =>
        < ConnectedTodoItem
            key={todo.id}
            todo={todo} />
        )
      }
    </div>
  )
}

function getTodos( state ){
  console.log(state)
  const entities = state.todoState.entities;
  const ids = state.todoState.ids;
  return denormalize( ids, [todosSchema], entities)
}

function mapStateToProps( state ){
  return {
    todos: getTodos( state )
  }
}

// function mapDispatchToProps( dispatch ){
//   return {
//     onToggleTodo: id => dispatch( doToggleTodo(id)),
//   };
// }

const ConnectedTodoItem = connect (
  mapStateToProps,
  // mapDispatchToProps
)(TodoList);

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <h1>hi</h1>
  </React.StrictMode>,
  document.getElementById('root')
);