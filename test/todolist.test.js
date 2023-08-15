/*
Setup -> handled by `beforeEach` method which is passed a callback
         function that is invoked before each test. 
Execute -> more nuanced? the first test `list.size()` is an example
Assert  -> `expect().toBe()`
Teardown -> (no example here)
*/

const Todo = require('../lib/todo');
const TodoList = require('../lib/todolist');

describe('TodoList', () => {
  let todo1;
  let todo2;
  let todo3;
  let list;

  beforeEach(() => {
    todo1 = new Todo('Buy milk');
    todo2 = new Todo('Clean room');
    todo3 = new Todo('Go to the gym');

    list = new TodoList("Today's Todos");
    list.add(todo1);
    list.add(todo2);
    list.add(todo3);
  });

  // your tests go here (within the describe callback!)
  test('todolist has a size of 3', () => {
    expect(list.size()).toBe(3);
  });
  
  test('calling toArray returns a new array object identical to list.todo',
    () => {
      expect(list.toArray()).toEqual([todo1, todo2, todo3]);
  });
  
  test('calling first returns the first todo item', () => {
    expect(list.first()).toBe(todo1); // would toEqual() return true if objects had same content but differnent objects?
  });
  
  test('calling last returns the last todo item', () => {
    expect(list.last()).toBe(todo3); // not sure about LS use of toEqual here...
  });
  
  test('calling shift returns the first todo item and removes it from todos list', () => {
    expect(list.shift()).toEqual(todo1);
    expect(list.toArray()).toEqual([todo2, todo3]);
  });
  
  test('calling pop returns the last todo item and removes it from todos list', () => {
    expect(list.pop()).toBe(todo3);
    expect(list.toArray()).toEqual([todo1, todo2]);
  });
  
  test('calling isDone returns `true` if all todo items are marked done, false otherwise.', () => {
    expect(list.isDone()).toBe(false);
  });
  
  test('calling add and passing a non-todo object returns a TypeError', () => {
    // !!! need help understanding this part!
    // Note that we've wrapped the list.add() invocation in a function. Otherwise, calling list.add() directly will raise an exception before toThrow gets an opportunity to detect it.
    expect( () => list.add('string') ).toThrow(TypeError); 
    expect( () => list.add(1) ).toThrow(TypeError);
    expect( () => list.add( new TodoList('test list') ) ).toThrow(TypeError);
  });
  
  test('calling itemAt returns todo from valid index argument. Invalid index argument returns ReferenceError', 
  () => {
    expect( () => list.itemAt('one') ).toThrow(ReferenceError);
    expect(list.itemAt(1)).toEqual(todo2);
  });
  
  test('calling markDoneAt takes an index value as an argument and invokes markDone on the todo object', 
  () => {
    expect( () => list.markDoneAt(6) ).toThrow(ReferenceError);// code doesn't exist in codebase to throw this error
    
    list.markDoneAt(0)
    
    expect(todo1.isDone()).toBe(true);  
    expect(todo2.isDone()).toBe(false); 
    expect(todo3.isDone()).toBe(false);
  });
  
  test('calling markUndoneAt takes an index value as an argument and invokes markUndone on the todo object',
  () => {
    expect( () => list.markUndoneAt(6) ).toThrow(ReferenceError);
    
    list.markDoneAt(0);
    list.markDoneAt(1);
    list.markDoneAt(2);

    list.markUndoneAt(0);
    
    expect(todo1.isDone()).toBe(false);
    expect(todo2.isDone()).toBe(true);
    expect(todo3.isDone()).toBe(true);
  });
  
  test('calling markAllDone iterates over all todo objects and invokes makeDone on them',
  () => {
    list.markAllDone();
    // check each todo individually
    expect(todo1.isDone()).toBe(true);
    expect(todo2.isDone()).toBe(true);
    expect(todo3.isDone()).toBe(true);
    
    // check entire list returns true for isDone
    expect(list.isDone()).toBe(true);
  });
  
  test('calling removeAt removes and returns a todo at a valid index. Raises ReferenceError for invalid index argument.',
  () => {
    expect( () => list.removeAt(6) ).toThrow(ReferenceError);
    expect(list.removeAt(1)).toEqual([todo2]);
    expect(list.toArray()).toEqual([todo1, todo3]);
  });
  
  test('toString returns string representation of the list', () => {
    let string = `---- Today's Todos ----
[ ] Buy milk
[ ] Clean room
[ ] Go to the gym`;
  
      expect(list.toString()).toBe(string);
    });
    
  test('toString returns a different string for one todo', () => {
    let string = `---- Today's Todos ----
[X] Buy milk
[ ] Clean room
[ ] Go to the gym`;
    todo1.markDone();
    
    expect(list.toString()).toBe(string);
  });
  
  test('toString returns a different string when all todo items are done', () => {
    let string = `---- Today's Todos ----
[X] Buy milk
[X] Clean room
[X] Go to the gym`;
    
    list.markAllDone();
    expect(list.toString()).toBe(string);
  });
  
  test('forEach iterates over all todo items in list', () => {
    let result = [];
    list.forEach(todo => result.push(todo));
    
    expect(result).toEqual([todo1, todo2, todo3]);
  });
  
  // kinda suprised by the way LS implemented the tests for filter...
  test('filter returns a new list object with only todos that pass test implemented by callback', () => {
    todo1.markDone();
    let newList = new TodoList(list.title);
    newList.add(todo1);
  
    expect(newList.title).toBe(list.title);
  
    let doneItems = list.filter(todo => todo.isDone());
    expect(doneItems.toString()).toBe(newList.toString());
  });
    
  test('findByTitle returns the first todo object with a given title', () => {
    expect(list.findByTitle('Go to the gym')).toEqual(todo3);
  });
  
  test('_validateIndex tests if the index passed as an argument is a valid index for todo list and returns ReferenceError if not', () => {
    expect( () => list._validateIndex(6) ).toThrow(ReferenceError);
  });
  
  test('allDone returns a new list containing only todo objects marked done', () => {
    list.markDoneAt(0);
    list.markDoneAt(2);
    let result = list.allDone();
    
    expect(result.toArray()).toEqual([todo1, todo3]);
  });
  
  test('allNotDone returns a new list containing only todo objects marked undone', () => {

    list.markDoneAt(1);
    let result = list.allNotDone();
    
    expect(result.toArray()).toEqual([todo1, todo3]);
  });
});