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

	onStart(): void {
		this.main = new Main();
		this.main.appendTo(this.startupOptions);

	}

	onStop(): void {
		this.main.remove();
	}
}

