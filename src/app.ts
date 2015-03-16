/**
 * Created by jcabresos on 3/13/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import models = require('./models');
import main = require('./main/app');
import header = require('./header/app');
import footer = require('./footer/app');
import commands = require('./commands');

import TodoAppView = require('./views/TodoApp');

export interface Kontext extends kola.Kontext {}

export class TodoApp extends kola.App<HTMLElement> {

	headerApp;
	footerApp;
	mainApp;

	todoView: TodoAppView;

	todos: models.Todos;
	todosChanged: signals.SignalListener<models.Todo>;

	onKontext(kontext: Kontext, opts?: HTMLElement): void {

		kontext.setSignal('todo.add', hooks.executes([commands.addTodo]));
		kontext.setSignal('todo.remove')
		kontext.setSignal('todo.complete')
		kontext.setSignal('todos.clear.completed');

		kontext.setInstance('todos', () => {
			return new models.Todos();
		}).asSingleton();

		kontext.setInstance('todo', () => {
			return new models.Todo();
		})

		kontext.setInstance('view', () => {
			return opts;
		}).asSingleton();

		super.onKontext(kontext, opts);
	}

	onStart(): void {
		this.todoView = new TodoAppView();
		this.todoView.appendTo(this.startupOptions);

		this.todos = <models.Todos>this.kontext.getInstance('todos');

		this.headerApp = new header.App(this).start(this.todoView.header);
		this.footerApp = new footer.App(this).start(this.todoView.footer);
		this.mainApp = new main.App(this).start(this.todoView.main);

		this.todosChanged = new signals.SignalListener(this.onTodosChange, this);
		this.todos.onAddTodo.addListener(this.todosChanged);
		this.todos.onRemoveTodo.addListener(this.todosChanged);

		this.onTodosChange();
	}

	onTodosChange(): void {
		if(this.todos.size() > 0) {
			this.todoView.footer.className = this.todoView.main.className = "hasTodos";
		}
		else {
			this.todoView.footer.className = this.todoView.main.className = "noTodos";
		}
	}

	onStop(): void {
		this.todoView.remove();
		this.headerApp.stop();
		this.footerApp.stop();
		this.mainApp.stop();

		this.todos.onAddTodo.removeListener(this.todosChanged);
		this.todos.onRemoveTodo.removeListener(this.todosChanged);
	}
}

var todoApp = new TodoApp().start(window.document.getElementById('todoapp'));
