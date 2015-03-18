/**
 * Created by jcabresos on 3/13/15.
 */
import signals = require('kola-signals');

export class Todo {

	onDescription: signals.Dispatcher<string>;
	onCompleted: signals.Dispatcher<boolean>;

	private description: string;
	private completed: boolean;

	constructor() {
		this.onDescription = new signals.Dispatcher();
		this.onCompleted = new signals.Dispatcher();
	}

	setDescription(value: string): void {
		this.description = value;
		this.onDescription.dispatch(value);
	}

	getDescription(): string {
		return this.description;
	}

	setCompleted(value: boolean): void {
		this.completed = value;
		this.onCompleted.dispatch(value);
	}

	getCompleted(): boolean {
		return this.completed;
	}

}


export class Todos {

	onAddTodo: signals.Dispatcher<Todo>;
	onRemoveTodo: signals.Dispatcher<Todo>;

	private todos: Todo[];

	constructor() {
		this.onAddTodo = new signals.Dispatcher();
		this.onRemoveTodo = new signals.Dispatcher();
		this.todos = [];
	}

	addTodo(todo: Todo): void {
		this.todos.push(todo);
		this.onAddTodo.dispatch(todo);
	}

	removeTodo(todo: Todo): void {
		for(var i = 0; i < this.todos.length; i++) {
			if(todo == this.todos[i]) {
				this.todos.splice(i, 1);
				break;
			}
		}

		this.onRemoveTodo.dispatch(todo);
	}

	getCompleted(): Todo[] {
		var todosCompleted = [];

		for(var i = 0; i < this.todos.length; i++) {
			if(this.todos[i].getCompleted())
				todosCompleted.push(this.todos[i]);
		}

		return todosCompleted;
	}

	getAll(): Todo[] {
		return this.todos.splice(0);
	}

	size(): number {
		return this.todos.length;
	}
}
