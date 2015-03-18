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

	headerApp: header.App;
	footerApp: footer.App;
	mainApp: main.App;

	todoView: TodoAppView;

	todos: models.Todos;

	onKontext(kontext: Kontext, opts?: HTMLElement): void {

		this.todoView = new TodoAppView();

		kontext.setSignal('init', hooks.executes([commands.initialized, commands.setStateMainAndFooter]));
		kontext.setSignal('todo.add', hooks.executes([commands.addTodo, commands.setStateMainAndFooter]));
		kontext.setSignal('todo.remove', hooks.executes([commands.removeTodo, commands.setStateMainAndFooter]));

		kontext.setSignal('todo.complete')
		kontext.setSignal('todos.clear.completed');

		kontext.setInstance('todos', () => {
			return new models.Todos();
		}).asSingleton();

		kontext.setInstance('todo', () => {
			return new models.Todo();
		})

		kontext.setInstance('view.footer', () => {
			return this.todoView.footer;
		}).asSingleton();

		kontext.setInstance('view.main', () => {
			return this.todoView.main;
		}).asSingleton();

		super.onKontext(kontext, opts);
	}

	onStart(): void {

		this.todoView.appendTo(this.startupOptions);

		this.headerApp = <header.App> new header.App(this).start(this.todoView.header);
		this.footerApp = <footer.App> new footer.App(this).start(this.todoView.footer);
		this.mainApp = <main.App> new main.App(this).start(this.todoView.main);

		this.kontext.getSignal('init').dispatch();
	}


	onStop(): void {
		this.todoView.remove();
		this.headerApp.stop();
		this.footerApp.stop();
		this.mainApp.stop();
	}
}

var todoApp = new TodoApp().start(window.document.getElementById('todoapp'));
