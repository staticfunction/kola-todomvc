/**
 * Created by jcabresos on 3/13/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import parent = require('../app');
import models = require('../models');
import renderer = require('./renderer/app');

import Main = require('./views/Main');

export interface Kontext extends parent.Kontext {

}

export class App extends kola.App<HTMLElement> {

	main: Main;
	todos: models.Todos;
	onTodoAdd: signals.Listener<models.Todo>;
	onTodoRemove: signals.Listener<models.Todo>;

	onStart(): void {
		this.main = new Main();
		this.main.appendTo(this.startupOptions);

		this.todos = <models.Todos>this.kontext.getInstance('todos');

		this.onTodoAdd = this.todos.onAddTodo.listen(this.todoAdded, this);
		this.onTodoRemove = this.todos.onRemoveTodo.listen(this.todoRemoved, this);

	}

	todoAdded(value: models.Todo): void {
		var todoRenderer = new renderer.App(this);
		todoRenderer.start({todo: value, container: this.main.todoList});
	}

	todoRemoved(value: models.Todo): void {
	}


	onStop(): void {

		this.onTodoAdd.unlisten();
		this.onTodoRemove.unlisten();
		this.main.remove();
	}
}

