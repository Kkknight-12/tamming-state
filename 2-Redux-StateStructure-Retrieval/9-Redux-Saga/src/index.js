import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { createLogger } from 'redux-logger';
import { schema, normalize } from 'normalizr';
import {v4 as uuidv4} from 'uuid'; // npm install --save uuid
// import uuid from 'uuid/v4';
// import { uuid } from 'uuidv4'; // npm install uuidv4

// importing thunk
// import thunk from 'redux-thunk';

// importing Saga
import { put, takeEvery, delay } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

// hooks
import React, { useState, useEffect } from 'react';
//
import './index.css';

/*
after using uuid
{id: "18cc9039-2fcd-4197-9d35-6d9f35bf30b9", name: "Todo with Notifications"}
id is created like this  */
const todos = [
  { id: uuidv4(), name: 'Redux Standalone with advanced Reducers' },
  { id: uuidv4(), name: 'Redux Standalone with advanced Actions' },
  { id: uuidv4(), name: 'Bootstrap App with Redux' },
  { id: uuidv4(), name: 'Naive Todo with React and Redux' },
  { id: uuidv4(), name: 'Sophisticated Todo with React and Redux' },
  { id: uuidv4(), name: 'Connecting State Everywhere' },
  { id: uuidv4(), name: 'Todo with advanced Redux' },
  { id: uuidv4(), name: 'Todo but more Features' },
  { id: uuidv4(), name: 'Todo with Notifications' },
  { id: uuidv4(), name: 'Hacker News with Redux' },
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
    0b2f3219-dc94-4beb-bbeb-b7eb955deb1a: {id: "0b2f3219-dc94-4beb-bbeb-b7eb955deb1a", name: "Sophisticated Todo with React and Redux"}
    0f037f46-caff-4bdc-903b-25201a37a0b5: {id: "0f037f46-caff-4bdc-903b-25201a37a0b5", name: "Redux Standalone with advanced Actions"}
    4a43a825-58bd-409a-a0d7-34d6f9b05e9f: {id: "4a43a825-58bd-409a-a0d7-34d6f9b05e9f", name: "Todo with Notifications"}
    6fd5311f-6103-4302-8388-d002713b5b80: {id: "6fd5311f-6103-4302-8388-d002713b5b80", name: "Redux Standalone with advanced Reducers"}
    7a2c2b10-fac0-42ee-8e79-451f75b60507: {id: "7a2c2b10-fac0-42ee-8e79-451f75b60507", name: "Hacker News with Redux"}
    7cf0dc97-38b2-4865-a8c8-42aae1b6438d: {id: "7cf0dc97-38b2-4865-a8c8-42aae1b6438d", name: "Todo with advanced Redux"}
    86f9f6d1-bc8b-4125-aa62-b6d9eea29779: {id: "86f9f6d1-bc8b-4125-aa62-b6d9eea29779", name: "Todo but more Features"}
    7690cb57-a82c-4d35-a476-03c1d9c52760: {id: "7690cb57-a82c-4d35-a476-03c1d9c52760", name: "Naive Todo with React and Redux"}
    8757c699-9e54-4eb3-ad2b-c814f269a87a: {id: "8757c699-9e54-4eb3-ad2b-c814f269a87a", name: "Connecting State Everywhere"}
    a27bb20a-ce57-4193-a47e-a2d22a481f54: {id: "a27bb20a-ce57-4193-a47e-a2d22a481f54", name: "Bootstrap App with Redux"}
  result:
    0: "6fd5311f-6103-4302-8388-d002713b5b80"
    1: "0f037f46-caff-4bdc-903b-25201a37a0b5"
    2: "a27bb20a-ce57-4193-a47e-a2d22a481f54"
    3: "7690cb57-a82c-4d35-a476-03c1d9c52760"
    4: "0b2f3219-dc94-4beb-bbeb-b7eb955deb1a"
    5: "8757c699-9e54-4eb3-ad2b-c814f269a87a"
    6: "7cf0dc97-38b2-4865-a8c8-42aae1b6438d"
    7: "86f9f6d1-bc8b-4125-aa62-b6d9eea29779"
    8: "4a43a825-58bd-409a-a0d7-34d6f9b05e9f"
    9: "7a2c2b10-fac0-42ee-8e79-451f75b60507"
*/

// ////////////////
// initial State //
// ///////////////
const initialTodoState = {
  entities: normalizedTodos.entities.todo,
  ids: normalizedTodos.result,
};
// console.log(initialTodoState)
// {entities: {…}, ids: Array(10)}

// action types
const TODO_ADD = 'TODO_ADD';
const TODO_TOGGLE = 'TODO_TOGGLE';
const FILTER_SET = 'FILTER_SET';
const NOTIFICATION_HIDE = 'NOTIFICATION_HIDE'
const TODO_ADD_WITH_NOTIFICATION = 'TODO_ADD_WITH_NOTIFICATION'

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
  // console.log(state)
  const entities = { ...state.entities, [todo.id]:todo };
  const ids = [ ...state.ids, action.todo.id ];
  return { ...state, entities, ids };
};

