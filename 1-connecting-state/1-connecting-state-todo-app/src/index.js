import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { combineReducers, createStore} from 'redux';


// ///////////////
// actions types /
// ///////////////
const TODO_ADD = 'TODO_ADD';
const TODO_TOGGLE = 'TODO_TOGGLE';
const FILTER_SET = 'FILTER_SET';

// //////////
// reducers /
// //////////
const todos = [
  { id: 0, name: 'learn redux' },
  { id: 1, name: 'learn mobx' }
];
// 1
function todoReducers( state = todos, action ){
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

// 2
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

// //////////////////
// action creators  /
// //////////////////
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
  todoState: todoReducers,
  filter: filterReducer,
} )

const store = createStore( rootReducer );

// ////////////
// view layer /
// ////////////
function TodoApp( { todos , onToggleTodo } ) {
  console.log(todos);
  // 0: {id: 0, name: "learn redux"}
  // 1: {id: 1, name: "learn mobx"}
  console.log( store.getState() ) // { todoState: Array(2), filter: "SHOW_ALL" }

  return (
    <div className="App">
      <TodoList 
        todos = {todos}
        onToggleTodo = {onToggleTodo} 
      />
    </div>
  );
};

function TodoList( { todos, onToggleTodo } ){
  return (
    <div>
      { todos.map( (todo) => < TodoItem 
          key={ todo.id } 
          todo={ todo } 
          onToggleTodo={ onToggleTodo }
          /> 
      )}
    </div>
  )
}

function TodoItem( { todo, onToggleTodo } ){
  const { name, id, completed } = todo;

  return (
    <div>
      <h4 className="name">
        { name }
      </h4>
      <button
        type="button"
        onClick= { () => onToggleTodo( id ) }
      >
      { completed ? "Incomplete": "Complete" }
      </button>
    </div>
  );
}

// export default TodoApp;
function render(){
  ReactDOM.render(
    <React.StrictMode>
      < TodoApp 
          todos = { store.getState().todoState } 
          onToggleTodo = { id => store.dispatch( doToggleTodo(id) ) }
      />
    </React.StrictMode>,
    document.getElementById('root')
  );
}
store.subscribe(render);
render();