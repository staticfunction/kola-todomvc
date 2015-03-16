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

import TodoAppView = require('./views/TodoApp');

export interface Kontext extends kola.Kontext {}

export class TodoApp extends kola.App<HTMLElement> {

	headerApp: header.App;
	footerApp: footer.App;
	mainApp: main.App;

	todoView: TodoAppView;

	onKontext(kontext: Kontext, opts?: HTMLElement): void {
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

		this.headerApp = new header.App(this).start(this.todoView.header);
		this.footerApp = new footer.App(this).start(this.todoView.footer);
		this.mainApp = new main.App(this).start(this.todoView.main);
	}

	onStop(): void {
		this.todoView.remove();
		this.headerApp.stop();
		this.footerApp.stop();
		this.mainApp.stop();
	}
}

var todoApp = new TodoApp().start(window.document.getElementById('todoapp'));
