/**
 * Created by jcabresos on 3/13/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import parent = require('../app');
import Header = require('./views/Header');
import models = require('../models');

export interface Kontext extends parent.Kontext {

}

export class App extends kola.App<HTMLElement> {

	header: Header;
	addTodo: signals.SignalDispatcher<models.Todo>;

	onKontext(kontext: Kontext) {
		this.addTodo = <signals.SignalDispatcher<models.Todo>>kontext.getSignal('todo.add');
	}

	onStart(): void {
		this.header = new Header();
		this.header.appendTo(this.startupOptions);
		this.header.newTodo.addEventListener('keydown', this.onKeyDown.bind(this));
	}

	onKeyDown(event: KeyboardEvent): void {
		if(event.keyCode == 13) {
			var desc = this.header.newTodo.value;
			var todo = <models.Todo>this.kontext.getInstance('todo');
			todo.setDescription(desc);

			this.addTodo.dispatch(todo);

			this.header.newTodo.value = null; //clear
		}
	}

	onStop(): void {
		this.header.remove();
	}
}

