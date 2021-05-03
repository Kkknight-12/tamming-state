import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore} from 'redux';
import { Provider, connect } from 'react-redux';
// import TodoApp from "./app";

/* 
When using redux with react , Provider component should be top 
level component of your appliaction.

Component has one prop as input: redux store that you created 
with createStore();
*/
import './index.css';

// ///////////////
// actions types /
// ///////////////
const TODO_ADD = 'TODO_ADD';
const TODO_TOGGLE = 'TODO_TOGGLE';
const FILTER_SET = 'FILTER_SET';

// //////////
// reducers /
// //////////

// initial state
const todos = [
  { id: 0, name: 'learn redux' },
  { id: 1, name: 'learn mobx' }
];

// reducer 1
function todoReducer( state = todos, action){
  switch(action.type){
    case TODO_ADD: {
      return applyAddTodo( state, action );
    }
    case TODO_TOGGLE: {
      return applyToggleTodo( state, action );
    }
    default: return state;
  }
};

function applyAddTodo( state, action ){
  const todo = Object.assign( {}, action.todo, { completed: false } );

  return state.concat(todo);
};

function applyToggleTodo( state, action ){
  return state.map( (todo) => { 
    return todo.id === action.todo.id 
    ? Object.assign( {}, todo, { completed: !todo.completed })
    : todo
  });
};

// reducer 2
function filterReducer( state = 'SHOW_ALL', action ){
  switch( action.type ){
    case FILTER_SET: {
      return applySetFilter( state, action );
    }
    default: return state;
  }
};

function applySetFilter( state, action ){
  return action.filter;
};

// /////////////////
// action creators /
// /////////////////
function doAddTodo ( id, name ){
  return { 
    type: TODO_ADD,
    todo: { id, name }
  }
};

function doToggleTodo( id ){
  return {
    type: TODO_TOGGLE,
    todo: { id }
  }
};

function doSetFilter( filter ){
  return {
    type: FILTER_SET,
    filter,
  }
};

// store
const rootReducer = combineReducers( {
  todoState: todoReducer,
  filter: filterReducer,
} )

const store = createStore( rootReducer );

// ////////////
// view layer /
// ////////////

// components
function TodoApp(){
  console.log("TodoApp")
  // ConnectedTodoList will trigger TodoList function
  // but with reducer in it.
  // If you return function TodoList you won't be passing reducer, try and see.
  return <ConnectedTodoList/>
}

// sending reducer to the component it is needed
function TodoList( { todos } ){
  console.log("TodoList")
  console.log(todos)
  /* 
  [ {id: 0, name: "learn redux"}, {id: 1, name: "learn mobx"} ]
  */
  return (
    <div>
      {/* 
        here we are passing another connect component ConnectedTodoItem ( trigger TodoItem function ) which has actions in it, you will be able to extract action when calling TodoItem function  
      */}
      { todos.map( todo => <ConnectedTodoItem key={todo.id} todo={todo}/> ) }
    </div>
  )
}

// now when TodoItem is triggered by Connect component ConnectedTodoItem
// we will also be getting action onToggleTodo ( which is our doToggleTodo action ) 
// which we are extracting here. 
function TodoItem( { todo, onToggleTodo } ){
  const { name, id, completed } = todo;
  console.log("TodoItem");
  return (
    <div>
      {name}
      <button
        type="button"
        onClick= { () => onToggleTodo( id ) }
        >
          { completed ? "Incomplete": "Complete" }
      </button>
    </div>
  );
}

function mapStateToProps( state ){
  return {
    todos: state.todoState,
  }
}

function mapDispatchToProps( dispatch ){
  return {
    onToggleTodo: id => dispatch(doToggleTodo(id))
  }
}

// ////////////
// Connecting /
// ////////////

// Reducer and Component
// creating connect component variables so that we can directly pass reducer
// and action directly when and where needed.
const ConnectedTodoList = connect( mapStateToProps )( TodoList );

// Action and Component
const ConnectedTodoItem = connect( null, mapDispatchToProps )( TodoItem );

// /////////////
ReactDOM.render(
    <Provider store = {store} >
      <TodoApp/>
    </Provider>,
  document.getElementById('root')
);