/**
 * Created by jcabresos on 3/16/15.
 */
import models = require('./models');
import app = require('./app');

export function addTodo(payload: models.Todo, kontext: app.Kontext): void {
	var todos = <models.Todos>kontext.getInstance('todos');
	todos.addTodo(payload);
}
