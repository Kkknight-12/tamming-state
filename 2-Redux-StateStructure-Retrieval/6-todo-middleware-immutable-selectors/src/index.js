import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { createLogger } from 'redux-logger';
import { schema, normalize } from 'normalizr';
import './index.css';

const todos = [
  { id: '1', name: 'Redux Standalone with advanced Actions' },
  { id: '2', name: 'Redux Standalone with advanced Reducers' },
  { id: '3', name: 'Bootstrap App with Redux' },
  { id: '4', name: 'Naive Todo with React and Redux' },
  { id: '5', name: 'Sophisticated Todo with React and Redux' },
  { id: '6', name: 'Connecting State Everywhere' },
  { id: '7', name: 'Todo with advanced Redux' },
  { id: '8', name: 'Todo but more Features' },
  { id: '9', name: 'Todo with Notifications' },
  { id: '10', name: 'Hacker News with Redux' },
];

// //////////
// schemas //
// //////////
const todoSchema = new schema.Entity( 'todo' );

const normalizedTodos = normalize( todos, [todoSchema] );
// console.log(normalizedTodos);
/*  
{entities: {…}, result: Array(10)}
entities:
  todo:
    1: {id: "1", name: "Redux Standalone with advanced Actions"}
    2: {id: "2", name: "Redux Standalone with advanced Reducers"}
    3: {id: "3", name: "Bootstrap App with Redux"}
    4: {id: "4", name: "Naive Todo with React and Redux"}
    5: {id: "5", name: "Sophisticated Todo with React and Redux"}
    6: {id: "6", name: "Connecting State Everywhere"}
    7: {id: "7", name: "Todo with advanced Redux"}
    8: {id: "8", name: "Todo but more Features"}
    9: {id: "9", name: "Todo with Notifications"}
    10: {id: "10", name: "Hacker News with Redux"}
result: (10) ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
*/

const initialTodoState = {
  entities: normalizedTodos.entities.todo,
  ids: normalizedTodos.result,
};

// action types
const TODO_ADD = 'TODO_ADD';
const TODO_TOGGLE = 'TODO_TOGGLE';
const FILTER_SET = 'FILTER_SET';

// //////////
// reducer //
// //////////
function todoReducer(state = initialTodoState, action) {
  switch(action.type) {
    case TODO_ADD : {
      return applyAddTodo(state, action);
    }
    case TODO_TOGGLE : {
      return applyToggleTodo(state, action);
    }
    default : return state;
  }
}

function applyAddTodo( state, action ){
  const todo = { ...action.todo, completed: false };
  const entities = { ...state.entities, [todo.id]:todo };
  const ids = [ ...state.ids, action.todo.id ];
  return { ...state, entities, ids };
};

function applyToggleTodo( state, action ){
  console.log(state)
  /* 
  entities:
    1: {id: "1", name: "Redux Standalone with advanced Actions"}
    2: {id: "2", name: "Redux Standalone with advanced Reducers"}
    3: {id: "3", name: "Bootstrap App with Redux"}
    4: {id: "4", name: "Naive Todo with React and Redux"}
    5: {id: "5", name: "Sophisticated Todo with React and Redux"}
    6: {id: "6", name: "Connecting State Everywhere"}
    7: {id: "7", name: "Todo with advanced Redux"}
    8: {id: "8", name: "Todo but more Features"}
    9: {id: "9", name: "Todo with Notifications"}
    10: {id: "10", name: "Hacker News with Redux"}
  ids: (10) ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  */
  // console.log(action)
  /* 
    todo: {id: "1"}
    type: "TODO_TOGGLE"
  */
  const id = action.todo.id;
  // console.log(id) // 1
  const todo = state.entities[id];
  // console.log(todo) // {id: "1", name: "Redux Standalone with advanced Actions"}
  const toggoledTodo = { ...todo, completed: !todo.completed };
  // console.log(toggoledTodo) // {id: "1", name: "Redux Standalone with advanced Actions", completed: true}
  const entities = { ...state.entities, [id]: toggoledTodo }; // id number where you want to write completed/incompleted
    return { ...state, entities };
};

function filterReducer(state = 'SHOW_ALL', action) {
  switch(action.type) {
    case FILTER_SET : {
      return applySetFilter(state, action);
    }
    default : return state;
  }
}

function applySetFilter(state, action) {
  return action.filter;
}

