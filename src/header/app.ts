/**
 * Created by jcabresos on 3/13/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import parent = require('../app');
import Header = require('./views/Header');

export interface Kontext extends parent.Kontext {

}

export class App extends kola.App<HTMLElement> {

	header: Header;

	onStart(): void {
		this.header = new Header();
		this.header.appendTo(this.startupOptions);
	}

	onStop(): void {
		this.header.remove();
	}
}