function applyToggleTodo( state, action ){
  // console.log(state)
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

// Notification reducer
function notificationReducer( state = {}, action ){
  switch( action.type ){
    case TODO_ADD :{
      return applySetNotifyAboutAddTodo(state, action);
    }
    case NOTIFICATION_HIDE :{
      return applyRemoveNotification(state, action);
    }
    default : return state;
  }
}

function applySetNotifyAboutAddTodo( state, action ){
  const { name, id } = action.todo;
  return { ...state, [id]: 'Todo Created: ' + name };
}

function applyRemoveNotification( state, action ){
  const {
    [ action.id ]: notificationToRemove, 
    ...restNotifications
  } = state;
  return restNotifications;
}

// store
const rootReducer = combineReducers(
  {
    todoState:todoReducer,
    filterState: filterReducer,
    notificationState: notificationReducer
  }
);

// //////////////////
// action creators //
// //////////////////
function doAddTodo(id, name) {
  // console.log(id)
  return {
    type: TODO_ADD,
    todo: { id, name },
  };
};

function doAddTodoWithNotification( id, name ){
  return {
    type: TODO_ADD_WITH_NOTIFICATION,
    todo: { id, name },
  };
}

// ************************************************
// ///////
// Saga //
// ///////
function* watchAddTodoWithNotification(){
  yield takeEvery(TODO_ADD_WITH_NOTIFICATION, handleAddTodoWithNotification );
}

function* handleAddTodoWithNotification( action ){
  yield (console.log(action))
  const { todo } = action;
  const { id, name } = todo;
  yield put(doAddTodo(id, name));
  yield delay(5000);
  yield put(doHideNotification(id));
}
// ************************************************

function doHideNotification( id ){
  return {
    type: NOTIFICATION_HIDE,
    id
  }
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
const saga = createSagaMiddleware()

const store = createStore(
  rootReducer,
  undefined,
  // applyMiddleware(logger)
  applyMiddleware(saga, logger)
  );
saga.run(watchAddTodoWithNotification);

// /////////////
// components //
// /////////////
function TodoApp() {
  return (
    <div>
      < ConnectedTodoCreate/>
      < ConnectedTodoList />
      < ConnectedFilter />
      < ConnectedNotifications />
    </div>
  );
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
  // {id: "4fdb10ec-c58e-4754-a057-fb4a64668fb5", name: "Redux Standalone with advanced Reducers"}
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

function TodoCreate(  props  ) {
  // console.log(props)
  // {onAddTodo: ƒ}
  const [ value, setValue ] = useState("");

  const onChangeName = function(event){
    // console.log(event.target.value)
    setValue(event.target.value)
  };

  const onCreateTodo = function(event){
    // console.log(value)
    props.onAddTodo(value);
    setValue(" ")
    event.preventDefault();

  };

  return (
    <div>
      <form onSubmit={ (event) => onCreateTodo(event) }>
        <input
          className = "input"
          type="text"
          placeholder= "Add Todo..."
          value = {value}
          onChange = {onChangeName}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

function Filter ( { onSetFilter } ){
  return (
  <div>
    Show
    <button
      type= "button"
      onClick= { () => onSetFilter( 'SHOW_ALL' ) }>
      ALL
    </button>
    <button
      type= "button"
      onClick= { () => onSetFilter( 'SHOW_COMPLETED' ) }>
      Completed
    </button>
    <button
      type= "button"
      onClick= { () => onSetFilter( 'SHOW_INCOMPLETED' ) }>
      Incompleted
    </button>
  </div>
  )
}
// Notification Component
function Notifications( { notifications } ){
  // console.log(notifications.map(note => console.log(note) ));
  return (
    <div>
      { notifications.map(note => <div key={note}> { note } </div> ) }
    </div>
  );
}

// //////////
// Connect //
// //////////

// conecting react and redux
function mapStateToPropsList( state ){
  // console.log(state)
  return{
    // todosAsIds: state.todoState.ids,
    todosAsIds: getTodosAsIds(state)
  }
}

function mapStateToPropsItem( state, props ){
  // console.log(props)
  /*
  {todoIIIId: "8a47c0d7-33b4-43df-b82f-e4460be6c068"}
  {todoIIIId: "7cd6b4dc-1b0d-4124-8196-b807288e17b3"}
  {todoIIIId: "c42bec52-f2c8-4f84-8a98-3ae9f4067003"}
  {todoIIIId: "f3422047-831d-4b8a-9957-3389c2d60e5d"}
  {todoIIIId: "94c8ab18-8aef-46d5-b79a-6ce0fc54d9e4"}
  {todoIIIId: "f1590f8d-ba46-4bdf-8950-5758acbc1cc8"}
  {todoIIIId: "eeb1607b-cc1b-46fb-b610-f626ed33750d"}
  {todoIIIId: "9a54ecdb-68f0-4de9-9eeb-a972b2eb4c29"}
  {todoIIIId: "a4344a37-cfd8-43ee-9958-eb12e7eafa29"}
  {todoIIIId: "5ecd3177-14ba-44de-abf4-86db06d948d8"}
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
  };
}

function mapDispatchToPropsCreate( dispatch ){
  return {
    // onAddTodo: name => dispatch( doAddTodo( uuidv4(), name )),
    // example of uuid id
    // {id: "18cc9039-2fcd-4197-9d35-6d9f35bf30b9", name: "Todo with Notifications"}
    onAddTodo: name => dispatch( doAddTodoWithNotification( uuidv4(), name )),
  };
}

function mapDispatchToPropsFilter( dispatch ){
  return {
    onSetFilter: filterType => dispatch( doSetFilter( filterType )),
  };
}

function mapStateToPropsNotifications( state, props ){
  return{
    notifications: getNotifications(state),
  };
};

function getNotifications(state){
  return getArrayOfObjects(state.notificationState)
  
}

function getArrayOfObjects(object){
  // console.log(object)
  // Object.keys( object ).map( key => console.log(key) );
  return Object.keys( object ).map( key => object[key] );
}

// filter
const VISIBILITY_FILTERS = {
  SHOW_COMPLETED: item => item.completed,
  SHOW_INCOMPLETED: function( item ){ return !item.completed },
  SHOW_ALL: ( item ) => { return true },
}

// ///////////
// selector //
// ///////////
function getTodosAsIds(state) {
  // console.log(state.todoState)
  return state.todoState.ids
    .map( id => state.todoState.entities[id] )
    .filter( VISIBILITY_FILTERS[ state.filterState ])
     // SHOW_INCOMPLETED | SHOW_COMPLETED | SHOW_ALL
    .map( todo => todo.id );
}

function getTodo(state, todoId){
  return state.todoState.entities[todoId]
}

// ///////////
// Connects //
// ///////////
const ConnectedTodoList = connect( mapStateToPropsList )( TodoList );
const ConnectedTodoItem = connect( mapStateToPropsItem, mapDispatchToPropsItem )( TodoItem );
const ConnectedTodoCreate = connect( null, mapDispatchToPropsCreate )( TodoCreate );

const ConnectedFilter = connect( null, mapDispatchToPropsFilter )( Filter );

// notification
const ConnectedNotifications = connect( mapStateToPropsNotifications )( Notifications );

// Render to Dom
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TodoApp/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
