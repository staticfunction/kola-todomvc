(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by jcabresos on 3/13/15.
 */
var kola = require('kola');
var hooks = require('kola-hooks');
var models = require('./models');
var main = require('./main/app');
var header = require('./header/app');
var footer = require('./footer/app');
var commands = require('./commands');
var TodoAppView = require('./views/TodoApp');
var TodoApp = (function (_super) {
    __extends(TodoApp, _super);
    function TodoApp() {
        _super.apply(this, arguments);
    }
    TodoApp.prototype.onKontext = function (kontext, opts) {
        var _this = this;
        this.todoView = new TodoAppView();
        kontext.setSignal('init', hooks.executes([commands.initialized, commands.setStateMainAndFooter]));
        kontext.setSignal('todo.add', hooks.executes([commands.addTodo, commands.setStateMainAndFooter]));
        kontext.setSignal('todo.remove', hooks.executes([commands.removeTodo, commands.setStateMainAndFooter]));
        kontext.setSignal('todo.complete');
        kontext.setSignal('todos.clear.completed');
        kontext.setInstance('todos', function () {
            return new models.Todos();
        }).asSingleton();
        kontext.setInstance('todo', function () {
            return new models.Todo();
        });
        kontext.setInstance('view.footer', function () {
            return _this.todoView.footer;
        }).asSingleton();
        kontext.setInstance('view.main', function () {
            return _this.todoView.main;
        }).asSingleton();
        _super.prototype.onKontext.call(this, kontext, opts);
    };
    TodoApp.prototype.onStart = function () {
        this.todoView.appendTo(this.startupOptions);
        this.headerApp = new header.App(this).start(this.todoView.header);
        this.footerApp = new footer.App(this).start(this.todoView.footer);
        this.mainApp = new main.App(this).start(this.todoView.main);
        this.kontext.getSignal('init').dispatch();
    };
    TodoApp.prototype.onStop = function () {
        this.todoView.remove();
        this.headerApp.stop();
        this.footerApp.stop();
        this.mainApp.stop();
    };
    return TodoApp;
})(kola.App);
exports.TodoApp = TodoApp;
var todoApp = new TodoApp().start(window.document.getElementById('todoapp'));

},{"./commands":2,"./footer/app":3,"./header/app":5,"./main/app":7,"./models":11,"./views/TodoApp":12,"kola":15,"kola-hooks":13}],2:[function(require,module,exports){
function initialized(payload, kontext) {
}
exports.initialized = initialized;
function addTodo(payload, kontext) {
    var todos = kontext.getInstance('todos');
    todos.addTodo(payload);
}
exports.addTodo = addTodo;
function removeTodo(payload, kontext) {
    var todos = kontext.getInstance('todos');
    todos.removeTodo(payload);
}
exports.removeTodo = removeTodo;
function completeTodo(payload, kontext) {
    payload.setCompleted(true);
}
exports.completeTodo = completeTodo;
function setStateMainAndFooter(payload, kontext) {
    var footer = kontext.getInstance('view.footer');
    var main = kontext.getInstance('view.main');
    var todos = kontext.getInstance('todos');
    var state = todos.size() > 0 ? 'hasTodos' : 'noTodos';
    footer.className = main.className = state;
}
exports.setStateMainAndFooter = setStateMainAndFooter;

},{}],3:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by jcabresos on 3/13/15.
 */
var kola = require('kola');
var Footer = require('./views/Footer');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.onStart = function () {
        this.footer = new Footer();
        this.footer.appendTo(this.startupOptions);
    };
    App.prototype.onStop = function () {
    };
    return App;
})(kola.App);
exports.App = App;

},{"./views/Footer":4,"kola":15}],4:[function(require,module,exports){
var Footer = (function () {
    function Footer() {
        this.rootNodes = [];
        this.todoCount = document.createElement('span');
        this.todoCount.setAttribute('id', 'todo-count');
        var n1 = document.createElement('strong');
        var n2 = document.createTextNode('0');
        var n3 = document.createTextNode(' item left');
        this.filters = document.createElement('ul');
        this.filters.setAttribute('id', 'filters');
        var n5 = document.createElement('li');
        var n6 = document.createElement('a');
        n6.setAttribute('class', 'selected');
        n6.setAttribute('href', '#/');
        var n7 = document.createTextNode('All');
        var n8 = document.createElement('li');
        var n9 = document.createElement('a');
        n9.setAttribute('href', '#/active');
        var n10 = document.createTextNode('Active');
        var n11 = document.createElement('li');
        var n12 = document.createElement('a');
        n12.setAttribute('href', '#/completed');
        var n13 = document.createTextNode('Completed');
        this.clearCompleted = document.createElement('button');
        this.clearCompleted.setAttribute('id', 'clear-completed');
        this.rootNodes.push(this.todoCount);
        this.todoCount.appendChild(n1);
        n1.appendChild(n2);
        this.todoCount.appendChild(n3);
        this.rootNodes.push(this.filters);
        this.filters.appendChild(n5);
        n5.appendChild(n6);
        n6.appendChild(n7);
        this.filters.appendChild(n8);
        n8.appendChild(n9);
        n9.appendChild(n10);
        this.filters.appendChild(n11);
        n11.appendChild(n12);
        n12.appendChild(n13);
        this.rootNodes.push(this.clearCompleted);
    }
    Footer.prototype.appendTo = function (parent) {
        var _this = this;
        this.remove();
        this.parent = parent;
        this.rootNodes.forEach(function (node) {
            _this.parent.appendChild(node);
        });
    };
    Footer.prototype.remove = function () {
        var _this = this;
        if (!this.parent)
            return;
        this.rootNodes.forEach(function (node) {
            _this.parent.removeChild(node);
        });
        this.parent = null;
    };
    return Footer;
})();
module.exports = Footer;

},{}],5:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by jcabresos on 3/13/15.
 */
var kola = require('kola');
var Header = require('./views/Header');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.onKontext = function (kontext) {
        this.addTodo = kontext.getSignal('todo.add');
    };
    App.prototype.onStart = function () {
        this.header = new Header();
        this.header.appendTo(this.startupOptions);
        this.header.newTodo.addEventListener('keydown', this.onKeyDown.bind(this));
    };
    App.prototype.onKeyDown = function (event) {
        if (event.keyCode == 13) {
            var desc = this.header.newTodo.value;
            var todo = this.kontext.getInstance('todo');
            todo.setDescription(desc);
            this.addTodo.dispatch(todo);
            this.header.newTodo.value = null; //clear
        }
    };
    App.prototype.onStop = function () {
        this.header.remove();
    };
    return App;
})(kola.App);
exports.App = App;

},{"./views/Header":6,"kola":15}],6:[function(require,module,exports){
var Header = (function () {
    function Header() {
        this.rootNodes = [];
        var n0 = document.createElement('h1');
        var n1 = document.createTextNode('todos');
        this.newTodo = document.createElement('input');
        this.newTodo.setAttribute('id', 'new-todo');
        this.newTodo.setAttribute('placeholder', 'What needs to be done?');
        this.newTodo.setAttribute('autofocus', '');
        this.rootNodes.push(n0);
        n0.appendChild(n1);
        this.rootNodes.push(this.newTodo);
    }
    Header.prototype.appendTo = function (parent) {
        var _this = this;
        this.remove();
        this.parent = parent;
        this.rootNodes.forEach(function (node) {
            _this.parent.appendChild(node);
        });
    };
    Header.prototype.remove = function () {
        var _this = this;
        if (!this.parent)
            return;
        this.rootNodes.forEach(function (node) {
            _this.parent.removeChild(node);
        });
        this.parent = null;
    };
    return Header;
})();
module.exports = Header;

},{}],7:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by jcabresos on 3/13/15.
 */
