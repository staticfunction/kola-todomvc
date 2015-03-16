/**
 * Created by jcabresos on 3/13/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import parent = require('../app');
import Footer = require('./views/Footer');

export interface Kontext extends parent.Kontext {

}

export class App extends kola.App<HTMLElement> {

	footer: Footer;

	onStart(): void {
		this.footer = new Footer();
		this.footer.appendTo(this.startupOptions);
	}

	onStop(): void {

	}
}

