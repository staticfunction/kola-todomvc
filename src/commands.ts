/**
 * Created by jcabresos on 3/16/15.
 */
import models = require('./models');
import app = require('./app');

export function initialized(payload: any, kontext:app.Kontext): void {

}

export function addTodo(payload: models.Todo, kontext: app.Kontext): void {
	var todos = <models.Todos>kontext.getInstance('todos');
	todos.addTodo(payload);
}

export function setStateMainAndFooter(payload: any, kontext: app.Kontext): void {
	var footer = <HTMLElement>kontext.getInstance('view.footer');
	var main = <HTMLElement>kontext.getInstance('view.main');
	var todos = <models.Todos>kontext.getInstance('todos');

	var state = todos.size() > 0 ? 'hasTodos' : 'noTodos';

	footer.className = main.className = state;
}