var kola = require('kola');
var renderer = require('./renderer/app');
var Main = require('./views/Main');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.onStart = function () {
        this.main = new Main();
        this.main.appendTo(this.startupOptions);
        this.todos = this.kontext.getInstance('todos');
        this.onTodoAdd = this.todos.onAddTodo.listen(this.todoAdded, this);
        this.onTodoRemove = this.todos.onRemoveTodo.listen(this.todoRemoved, this);
    };
    App.prototype.todoAdded = function (value) {
        var todoRenderer = new renderer.App(this);
        todoRenderer.start({ todo: value, container: this.main.todoList });
    };
    App.prototype.todoRemoved = function (value) {
    };
    App.prototype.onStop = function () {
        this.onTodoAdd.unlisten();
        this.onTodoRemove.unlisten();
        this.main.remove();
    };
    return App;
})(kola.App);
exports.App = App;

},{"./renderer/app":8,"./views/Main":10,"kola":15}],8:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by jcabresos on 3/17/15.
 */
var kola = require('kola');
var Todo = require('./views/Todo');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.onKontext = function (kontext, opts) {
        var _this = this;
        this.todoRenderer = new Todo();
        this.todo = opts.todo;
        kontext.setInstance('todo', function () {
            return opts.todo;
        }).asSingleton();
        kontext.setInstance('todo.renderer', function () {
            return _this.todoRenderer;
        }).asSingleton();
        _super.prototype.onKontext.call(this, kontext, opts);
    };
    App.prototype.onStart = function () {
        this.todoRenderer.appendTo(this.startupOptions.container);
        this.todoRenderer.completed.checked = this.todo.getCompleted();
        this.todoRenderer.description.textContent = this.todo.getDescription();
        this.todoRenderer.edit.value = this.todo.getDescription();
        this.todoRenderer.destroy.addEventListener('click', this.onDestroy.bind(this));
        this.removeWatcher = this.kontext.getSignal('todo.remove').listen(this.onTodoRemove, this);
    };
    App.prototype.onDestroy = function (event) {
        var signalRemove = this.kontext.getSignal('todo.remove');
        signalRemove.dispatch(this.todo);
    };
    App.prototype.onTodoRemove = function (todo) {
        if (this.startupOptions.todo == todo)
            this.stop();
    };
    App.prototype.onStop = function () {
        this.todoRenderer.remove();
        this.removeWatcher.unlisten();
    };
    return App;
})(kola.App);
exports.App = App;

},{"./views/Todo":9,"kola":15}],9:[function(require,module,exports){
var Todo = (function () {
    function Todo() {
        this.rootNodes = [];
        this.todo = document.createElement('li');
        var n1 = document.createElement('div');
        n1.setAttribute('class', 'view');
        this.completed = document.createElement('input');
        this.completed.setAttribute('class', 'toggle');
        this.completed.setAttribute('type', 'checkbox');
        this.completed.setAttribute('checked', '');
        this.description = document.createElement('label');
        var n4 = document.createTextNode('Taste JavaScript');
        this.destroy = document.createElement('button');
        this.destroy.setAttribute('class', 'destroy');
        this.edit = document.createElement('input');
        this.edit.setAttribute('class', 'edit');
        this.edit.setAttribute('value', 'Create a TodoMVC template');
        this.rootNodes.push(this.todo);
        this.todo.appendChild(n1);
        n1.appendChild(this.completed);
        n1.appendChild(this.description);
        this.description.appendChild(n4);
        n1.appendChild(this.destroy);
        this.todo.appendChild(this.edit);
    }
    Todo.prototype.appendTo = function (parent) {
        var _this = this;
        this.remove();
        this.parent = parent;
        this.rootNodes.forEach(function (node) {
            _this.parent.appendChild(node);
        });
    };
    Todo.prototype.remove = function () {
        var _this = this;
        if (!this.parent)
            return;
        this.rootNodes.forEach(function (node) {
            _this.parent.removeChild(node);
        });
        this.parent = null;
    };
    return Todo;
})();
module.exports = Todo;

},{}],10:[function(require,module,exports){
var Main = (function () {
    function Main() {
        this.rootNodes = [];
        this.toggleAll = document.createElement('input');
        this.toggleAll.setAttribute('id', 'toggle-all');
        this.toggleAll.setAttribute('type', 'checkbox');
        var n1 = document.createElement('label');
        n1.setAttribute('for', 'toggle-all');
        var n2 = document.createTextNode('Mark all as complete');
        this.todoList = document.createElement('ul');
        this.todoList.setAttribute('id', 'todo-list');
        this.rootNodes.push(this.toggleAll);
        this.rootNodes.push(n1);
        n1.appendChild(n2);
        this.rootNodes.push(this.todoList);
    }
    Main.prototype.appendTo = function (parent) {
        var _this = this;
        this.remove();
        this.parent = parent;
        this.rootNodes.forEach(function (node) {
            _this.parent.appendChild(node);
        });
    };
    Main.prototype.remove = function () {
        var _this = this;
        if (!this.parent)
            return;
        this.rootNodes.forEach(function (node) {
            _this.parent.removeChild(node);
        });
        this.parent = null;
    };
    return Main;
})();
module.exports = Main;

},{}],11:[function(require,module,exports){
/**
 * Created by jcabresos on 3/13/15.
 */
var signals = require('kola-signals');
var Todo = (function () {
    function Todo() {
        this.onDescription = new signals.Dispatcher();
        this.onCompleted = new signals.Dispatcher();
    }
    Todo.prototype.setDescription = function (value) {
        this.description = value;
        this.onDescription.dispatch(value);
    };
    Todo.prototype.getDescription = function () {
        return this.description;
    };
    Todo.prototype.setCompleted = function (value) {
        this.completed = value;
        this.onCompleted.dispatch(value);
    };
    Todo.prototype.getCompleted = function () {
        return this.completed;
    };
    return Todo;
})();
exports.Todo = Todo;
var Todos = (function () {
    function Todos() {
        this.onAddTodo = new signals.Dispatcher();
        this.onRemoveTodo = new signals.Dispatcher();
        this.todos = [];
    }
    Todos.prototype.addTodo = function (todo) {
        this.todos.push(todo);
        this.onAddTodo.dispatch(todo);
    };
    Todos.prototype.removeTodo = function (todo) {
        for (var i = 0; i < this.todos.length; i++) {
            if (todo == this.todos[i]) {
                this.todos.splice(i, 1);
                break;
            }
        }
        this.onRemoveTodo.dispatch(todo);
    };
    Todos.prototype.getCompleted = function () {
        var todosCompleted = [];
        for (var i = 0; i < this.todos.length; i++) {
            if (this.todos[i].getCompleted())
                todosCompleted.push(this.todos[i]);
        }
        return todosCompleted;
    };
    Todos.prototype.getAll = function () {
        return this.todos.splice(0);
    };
    Todos.prototype.size = function () {
        return this.todos.length;
    };
    return Todos;
})();
exports.Todos = Todos;

},{"kola-signals":14}],12:[function(require,module,exports){
var TodoApp = (function () {
    function TodoApp() {
        this.rootNodes = [];
        this.header = document.createElement('header');
        this.header.setAttribute('id', 'header');
        this.main = document.createElement('section');
        this.main.setAttribute('id', 'main');
        this.footer = document.createElement('footer');
        this.footer.setAttribute('id', 'footer');
        this.rootNodes.push(this.header);
        this.rootNodes.push(this.main);
        this.rootNodes.push(this.footer);
    }
    TodoApp.prototype.appendTo = function (parent) {
        var _this = this;
        this.remove();
        this.parent = parent;
        this.rootNodes.forEach(function (node) {
            _this.parent.appendChild(node);
        });
    };
    TodoApp.prototype.remove = function () {
        var _this = this;
        if (!this.parent)
            return;
        this.rootNodes.forEach(function (node) {
            _this.parent.removeChild(node);
        });
        this.parent = null;
    };
    return TodoApp;
})();
module.exports = TodoApp;

},{}],13:[function(require,module,exports){
var ExecutionChainTimeout = (function () {
    function ExecutionChainTimeout(kommand) {
        this.name = "ExecutionChainTimeout";
        this.message = "Execution timeout";
        this.kommand = kommand;
    }
    return ExecutionChainTimeout;
})();
exports.ExecutionChainTimeout = ExecutionChainTimeout;
var ExecutionChain = (function () {
    function ExecutionChain(payload, kontext, options) {
        this.payload = payload;
        this.kontext = kontext;
        this.options = options;
        this.currentIndex = 0;
        this.executed = {};
    }
    ExecutionChain.prototype.now = function () {
        this.next();
        return this;
    };
    ExecutionChain.prototype.onDone = function (index, error) {
        //if this index is equal to currentIndex then call next
        //if not, ignore, but if it has an error, let it call on error
        clearTimeout(this.timeoutId);
        if (error && this.options.errorCommand) {
            this.options.errorCommand(error, this.kontext);
            if (this.options.fragile)
                return;
        }
        this.currentIndex++;
        this.next();
    };
    ExecutionChain.prototype.next = function () {
        var _this = this;
        if (this.executed[this.currentIndex])
            return;
        if (this.currentIndex < this.options.commands.length) {
            var command = this.options.commands[this.currentIndex];
            var done;
            if (command.length > 2) {
                done = function (error) {
                    _this.onDone(_this.currentIndex, error);
                };
                var onTimeout = function () {
                    _this.onDone(_this.currentIndex, new ExecutionChainTimeout(command));
                };
                this.timeoutId = setTimeout(onTimeout, this.options.timeout);
                command(this.payload, this.kontext, done);
            }
            else {
                ;
                command(this.payload, this.kontext);
                this.currentIndex++;
                this.next();
            }
            this.executed[this.currentIndex] = true;
        }
    };
    return ExecutionChain;
})();
exports.ExecutionChain = ExecutionChain;
var ExecutionChainFactory = (function () {
    function ExecutionChainFactory(commandChain) {
        this.timeoutMs = 2000;
        this.commandChain = commandChain;
    }
    ExecutionChainFactory.prototype.breakChainOnError = function (value) {
        this.chainBreaksOnError = value;
        return this;
    };
    ExecutionChainFactory.prototype.onError = function (command) {
        this.onErrorCommand = command;
        return this;
    };
    ExecutionChainFactory.prototype.timeout = function (ms) {
        this.timeoutMs = ms;
        return this;
    };
    ExecutionChainFactory.prototype.execute = function (payload, kontext) {
        return new ExecutionChain(payload, kontext, {
            "commands": this.commandChain,
            "errorCommand": this.onErrorCommand,
            "fragile": this.chainBreaksOnError,
            "timeout": this.timeoutMs
        }).now();
    };
    return ExecutionChainFactory;
})();
exports.ExecutionChainFactory = ExecutionChainFactory;
function executes(kommand) {
    return new ExecutionChainFactory(kommand);
}
exports.executes = executes;

},{}],14:[function(require,module,exports){
/**
 * Created by jcabresos on 2/15/14.
 */
var Dispatcher = (function () {
    function Dispatcher() {
        this.listeners = [];
    }
    Dispatcher.prototype.listen = function (callback, target, callOnce) {
        var listener = new Listener(callback, target, callOnce);
        this.listeners.push(listener);
        return listener;
    };
    Dispatcher.prototype.removeAllListeners = function () {
        this.listeners = [];
    };
    Dispatcher.prototype.numListeners = function () {
        return this.listeners.length;
    };
    Dispatcher.prototype.dispatch = function (payload) {
        var newListeners = [];
        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            if (listener.receiveSignal(payload))
                newListeners.push(listener);
        }
        this.listeners = newListeners;
    };
    return Dispatcher;
})();
exports.Dispatcher = Dispatcher;
var Listener = (function () {
    function Listener(callback, target, callOnce) {
        var _this = this;
        this.target = target;
        this.callOnce = callOnce;
        this.receiveSignal = function (payload) {
            callback.apply(target, [payload]);
            return _this.callOnce != true;
        };
    }
    Listener.prototype.unlisten = function () {
        this.receiveSignal = function (payload) {
            return false;
        };
    };
    return Listener;
})();
exports.Listener = Listener;

},{}],15:[function(require,module,exports){
/**
 * Created by staticfunction on 8/20/14.
 */
var signals = require('kola-signals');
var KontextFactory = (function () {
    function KontextFactory(generator) {
        this.generator = this.getInstance = generator;
    }
    KontextFactory.prototype.asSingleton = function () {
        var _this = this;
        this.getInstance = function () {
            if (!_this.singleInstance)
                _this.singleInstance = _this.generator();
            return _this.singleInstance;
        };
    };
    return KontextFactory;
})();
exports.KontextFactory = KontextFactory;
var SignalHook = (function () {
    function SignalHook(kontext, signal, hook) {
        this.kontext = kontext;
        this.signal = signal;
        this.hook = hook;
    }
    SignalHook.prototype.onDispatch = function (payload) {
        this.hook.execute(payload, this.kontext);
    };
    SignalHook.prototype.attach = function () {
        this.listener = this.signal.listen(this.onDispatch, this, this.callOnce);
    };
    SignalHook.prototype.dettach = function () {
        this.listener.unlisten();
    };
    SignalHook.prototype.runOnce = function () {
        this.callOnce = true;
    };
    return SignalHook;
})();
exports.SignalHook = SignalHook;
var KontextImpl = (function () {
    function KontextImpl(parent) {
        this.parent = parent;
        this.signals = {};
        this.signalHooks = [];
        this.instances = {};
    }
    KontextImpl.prototype.hasSignal = function (name) {
        return this.signals[name] != null;
    };
    KontextImpl.prototype.setSignal = function (name, hook) {
        var signal = this.getSignal(name);
        if (!signal)
            signal = this.signals[name] = new signals.Dispatcher();
        var sigHook;
        if (hook) {
            sigHook = new SignalHook(this, signal, hook);
            this.signalHooks.push(sigHook);
        }
        return sigHook;
    };
    KontextImpl.prototype.getSignal = function (name) {
        var signal = this.signals[name];
        if (this.parent && !signal) {
            signal = this.parent.getSignal(name);
        }
        return signal;
    };
    KontextImpl.prototype.setInstance = function (name, factory) {
        if (!factory)
            throw new Error('error trying to define instance: ' + name);
        return this.instances[name] = new KontextFactory(factory);
    };
    KontextImpl.prototype.getInstance = function (name) {
        var factory = this.instances[name];
        if (factory)
            return factory.getInstance();
        if (this.parent)
            return this.parent.getInstance(name);
    };
    KontextImpl.prototype.start = function () {
        for (var i = 0; i < this.signalHooks.length; i++) {
            this.signalHooks[i].attach();
        }
    };
    KontextImpl.prototype.stop = function () {
        for (var i = 0; i < this.signalHooks.length; i++) {
            this.signalHooks[i].dettach();
        }
    };
    return KontextImpl;
})();
exports.KontextImpl = KontextImpl;
var App = (function () {
    function App(parent) {
        this.parent = parent;
        if (this.parent) {
            this.kontext = new KontextImpl(this.parent.kontext);
        }
        else
            this.kontext = new KontextImpl();
    }
    App.prototype.onKontext = function (kontext, opts) {
    };
    App.prototype.start = function (opts) {
        this.startupOptions = opts;
        this.onKontext(this.kontext, opts);
        this.kontext.start();
        this.onStart();
        return this;
    };
    App.prototype.onStart = function () {
    };
    App.prototype.onStop = function () {
    };
    App.prototype.stop = function () {
        this.kontext.stop();
        this.onStop();
        return this;
    };
    return App;
})();
exports.App = App;

},{"kola-signals":14}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hcHAuanMiLCJidWlsZC9jb21tYW5kcy5qcyIsImJ1aWxkL2Zvb3Rlci9hcHAuanMiLCJidWlsZC9mb290ZXIvdmlld3MvRm9vdGVyLmpzIiwiYnVpbGQvaGVhZGVyL2FwcC5qcyIsImJ1aWxkL2hlYWRlci92aWV3cy9IZWFkZXIuanMiLCJidWlsZC9tYWluL2FwcC5qcyIsImJ1aWxkL21haW4vcmVuZGVyZXIvYXBwLmpzIiwiYnVpbGQvbWFpbi9yZW5kZXJlci92aWV3cy9Ub2RvLmpzIiwiYnVpbGQvbWFpbi92aWV3cy9NYWluLmpzIiwiYnVpbGQvbW9kZWxzLmpzIiwiYnVpbGQvdmlld3MvVG9kb0FwcC5qcyIsIm5vZGVfbW9kdWxlcy9rb2xhLWhvb2tzL2Rpc3QvaG9va3MuanMiLCJub2RlX21vZHVsZXMva29sYS1zaWduYWxzL2Rpc3Qvc2lnbmFscy5qcyIsIm5vZGVfbW9kdWxlcy9rb2xhL2Rpc3Qva29sYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgX18oKTtcbn07XG4vKipcbiAqIENyZWF0ZWQgYnkgamNhYnJlc29zIG9uIDMvMTMvMTUuXG4gKi9cbnZhciBrb2xhID0gcmVxdWlyZSgna29sYScpO1xudmFyIGhvb2tzID0gcmVxdWlyZSgna29sYS1ob29rcycpO1xudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4vbW9kZWxzJyk7XG52YXIgbWFpbiA9IHJlcXVpcmUoJy4vbWFpbi9hcHAnKTtcbnZhciBoZWFkZXIgPSByZXF1aXJlKCcuL2hlYWRlci9hcHAnKTtcbnZhciBmb290ZXIgPSByZXF1aXJlKCcuL2Zvb3Rlci9hcHAnKTtcbnZhciBjb21tYW5kcyA9IHJlcXVpcmUoJy4vY29tbWFuZHMnKTtcbnZhciBUb2RvQXBwVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvVG9kb0FwcCcpO1xudmFyIFRvZG9BcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUb2RvQXBwLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFRvZG9BcHAoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBUb2RvQXBwLnByb3RvdHlwZS5vbktvbnRleHQgPSBmdW5jdGlvbiAoa29udGV4dCwgb3B0cykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnRvZG9WaWV3ID0gbmV3IFRvZG9BcHBWaWV3KCk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCdpbml0JywgaG9va3MuZXhlY3V0ZXMoW2NvbW1hbmRzLmluaXRpYWxpemVkLCBjb21tYW5kcy5zZXRTdGF0ZU1haW5BbmRGb290ZXJdKSk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2RvLmFkZCcsIGhvb2tzLmV4ZWN1dGVzKFtjb21tYW5kcy5hZGRUb2RvLCBjb21tYW5kcy5zZXRTdGF0ZU1haW5BbmRGb290ZXJdKSk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2RvLnJlbW92ZScsIGhvb2tzLmV4ZWN1dGVzKFtjb21tYW5kcy5yZW1vdmVUb2RvLCBjb21tYW5kcy5zZXRTdGF0ZU1haW5BbmRGb290ZXJdKSk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2RvLmNvbXBsZXRlJyk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2Rvcy5jbGVhci5jb21wbGV0ZWQnKTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndG9kb3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IG1vZGVscy5Ub2RvcygpO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBrb250ZXh0LnNldEluc3RhbmNlKCd0b2RvJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBtb2RlbHMuVG9kbygpO1xuICAgICAgICB9KTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndmlldy5mb290ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMudG9kb1ZpZXcuZm9vdGVyO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBrb250ZXh0LnNldEluc3RhbmNlKCd2aWV3Lm1haW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMudG9kb1ZpZXcubWFpbjtcbiAgICAgICAgfSkuYXNTaW5nbGV0b24oKTtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5vbktvbnRleHQuY2FsbCh0aGlzLCBrb250ZXh0LCBvcHRzKTtcbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudG9kb1ZpZXcuYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucyk7XG4gICAgICAgIHRoaXMuaGVhZGVyQXBwID0gbmV3IGhlYWRlci5BcHAodGhpcykuc3RhcnQodGhpcy50b2RvVmlldy5oZWFkZXIpO1xuICAgICAgICB0aGlzLmZvb3RlckFwcCA9IG5ldyBmb290ZXIuQXBwKHRoaXMpLnN0YXJ0KHRoaXMudG9kb1ZpZXcuZm9vdGVyKTtcbiAgICAgICAgdGhpcy5tYWluQXBwID0gbmV3IG1haW4uQXBwKHRoaXMpLnN0YXJ0KHRoaXMudG9kb1ZpZXcubWFpbik7XG4gICAgICAgIHRoaXMua29udGV4dC5nZXRTaWduYWwoJ2luaXQnKS5kaXNwYXRjaCgpO1xuICAgIH07XG4gICAgVG9kb0FwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRvZG9WaWV3LnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmhlYWRlckFwcC5zdG9wKCk7XG4gICAgICAgIHRoaXMuZm9vdGVyQXBwLnN0b3AoKTtcbiAgICAgICAgdGhpcy5tYWluQXBwLnN0b3AoKTtcbiAgICB9O1xuICAgIHJldHVybiBUb2RvQXBwO1xufSkoa29sYS5BcHApO1xuZXhwb3J0cy5Ub2RvQXBwID0gVG9kb0FwcDtcbnZhciB0b2RvQXBwID0gbmV3IFRvZG9BcHAoKS5zdGFydCh3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZG9hcHAnKSk7XG4iLCJmdW5jdGlvbiBpbml0aWFsaXplZChwYXlsb2FkLCBrb250ZXh0KSB7XG59XG5leHBvcnRzLmluaXRpYWxpemVkID0gaW5pdGlhbGl6ZWQ7XG5mdW5jdGlvbiBhZGRUb2RvKHBheWxvYWQsIGtvbnRleHQpIHtcbiAgICB2YXIgdG9kb3MgPSBrb250ZXh0LmdldEluc3RhbmNlKCd0b2RvcycpO1xuICAgIHRvZG9zLmFkZFRvZG8ocGF5bG9hZCk7XG59XG5leHBvcnRzLmFkZFRvZG8gPSBhZGRUb2RvO1xuZnVuY3Rpb24gcmVtb3ZlVG9kbyhwYXlsb2FkLCBrb250ZXh0KSB7XG4gICAgdmFyIHRvZG9zID0ga29udGV4dC5nZXRJbnN0YW5jZSgndG9kb3MnKTtcbiAgICB0b2Rvcy5yZW1vdmVUb2RvKHBheWxvYWQpO1xufVxuZXhwb3J0cy5yZW1vdmVUb2RvID0gcmVtb3ZlVG9kbztcbmZ1bmN0aW9uIGNvbXBsZXRlVG9kbyhwYXlsb2FkLCBrb250ZXh0KSB7XG4gICAgcGF5bG9hZC5zZXRDb21wbGV0ZWQodHJ1ZSk7XG59XG5leHBvcnRzLmNvbXBsZXRlVG9kbyA9IGNvbXBsZXRlVG9kbztcbmZ1bmN0aW9uIHNldFN0YXRlTWFpbkFuZEZvb3RlcihwYXlsb2FkLCBrb250ZXh0KSB7XG4gICAgdmFyIGZvb3RlciA9IGtvbnRleHQuZ2V0SW5zdGFuY2UoJ3ZpZXcuZm9vdGVyJyk7XG4gICAgdmFyIG1haW4gPSBrb250ZXh0LmdldEluc3RhbmNlKCd2aWV3Lm1haW4nKTtcbiAgICB2YXIgdG9kb3MgPSBrb250ZXh0LmdldEluc3RhbmNlKCd0b2RvcycpO1xuICAgIHZhciBzdGF0ZSA9IHRvZG9zLnNpemUoKSA+IDAgPyAnaGFzVG9kb3MnIDogJ25vVG9kb3MnO1xuICAgIGZvb3Rlci5jbGFzc05hbWUgPSBtYWluLmNsYXNzTmFtZSA9IHN0YXRlO1xufVxuZXhwb3J0cy5zZXRTdGF0ZU1haW5BbmRGb290ZXIgPSBzZXRTdGF0ZU1haW5BbmRGb290ZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgRm9vdGVyID0gcmVxdWlyZSgnLi92aWV3cy9Gb290ZXInKTtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmZvb3RlciA9IG5ldyBGb290ZXIoKTtcbiAgICAgICAgdGhpcy5mb290ZXIuYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucyk7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBGb290ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZvb3RlcigpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy50b2RvQ291bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHRoaXMudG9kb0NvdW50LnNldEF0dHJpYnV0ZSgnaWQnLCAndG9kby1jb3VudCcpO1xuICAgICAgICB2YXIgbjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHJvbmcnKTtcbiAgICAgICAgdmFyIG4yID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzAnKTtcbiAgICAgICAgdmFyIG4zID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBpdGVtIGxlZnQnKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzLnNldEF0dHJpYnV0ZSgnaWQnLCAnZmlsdGVycycpO1xuICAgICAgICB2YXIgbjUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgbjYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIG42LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgbjYuc2V0QXR0cmlidXRlKCdocmVmJywgJyMvJyk7XG4gICAgICAgIHZhciBuNyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBbGwnKTtcbiAgICAgICAgdmFyIG44ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgdmFyIG45ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBuOS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIy9hY3RpdmUnKTtcbiAgICAgICAgdmFyIG4xMCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBY3RpdmUnKTtcbiAgICAgICAgdmFyIG4xMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHZhciBuMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIG4xMi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIy9jb21wbGV0ZWQnKTtcbiAgICAgICAgdmFyIG4xMyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdDb21wbGV0ZWQnKTtcbiAgICAgICAgdGhpcy5jbGVhckNvbXBsZXRlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLmNsZWFyQ29tcGxldGVkLnNldEF0dHJpYnV0ZSgnaWQnLCAnY2xlYXItY29tcGxldGVkJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2RvQ291bnQpO1xuICAgICAgICB0aGlzLnRvZG9Db3VudC5hcHBlbmRDaGlsZChuMSk7XG4gICAgICAgIG4xLmFwcGVuZENoaWxkKG4yKTtcbiAgICAgICAgdGhpcy50b2RvQ291bnQuYXBwZW5kQ2hpbGQobjMpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMuZmlsdGVycyk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5hcHBlbmRDaGlsZChuNSk7XG4gICAgICAgIG41LmFwcGVuZENoaWxkKG42KTtcbiAgICAgICAgbjYuYXBwZW5kQ2hpbGQobjcpO1xuICAgICAgICB0aGlzLmZpbHRlcnMuYXBwZW5kQ2hpbGQobjgpO1xuICAgICAgICBuOC5hcHBlbmRDaGlsZChuOSk7XG4gICAgICAgIG45LmFwcGVuZENoaWxkKG4xMCk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5hcHBlbmRDaGlsZChuMTEpO1xuICAgICAgICBuMTEuYXBwZW5kQ2hpbGQobjEyKTtcbiAgICAgICAgbjEyLmFwcGVuZENoaWxkKG4xMyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5jbGVhckNvbXBsZXRlZCk7XG4gICAgfVxuICAgIEZvb3Rlci5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRm9vdGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBGb290ZXI7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBGb290ZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgSGVhZGVyID0gcmVxdWlyZSgnLi92aWV3cy9IZWFkZXInKTtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vbktvbnRleHQgPSBmdW5jdGlvbiAoa29udGV4dCkge1xuICAgICAgICB0aGlzLmFkZFRvZG8gPSBrb250ZXh0LmdldFNpZ25hbCgndG9kby5hZGQnKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBuZXcgSGVhZGVyKCk7XG4gICAgICAgIHRoaXMuaGVhZGVyLmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgICAgICB0aGlzLmhlYWRlci5uZXdUb2RvLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25LZXlEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICB2YXIgZGVzYyA9IHRoaXMuaGVhZGVyLm5ld1RvZG8udmFsdWU7XG4gICAgICAgICAgICB2YXIgdG9kbyA9IHRoaXMua29udGV4dC5nZXRJbnN0YW5jZSgndG9kbycpO1xuICAgICAgICAgICAgdG9kby5zZXREZXNjcmlwdGlvbihkZXNjKTtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9kby5kaXNwYXRjaCh0b2RvKTtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyLm5ld1RvZG8udmFsdWUgPSBudWxsOyAvL2NsZWFyXG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmhlYWRlci5yZW1vdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBIZWFkZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEhlYWRlcigpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIG4wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICAgICAgdmFyIG4xID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3RvZG9zJyk7XG4gICAgICAgIHRoaXMubmV3VG9kbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMubmV3VG9kby5zZXRBdHRyaWJ1dGUoJ2lkJywgJ25ldy10b2RvJyk7XG4gICAgICAgIHRoaXMubmV3VG9kby5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ1doYXQgbmVlZHMgdG8gYmUgZG9uZT8nKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvLnNldEF0dHJpYnV0ZSgnYXV0b2ZvY3VzJywgJycpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKG4wKTtcbiAgICAgICAgbjAuYXBwZW5kQ2hpbGQobjEpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMubmV3VG9kbyk7XG4gICAgfVxuICAgIEhlYWRlci5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgSGVhZGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBIZWFkZXI7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgcmVuZGVyZXIgPSByZXF1aXJlKCcuL3JlbmRlcmVyL2FwcCcpO1xudmFyIE1haW4gPSByZXF1aXJlKCcuL3ZpZXdzL01haW4nKTtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1haW4gPSBuZXcgTWFpbigpO1xuICAgICAgICB0aGlzLm1haW4uYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucyk7XG4gICAgICAgIHRoaXMudG9kb3MgPSB0aGlzLmtvbnRleHQuZ2V0SW5zdGFuY2UoJ3RvZG9zJyk7XG4gICAgICAgIHRoaXMub25Ub2RvQWRkID0gdGhpcy50b2Rvcy5vbkFkZFRvZG8ubGlzdGVuKHRoaXMudG9kb0FkZGVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5vblRvZG9SZW1vdmUgPSB0aGlzLnRvZG9zLm9uUmVtb3ZlVG9kby5saXN0ZW4odGhpcy50b2RvUmVtb3ZlZCwgdGhpcyk7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLnRvZG9BZGRlZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgdG9kb1JlbmRlcmVyID0gbmV3IHJlbmRlcmVyLkFwcCh0aGlzKTtcbiAgICAgICAgdG9kb1JlbmRlcmVyLnN0YXJ0KHsgdG9kbzogdmFsdWUsIGNvbnRhaW5lcjogdGhpcy5tYWluLnRvZG9MaXN0IH0pO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS50b2RvUmVtb3ZlZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub25Ub2RvQWRkLnVubGlzdGVuKCk7XG4gICAgICAgIHRoaXMub25Ub2RvUmVtb3ZlLnVubGlzdGVuKCk7XG4gICAgICAgIHRoaXMubWFpbi5yZW1vdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xuLyoqXG4gKiBDcmVhdGVkIGJ5IGpjYWJyZXNvcyBvbiAzLzE3LzE1LlxuICovXG52YXIga29sYSA9IHJlcXVpcmUoJ2tvbGEnKTtcbnZhciBUb2RvID0gcmVxdWlyZSgnLi92aWV3cy9Ub2RvJyk7XG52YXIgQXBwID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXBwLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFwcCgpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIEFwcC5wcm90b3R5cGUub25Lb250ZXh0ID0gZnVuY3Rpb24gKGtvbnRleHQsIG9wdHMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy50b2RvUmVuZGVyZXIgPSBuZXcgVG9kbygpO1xuICAgICAgICB0aGlzLnRvZG8gPSBvcHRzLnRvZG87XG4gICAgICAgIGtvbnRleHQuc2V0SW5zdGFuY2UoJ3RvZG8nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0cy50b2RvO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBrb250ZXh0LnNldEluc3RhbmNlKCd0b2RvLnJlbmRlcmVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnRvZG9SZW5kZXJlcjtcbiAgICAgICAgfSkuYXNTaW5nbGV0b24oKTtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5vbktvbnRleHQuY2FsbCh0aGlzLCBrb250ZXh0LCBvcHRzKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50b2RvUmVuZGVyZXIuYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucy5jb250YWluZXIpO1xuICAgICAgICB0aGlzLnRvZG9SZW5kZXJlci5jb21wbGV0ZWQuY2hlY2tlZCA9IHRoaXMudG9kby5nZXRDb21wbGV0ZWQoKTtcbiAgICAgICAgdGhpcy50b2RvUmVuZGVyZXIuZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB0aGlzLnRvZG8uZ2V0RGVzY3JpcHRpb24oKTtcbiAgICAgICAgdGhpcy50b2RvUmVuZGVyZXIuZWRpdC52YWx1ZSA9IHRoaXMudG9kby5nZXREZXNjcmlwdGlvbigpO1xuICAgICAgICB0aGlzLnRvZG9SZW5kZXJlci5kZXN0cm95LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkRlc3Ryb3kuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucmVtb3ZlV2F0Y2hlciA9IHRoaXMua29udGV4dC5nZXRTaWduYWwoJ3RvZG8ucmVtb3ZlJykubGlzdGVuKHRoaXMub25Ub2RvUmVtb3ZlLCB0aGlzKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25EZXN0cm95ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBzaWduYWxSZW1vdmUgPSB0aGlzLmtvbnRleHQuZ2V0U2lnbmFsKCd0b2RvLnJlbW92ZScpO1xuICAgICAgICBzaWduYWxSZW1vdmUuZGlzcGF0Y2godGhpcy50b2RvKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25Ub2RvUmVtb3ZlID0gZnVuY3Rpb24gKHRvZG8pIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhcnR1cE9wdGlvbnMudG9kbyA9PSB0b2RvKVxuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50b2RvUmVuZGVyZXIucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlV2F0Y2hlci51bmxpc3RlbigpO1xuICAgIH07XG4gICAgcmV0dXJuIEFwcDtcbn0pKGtvbGEuQXBwKTtcbmV4cG9ydHMuQXBwID0gQXBwO1xuIiwidmFyIFRvZG8gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRvZG8oKSB7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzID0gW107XG4gICAgICAgIHRoaXMudG9kbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHZhciBuMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBuMS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3ZpZXcnKTtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICB0aGlzLmNvbXBsZXRlZC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RvZ2dsZScpO1xuICAgICAgICB0aGlzLmNvbXBsZXRlZC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJycpO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgdmFyIG40ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1Rhc3RlIEphdmFTY3JpcHQnKTtcbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIHRoaXMuZGVzdHJveS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Rlc3Ryb3knKTtcbiAgICAgICAgdGhpcy5lZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgdGhpcy5lZGl0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZWRpdCcpO1xuICAgICAgICB0aGlzLmVkaXQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdDcmVhdGUgYSBUb2RvTVZDIHRlbXBsYXRlJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2RvKTtcbiAgICAgICAgdGhpcy50b2RvLmFwcGVuZENoaWxkKG4xKTtcbiAgICAgICAgbjEuYXBwZW5kQ2hpbGQodGhpcy5jb21wbGV0ZWQpO1xuICAgICAgICBuMS5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChuNCk7XG4gICAgICAgIG4xLmFwcGVuZENoaWxkKHRoaXMuZGVzdHJveSk7XG4gICAgICAgIHRoaXMudG9kby5hcHBlbmRDaGlsZCh0aGlzLmVkaXQpO1xuICAgIH1cbiAgICBUb2RvLnByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBUb2RvLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBUb2RvO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gVG9kbztcbiIsInZhciBNYWluID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYWluKCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMudG9nZ2xlQWxsLnNldEF0dHJpYnV0ZSgnaWQnLCAndG9nZ2xlLWFsbCcpO1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgICAgdmFyIG4xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgbjEuc2V0QXR0cmlidXRlKCdmb3InLCAndG9nZ2xlLWFsbCcpO1xuICAgICAgICB2YXIgbjIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTWFyayBhbGwgYXMgY29tcGxldGUnKTtcbiAgICAgICAgdGhpcy50b2RvTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgIHRoaXMudG9kb0xpc3Quc2V0QXR0cmlidXRlKCdpZCcsICd0b2RvLWxpc3QnKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLnRvZ2dsZUFsbCk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2gobjEpO1xuICAgICAgICBuMS5hcHBlbmRDaGlsZChuMik7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2RvTGlzdCk7XG4gICAgfVxuICAgIE1haW4ucHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE1haW4ucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIE1haW47XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBNYWluO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGpjYWJyZXNvcyBvbiAzLzEzLzE1LlxuICovXG52YXIgc2lnbmFscyA9IHJlcXVpcmUoJ2tvbGEtc2lnbmFscycpO1xudmFyIFRvZG8gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRvZG8oKSB7XG4gICAgICAgIHRoaXMub25EZXNjcmlwdGlvbiA9IG5ldyBzaWduYWxzLkRpc3BhdGNoZXIoKTtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlZCA9IG5ldyBzaWduYWxzLkRpc3BhdGNoZXIoKTtcbiAgICB9XG4gICAgVG9kby5wcm90b3R5cGUuc2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9uRGVzY3JpcHRpb24uZGlzcGF0Y2godmFsdWUpO1xuICAgIH07XG4gICAgVG9kby5wcm90b3R5cGUuZ2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xuICAgIH07XG4gICAgVG9kby5wcm90b3R5cGUuc2V0Q29tcGxldGVkID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY29tcGxldGVkID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25Db21wbGV0ZWQuZGlzcGF0Y2godmFsdWUpO1xuICAgIH07XG4gICAgVG9kby5wcm90b3R5cGUuZ2V0Q29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZWQ7XG4gICAgfTtcbiAgICByZXR1cm4gVG9kbztcbn0pKCk7XG5leHBvcnRzLlRvZG8gPSBUb2RvO1xudmFyIFRvZG9zID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUb2RvcygpIHtcbiAgICAgICAgdGhpcy5vbkFkZFRvZG8gPSBuZXcgc2lnbmFscy5EaXNwYXRjaGVyKCk7XG4gICAgICAgIHRoaXMub25SZW1vdmVUb2RvID0gbmV3IHNpZ25hbHMuRGlzcGF0Y2hlcigpO1xuICAgICAgICB0aGlzLnRvZG9zID0gW107XG4gICAgfVxuICAgIFRvZG9zLnByb3RvdHlwZS5hZGRUb2RvID0gZnVuY3Rpb24gKHRvZG8pIHtcbiAgICAgICAgdGhpcy50b2Rvcy5wdXNoKHRvZG8pO1xuICAgICAgICB0aGlzLm9uQWRkVG9kby5kaXNwYXRjaCh0b2RvKTtcbiAgICB9O1xuICAgIFRvZG9zLnByb3RvdHlwZS5yZW1vdmVUb2RvID0gZnVuY3Rpb24gKHRvZG8pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodG9kbyA9PSB0aGlzLnRvZG9zW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vblJlbW92ZVRvZG8uZGlzcGF0Y2godG9kbyk7XG4gICAgfTtcbiAgICBUb2Rvcy5wcm90b3R5cGUuZ2V0Q29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9kb3NDb21wbGV0ZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS5nZXRDb21wbGV0ZWQoKSlcbiAgICAgICAgICAgICAgICB0b2Rvc0NvbXBsZXRlZC5wdXNoKHRoaXMudG9kb3NbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2Rvc0NvbXBsZXRlZDtcbiAgICB9O1xuICAgIFRvZG9zLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvZG9zLnNwbGljZSgwKTtcbiAgICB9O1xuICAgIFRvZG9zLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b2Rvcy5sZW5ndGg7XG4gICAgfTtcbiAgICByZXR1cm4gVG9kb3M7XG59KSgpO1xuZXhwb3J0cy5Ub2RvcyA9IFRvZG9zO1xuIiwidmFyIFRvZG9BcHAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRvZG9BcHAoKSB7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzID0gW107XG4gICAgICAgIHRoaXMuaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaGVhZGVyJyk7XG4gICAgICAgIHRoaXMuaGVhZGVyLnNldEF0dHJpYnV0ZSgnaWQnLCAnaGVhZGVyJyk7XG4gICAgICAgIHRoaXMubWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlY3Rpb24nKTtcbiAgICAgICAgdGhpcy5tYWluLnNldEF0dHJpYnV0ZSgnaWQnLCAnbWFpbicpO1xuICAgICAgICB0aGlzLmZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpO1xuICAgICAgICB0aGlzLmZvb3Rlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2Zvb3RlcicpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMuaGVhZGVyKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLm1haW4pO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMuZm9vdGVyKTtcbiAgICB9XG4gICAgVG9kb0FwcC5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgVG9kb0FwcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMucGFyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gVG9kb0FwcDtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFRvZG9BcHA7XG4iLCJ2YXIgRXhlY3V0aW9uQ2hhaW5UaW1lb3V0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFeGVjdXRpb25DaGFpblRpbWVvdXQoa29tbWFuZCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkV4ZWN1dGlvbkNoYWluVGltZW91dFwiO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBcIkV4ZWN1dGlvbiB0aW1lb3V0XCI7XG4gICAgICAgIHRoaXMua29tbWFuZCA9IGtvbW1hbmQ7XG4gICAgfVxuICAgIHJldHVybiBFeGVjdXRpb25DaGFpblRpbWVvdXQ7XG59KSgpO1xuZXhwb3J0cy5FeGVjdXRpb25DaGFpblRpbWVvdXQgPSBFeGVjdXRpb25DaGFpblRpbWVvdXQ7XG52YXIgRXhlY3V0aW9uQ2hhaW4gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV4ZWN1dGlvbkNoYWluKHBheWxvYWQsIGtvbnRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgdGhpcy5rb250ZXh0ID0ga29udGV4dDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xuICAgICAgICB0aGlzLmV4ZWN1dGVkID0ge307XG4gICAgfVxuICAgIEV4ZWN1dGlvbkNoYWluLnByb3RvdHlwZS5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEV4ZWN1dGlvbkNoYWluLnByb3RvdHlwZS5vbkRvbmUgPSBmdW5jdGlvbiAoaW5kZXgsIGVycm9yKSB7XG4gICAgICAgIC8vaWYgdGhpcyBpbmRleCBpcyBlcXVhbCB0byBjdXJyZW50SW5kZXggdGhlbiBjYWxsIG5leHRcbiAgICAgICAgLy9pZiBub3QsIGlnbm9yZSwgYnV0IGlmIGl0IGhhcyBhbiBlcnJvciwgbGV0IGl0IGNhbGwgb24gZXJyb3JcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcbiAgICAgICAgaWYgKGVycm9yICYmIHRoaXMub3B0aW9ucy5lcnJvckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lcnJvckNvbW1hbmQoZXJyb3IsIHRoaXMua29udGV4dCk7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZyYWdpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4Kys7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW4ucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmV4ZWN1dGVkW3RoaXMuY3VycmVudEluZGV4XSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4IDwgdGhpcy5vcHRpb25zLmNvbW1hbmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNvbW1hbmQgPSB0aGlzLm9wdGlvbnMuY29tbWFuZHNbdGhpcy5jdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgdmFyIGRvbmU7XG4gICAgICAgICAgICBpZiAoY29tbWFuZC5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgZG9uZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5vbkRvbmUoX3RoaXMuY3VycmVudEluZGV4LCBlcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgb25UaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5vbkRvbmUoX3RoaXMuY3VycmVudEluZGV4LCBuZXcgRXhlY3V0aW9uQ2hhaW5UaW1lb3V0KGNvbW1hbmQpKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dElkID0gc2V0VGltZW91dChvblRpbWVvdXQsIHRoaXMub3B0aW9ucy50aW1lb3V0KTtcbiAgICAgICAgICAgICAgICBjb21tYW5kKHRoaXMucGF5bG9hZCwgdGhpcy5rb250ZXh0LCBkb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBjb21tYW5kKHRoaXMucGF5bG9hZCwgdGhpcy5rb250ZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCsrO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5leGVjdXRlZFt0aGlzLmN1cnJlbnRJbmRleF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gRXhlY3V0aW9uQ2hhaW47XG59KSgpO1xuZXhwb3J0cy5FeGVjdXRpb25DaGFpbiA9IEV4ZWN1dGlvbkNoYWluO1xudmFyIEV4ZWN1dGlvbkNoYWluRmFjdG9yeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXhlY3V0aW9uQ2hhaW5GYWN0b3J5KGNvbW1hbmRDaGFpbikge1xuICAgICAgICB0aGlzLnRpbWVvdXRNcyA9IDIwMDA7XG4gICAgICAgIHRoaXMuY29tbWFuZENoYWluID0gY29tbWFuZENoYWluO1xuICAgIH1cbiAgICBFeGVjdXRpb25DaGFpbkZhY3RvcnkucHJvdG90eXBlLmJyZWFrQ2hhaW5PbkVycm9yID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY2hhaW5CcmVha3NPbkVycm9yID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5LnByb3RvdHlwZS5vbkVycm9yID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5vbkVycm9yQ29tbWFuZCA9IGNvbW1hbmQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5LnByb3RvdHlwZS50aW1lb3V0ID0gZnVuY3Rpb24gKG1zKSB7XG4gICAgICAgIHRoaXMudGltZW91dE1zID0gbXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5LnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKHBheWxvYWQsIGtvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFeGVjdXRpb25DaGFpbihwYXlsb2FkLCBrb250ZXh0LCB7XG4gICAgICAgICAgICBcImNvbW1hbmRzXCI6IHRoaXMuY29tbWFuZENoYWluLFxuICAgICAgICAgICAgXCJlcnJvckNvbW1hbmRcIjogdGhpcy5vbkVycm9yQ29tbWFuZCxcbiAgICAgICAgICAgIFwiZnJhZ2lsZVwiOiB0aGlzLmNoYWluQnJlYWtzT25FcnJvcixcbiAgICAgICAgICAgIFwidGltZW91dFwiOiB0aGlzLnRpbWVvdXRNc1xuICAgICAgICB9KS5ub3coKTtcbiAgICB9O1xuICAgIHJldHVybiBFeGVjdXRpb25DaGFpbkZhY3Rvcnk7XG59KSgpO1xuZXhwb3J0cy5FeGVjdXRpb25DaGFpbkZhY3RvcnkgPSBFeGVjdXRpb25DaGFpbkZhY3Rvcnk7XG5mdW5jdGlvbiBleGVjdXRlcyhrb21tYW5kKSB7XG4gICAgcmV0dXJuIG5ldyBFeGVjdXRpb25DaGFpbkZhY3Rvcnkoa29tbWFuZCk7XG59XG5leHBvcnRzLmV4ZWN1dGVzID0gZXhlY3V0ZXM7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamNhYnJlc29zIG9uIDIvMTUvMTQuXG4gKi9cbnZhciBEaXNwYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgIH1cbiAgICBEaXNwYXRjaGVyLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRhcmdldCwgY2FsbE9uY2UpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gbmV3IExpc3RlbmVyKGNhbGxiYWNrLCB0YXJnZXQsIGNhbGxPbmNlKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICB9O1xuICAgIERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICB9O1xuICAgIERpc3BhdGNoZXIucHJvdG90eXBlLm51bUxpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzLmxlbmd0aDtcbiAgICB9O1xuICAgIERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgdmFyIG5ld0xpc3RlbmVycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lci5yZWNlaXZlU2lnbmFsKHBheWxvYWQpKVxuICAgICAgICAgICAgICAgIG5ld0xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ld0xpc3RlbmVycztcbiAgICB9O1xuICAgIHJldHVybiBEaXNwYXRjaGVyO1xufSkoKTtcbmV4cG9ydHMuRGlzcGF0Y2hlciA9IERpc3BhdGNoZXI7XG52YXIgTGlzdGVuZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIExpc3RlbmVyKGNhbGxiYWNrLCB0YXJnZXQsIGNhbGxPbmNlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLmNhbGxPbmNlID0gY2FsbE9uY2U7XG4gICAgICAgIHRoaXMucmVjZWl2ZVNpZ25hbCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0YXJnZXQsIFtwYXlsb2FkXSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuY2FsbE9uY2UgIT0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgTGlzdGVuZXIucHJvdG90eXBlLnVubGlzdGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlY2VpdmVTaWduYWwgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIExpc3RlbmVyO1xufSkoKTtcbmV4cG9ydHMuTGlzdGVuZXIgPSBMaXN0ZW5lcjtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBzdGF0aWNmdW5jdGlvbiBvbiA4LzIwLzE0LlxuICovXG52YXIgc2lnbmFscyA9IHJlcXVpcmUoJ2tvbGEtc2lnbmFscycpO1xudmFyIEtvbnRleHRGYWN0b3J5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBLb250ZXh0RmFjdG9yeShnZW5lcmF0b3IpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSB0aGlzLmdldEluc3RhbmNlID0gZ2VuZXJhdG9yO1xuICAgIH1cbiAgICBLb250ZXh0RmFjdG9yeS5wcm90b3R5cGUuYXNTaW5nbGV0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLnNpbmdsZUluc3RhbmNlKVxuICAgICAgICAgICAgICAgIF90aGlzLnNpbmdsZUluc3RhbmNlID0gX3RoaXMuZ2VuZXJhdG9yKCk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2luZ2xlSW5zdGFuY2U7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gS29udGV4dEZhY3Rvcnk7XG59KSgpO1xuZXhwb3J0cy5Lb250ZXh0RmFjdG9yeSA9IEtvbnRleHRGYWN0b3J5O1xudmFyIFNpZ25hbEhvb2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNpZ25hbEhvb2soa29udGV4dCwgc2lnbmFsLCBob29rKSB7XG4gICAgICAgIHRoaXMua29udGV4dCA9IGtvbnRleHQ7XG4gICAgICAgIHRoaXMuc2lnbmFsID0gc2lnbmFsO1xuICAgICAgICB0aGlzLmhvb2sgPSBob29rO1xuICAgIH1cbiAgICBTaWduYWxIb29rLnByb3RvdHlwZS5vbkRpc3BhdGNoID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgdGhpcy5ob29rLmV4ZWN1dGUocGF5bG9hZCwgdGhpcy5rb250ZXh0KTtcbiAgICB9O1xuICAgIFNpZ25hbEhvb2sucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lciA9IHRoaXMuc2lnbmFsLmxpc3Rlbih0aGlzLm9uRGlzcGF0Y2gsIHRoaXMsIHRoaXMuY2FsbE9uY2UpO1xuICAgIH07XG4gICAgU2lnbmFsSG9vay5wcm90b3R5cGUuZGV0dGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lci51bmxpc3RlbigpO1xuICAgIH07XG4gICAgU2lnbmFsSG9vay5wcm90b3R5cGUucnVuT25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYWxsT25jZSA9IHRydWU7XG4gICAgfTtcbiAgICByZXR1cm4gU2lnbmFsSG9vaztcbn0pKCk7XG5leHBvcnRzLlNpZ25hbEhvb2sgPSBTaWduYWxIb29rO1xudmFyIEtvbnRleHRJbXBsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBLb250ZXh0SW1wbChwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgICAgICB0aGlzLnNpZ25hbEhvb2tzID0gW107XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzID0ge307XG4gICAgfVxuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5oYXNTaWduYWwgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaWduYWxzW25hbWVdICE9IG51bGw7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuc2V0U2lnbmFsID0gZnVuY3Rpb24gKG5hbWUsIGhvb2spIHtcbiAgICAgICAgdmFyIHNpZ25hbCA9IHRoaXMuZ2V0U2lnbmFsKG5hbWUpO1xuICAgICAgICBpZiAoIXNpZ25hbClcbiAgICAgICAgICAgIHNpZ25hbCA9IHRoaXMuc2lnbmFsc1tuYW1lXSA9IG5ldyBzaWduYWxzLkRpc3BhdGNoZXIoKTtcbiAgICAgICAgdmFyIHNpZ0hvb2s7XG4gICAgICAgIGlmIChob29rKSB7XG4gICAgICAgICAgICBzaWdIb29rID0gbmV3IFNpZ25hbEhvb2sodGhpcywgc2lnbmFsLCBob29rKTtcbiAgICAgICAgICAgIHRoaXMuc2lnbmFsSG9va3MucHVzaChzaWdIb29rKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2lnSG9vaztcbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5nZXRTaWduYWwgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgc2lnbmFsID0gdGhpcy5zaWduYWxzW25hbWVdO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXNpZ25hbCkge1xuICAgICAgICAgICAgc2lnbmFsID0gdGhpcy5wYXJlbnQuZ2V0U2lnbmFsKG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWduYWw7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuc2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAobmFtZSwgZmFjdG9yeSkge1xuICAgICAgICBpZiAoIWZhY3RvcnkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Vycm9yIHRyeWluZyB0byBkZWZpbmUgaW5zdGFuY2U6ICcgKyBuYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzW25hbWVdID0gbmV3IEtvbnRleHRGYWN0b3J5KGZhY3RvcnkpO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB0aGlzLmluc3RhbmNlc1tuYW1lXTtcbiAgICAgICAgaWYgKGZhY3RvcnkpXG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0SW5zdGFuY2UobmFtZSk7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaWduYWxIb29rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zaWduYWxIb29rc1tpXS5hdHRhY2goKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaWduYWxIb29rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zaWduYWxIb29rc1tpXS5kZXR0YWNoKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBLb250ZXh0SW1wbDtcbn0pKCk7XG5leHBvcnRzLktvbnRleHRJbXBsID0gS29udGV4dEltcGw7XG52YXIgQXBwID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBcHAocGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMua29udGV4dCA9IG5ldyBLb250ZXh0SW1wbCh0aGlzLnBhcmVudC5rb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmtvbnRleHQgPSBuZXcgS29udGV4dEltcGwoKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vbktvbnRleHQgPSBmdW5jdGlvbiAoa29udGV4dCwgb3B0cykge1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIHRoaXMuc3RhcnR1cE9wdGlvbnMgPSBvcHRzO1xuICAgICAgICB0aGlzLm9uS29udGV4dCh0aGlzLmtvbnRleHQsIG9wdHMpO1xuICAgICAgICB0aGlzLmtvbnRleHQuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5vblN0YXJ0KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMua29udGV4dC5zdG9wKCk7XG4gICAgICAgIHRoaXMub25TdG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgcmV0dXJuIEFwcDtcbn0pKCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiJdfQ==
