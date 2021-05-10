import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { normalize, schema } from 'normalizr';

// const todos = [
//   {
//     id:0,
//     name: 'create redux',
//     competed: true,
//     assignedTo: {
//       id: '99',
//       name: 'Dan Abramov and Andrew Clark'
//     },
//   },
//   {
//     id:1,
//     name: 'create mobx',
//     competed: true,
//     assignedTo: {
//       id: '77',
//       name: 'Michel Weststrate'
//     },
//   }
// ]

const todos = [
  {
    id: '0',
    name: 'write a book',
    completed: true,
    assignedTo: {
      id: '55',
      name: 'Robin Wieruch',
      class: 'First'
    },
  },
  {
    id: '1',
    name: 'call it taming the state in react',
  completed: true,
    assignedTo: {
      id: '55',
      name: 'Robin Wieruch',
    },
  }
];

// Defining schema for entity
// we are naming assignedTo as the name of key value in output 
const assignedToSchema = new schema.Entity('assignedTo');
// console.log(assignedToSchema)
/* 
EntitySchema {_key: "assignedTo", _idAttribute: "id", _getId: ƒ, _mergeStrategy: ƒ, _processStrategy: ƒ, …}
*/

const todoSchema = new schema.Entity( 'todo', {
  assignedTo: assignedToSchema
});
// console.log(todoSchema)
/* 
EntitySchema {_key: "todo", _idAttribute: "id", _getId: ƒ, _mergeStrategy: ƒ, _processStrategy: ƒ, …}
*/

const normalizedData = normalize( todos, [ todoSchema ] );
console.log(normalizedData.entities)
console.log(normalizedData.entities.todo)

/* 
entities:
  assignedTo:
    77: {id: "77", name: "Michel Weststrate"}
    99: {id: "99", name: "Dan Abramov and Andrew Clark"}
  todo:
    0: {id: 0, name: "create redux", competed: true, assignedTo: "99"}
    1: {id: 1, name: "create mobx", competed: true, assignedTo: "77"}
*/

ReactDOM.render(
  <React.StrictMode>
    <h1>hi</h1>
  </React.StrictMode>,
  document.getElementById('root')
);