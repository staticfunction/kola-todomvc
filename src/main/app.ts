/**
 * Created by jcabresos on 3/13/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import parent = require('../app');
import models = require('../models');

import Main = require('./views/Main');
import Todo = require('./views/Todo');

export interface Kontext extends parent.Kontext {

}

export class App extends kola.App<HTMLElement> {

	main: Main;
	todos: models.Todos;
	onTodoAdd: signals.SignalListener<models.Todo>;
	onTodoRemove: signals.SignalListener<models.Todo>;

	onStart(): void {
		this.main = new Main();
		this.main.appendTo(this.startupOptions);

		this.todos = <models.Todos>this.kontext.getInstance('todos');

		this.onTodoAdd = new signals.SignalListener(this.todoAdded, this);
		this.todos.onAddTodo.addListener(this.onTodoAdd);

		this.onTodoRemove = new signals.SignalListener(this.todoRemoved, this);
		this.todos.onRemoveTodo.addListener(this.onTodoRemove);


	}

	todoAdded(value: models.Todo): void {
		var todo = new Todo();
		todo.description.textContent = value.getDescription();
		todo.edit.value = value.getDescription();
		todo.completed.checked = value.getCompleted();
		todo.appendTo(this.main.todoList);
	}

	todoRemoved(value: models.Todo): void {

	}


	onStop(): void {
		this.main.remove();
	}
}

