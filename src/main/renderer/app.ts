/**
 * Created by jcabresos on 3/17/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import Todo = require('./views/Todo');

import models = require('../../models');

export interface Kontext extends kola.Kontext {}

export class App extends kola.App<{todo: models.Todo; container:HTMLElement}> {

	todo: models.Todo;
	todoRenderer: Todo;
	removeWatcher: signals.Listener<models.Todo>;

	onKontext(kontext: Kontext, opts: {todo: models.Todo; container:HTMLElement}): void {

		this.todoRenderer = new Todo();
		this.todo = opts.todo;

		kontext.setInstance('todo', () => {
			return opts.todo;
		}).asSingleton();

		kontext.setInstance('todo.renderer', () => {
			return this.todoRenderer;
		}).asSingleton();

		super.onKontext(kontext, opts);
	}

	onStart(): void {
		this.todoRenderer.appendTo(this.startupOptions.container);

		this.todoRenderer.completed.checked = this.todo.getCompleted();
		this.todoRenderer.description.textContent = this.todo.getDescription();
		this.todoRenderer.edit.value = this.todo.getDescription();

		this.todoRenderer.destroy.addEventListener('click', this.onDestroy.bind(this));
		this.removeWatcher = this.kontext.getSignal('todo.remove').listen(this.onTodoRemove, this);
	}

	onDestroy(event: MouseEvent): void {
		var signalRemove = this.kontext.getSignal('todo.remove');
		signalRemove.dispatch(this.todo);
	}

	onTodoRemove(todo: models.Todo): void {
		if(this.startupOptions.todo == todo)
			this.stop();
	}

	onStop(): void {
		this.todoRenderer.remove();
		this.removeWatcher.unlisten();
	}
}