const rootReducer = combineReducers( 
  { 
    todoState:todoReducer,
    filterState: filterReducer,
    }
);

// //////////////////
// action creators //
// //////////////////
function doAddTodo(id, name) {
  return {
    type: TODO_ADD,
    todo: { id, name },
  };
}

function doToggleTodo(id) {
  return {
    type: TODO_TOGGLE,
    todo: { id },
  };
}

function doSetFilter(filter) {
  return {
    type: FILTER_SET,
    filter,
  };
}

// ////////
// store //
// ////////

const logger = createLogger();

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(logger)
  );
  
// /////////////
// components //
// /////////////
function TodoApp() {
  return <ConnectedTodoList />;
}

function TodoList({ todosAsIds }) {
  // console.log(todosAsIds)
  //  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  return (
    <div className="container" >
      {todosAsIds.map(todoId => <ConnectedTodoItem
        key={todoId}
        // sending in ids -> 1, 2, 3 ......
        todoIIIId={todoId}
      />)}
    </div>
  );
}

function TodoItem( { todo, onToggleTodo } ) {
  // console.log(todo)
  /* 
    {id: "1", name: "Redux Standalone with advanced Actions"}
    {id: "2", name: "Redux Standalone with advanced Reducers"}
    {id: "3", name: "Bootstrap App with Redux"}
    {id: "4", name: "Naive Todo with React and Redux"}
    {id: "5", name: "Sophisticated Todo with React and Redux"}
    {id: "6", name: "Connecting State Everywhere"}
    {id: "7", name: "Todo with advanced Redux"}
    {id: "8", name: "Todo but more Features"}
    {id: "9", name: "Todo with Notifications"}
    {id: "10", name: "Hacker News with Redux"} 
  */
  const { name, id, completed } = todo;
  return (
    <div className={ completed ? "row line" : "row"} >
      {name }
      <button
        className="btn"
        type="button"
        onClick={() => onToggleTodo(id)}
      >
        {completed ? "Incomplete" : "Complete"}
    </button>
    </div>
  );
}

// //////////
// Connect //
// //////////

// conecting react and redux
function mapStateToPropsList( state ){
  // console.log(state.todoState)
  return{
    // todosAsIds: state.todoState.ids,
    todosAsIds: getTodosAsIds(state)
  }
}

function mapStateToPropsItem( state, props ){
  // console.log(state)
  /*  
  {todoState: {…}, filterState: "SHOW_ALL"}
  filterState: "SHOW_ALL"
  todoState:
    entities:
      1: {id: "1", name: "Redux Standalone with advanced Actions"}
      2: {id: "2", name: "Redux Standalone with advanced Reducers"}
      3: {id: "3", name: "Bootstrap App with Redux"}
      4: {id: "4", name: "Naive Todo with React and Redux"}
      5: {id: "5", name: "Sophisticated Todo with React and Redux"}
      6: {id: "6", name: "Connecting State Everywhere"}
      7: {id: "7", name: "Todo with advanced Redux"}
      8: {id: "8", name: "Todo but more Features"}
      9: {id: "9", name: "Todo with Notifications"}
      10: {id: "10", name: "Hacker News with Redux"}
    ids: (10) ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  */
  // console.log(props)
 /* 
  {todoIIIId: "1"}
  {todoIIIId: "2"}
  {todoIIIId: "3"}
  {todoIIIId: "4"}
  {todoIIIId: "5"}
  {todoIIIId: "6"}
  {todoIIIId: "7"}
  {todoIIIId: "8"}
  {todoIIIId: "9"}
  {todoIIIId: "10"}
    
  */
  return {
    // sending 1 id at one itteration
    // todo: state.todoState.entities[props.todoIIIId],
    todo: getTodo(state, props.todoIIIId),
  }
}

function mapDispatchToPropsItem( dispatch ){
  return {
    onToggleTodo: id => dispatch( doToggleTodo(id)),
  }
}

// ///////////
// selector //
// //////////
function getTodosAsIds(state) {
  return state.todoState.ids;
}

function getTodo(state, todoId){
  return state.todoState.entities[todoId]
}

const ConnectedTodoList = connect( mapStateToPropsList )( TodoList );
const ConnectedTodoItem = connect( mapStateToPropsItem, mapDispatchToPropsItem )( TodoItem );

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TodoApp/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);