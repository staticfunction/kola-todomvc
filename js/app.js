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
        kontext.setSignal('todo.remove');
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

},{"./commands":2,"./footer/app":3,"./header/app":5,"./main/app":7,"./models":10,"./views/TodoApp":11,"kola":14,"kola-hooks":12}],2:[function(require,module,exports){
function initialized(payload, kontext) {
}
exports.initialized = initialized;
function addTodo(payload, kontext) {
    var todos = kontext.getInstance('todos');
    todos.addTodo(payload);
}
exports.addTodo = addTodo;
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

},{"./views/Footer":4,"kola":14}],4:[function(require,module,exports){
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

},{"./views/Header":6,"kola":14}],6:[function(require,module,exports){
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
var signals = require('kola-signals');
var Main = require('./views/Main');
var Todo = require('./views/Todo');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.onStart = function () {
        this.main = new Main();
        this.main.appendTo(this.startupOptions);
        this.todos = this.kontext.getInstance('todos');
        this.onTodoAdd = new signals.SignalListener(this.todoAdded, this);
        this.todos.onAddTodo.addListener(this.onTodoAdd);
        this.onTodoRemove = new signals.SignalListener(this.todoRemoved, this);
        this.todos.onRemoveTodo.addListener(this.onTodoRemove);
    };
    App.prototype.todoAdded = function (value) {
        var todo = new Todo();
        todo.description.textContent = value.getDescription();
        todo.edit.value = value.getDescription();
        todo.completed.checked = value.getCompleted();
        todo.appendTo(this.main.todoList);
    };
    App.prototype.todoRemoved = function (value) {
    };
    App.prototype.onStop = function () {
        this.main.remove();
    };
    return App;
})(kola.App);
exports.App = App;

},{"./views/Main":8,"./views/Todo":9,"kola":14,"kola-signals":13}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
var Todo = (function () {
    function Todo() {
        var domerId = (document["_domerId_"] == undefined) ? document["_domerId_"] = 0 : document["_domerId_"]++;
        this.rootNodes = [];
        this.todo = document.createElement('li');
        this.todo.setAttribute('id', 'todo_' + domerId);
        var n1 = document.createElement('div');
        n1.setAttribute('class', 'view');
        this.completed = document.createElement('input');
        this.completed.setAttribute('id', 'completed_' + domerId);
        this.completed.setAttribute('class', 'toggle');
        this.completed.setAttribute('type', 'checkbox');
        this.completed.setAttribute('checked', '');
        this.description = document.createElement('label');
        this.description.setAttribute('id', 'description_' + domerId);
        var n4 = document.createTextNode('Taste JavaScript');
        this.destroy = document.createElement('button');
        this.destroy.setAttribute('id', 'destroy_' + domerId);
        this.destroy.setAttribute('class', 'destroy');
        this.edit = document.createElement('input');
        this.edit.setAttribute('id', 'edit_' + domerId);
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
/**
 * Created by jcabresos on 3/13/15.
 */
var signals = require('kola-signals');
var Todo = (function () {
    function Todo() {
        this.onDescription = new signals.SignalDispatcher();
        this.onCompleted = new signals.SignalDispatcher();
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
        this.onAddTodo = new signals.SignalDispatcher();
        this.onRemoveTodo = new signals.SignalDispatcher();
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

},{"kola-signals":13}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
/**
 * Created by jcabresos on 2/15/14.
 */
var signalCount = 0;
function generateSignalId() {
    var nextId = signalCount++;
    return nextId;
}
var SignalDispatcher = (function () {
    function SignalDispatcher() {
        this.listeners = {};
        this.numListeners = 0;
    }
    SignalDispatcher.prototype.addListener = function (listener) {
        this.listeners[listener.id] = listener;
        this.numListeners++;
    };
    SignalDispatcher.prototype.removeListener = function (listener) {
        this.listeners[listener.id] = undefined;
        this.numListeners--;
    };
    SignalDispatcher.prototype.removeAllListeners = function () {
        this.listeners = {};
        this.numListeners = 0;
    };
    SignalDispatcher.prototype.getListenersLength = function () {
        return this.numListeners;
    };
    SignalDispatcher.prototype.dispatch = function (payload) {
        var listenersTmp = {};
        for (var id in this.listeners) {
            var listener = this.listeners[id];
            if (listener) {
                listener.receiveSignal(payload);
                if (listener.callOnce) {
                    this.removeListener(listener);
                    continue;
                }
                listenersTmp[id] = this.listeners[id];
            }
        }
        this.listeners = listenersTmp;
    };
    return SignalDispatcher;
})();
exports.SignalDispatcher = SignalDispatcher;
var SignalListener = (function () {
    function SignalListener(callback, target, callOnce) {
        this.id = generateSignalId();
        this.callback = callback;
        this.target = target;
        this.callOnce = callOnce;
    }
    SignalListener.prototype.receiveSignal = function (payload) {
        this.callback.call(this.target, payload);
    };
    return SignalListener;
})();
exports.SignalListener = SignalListener;

},{}],14:[function(require,module,exports){
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
        this.listener = new signals.SignalListener(this.onDispatch, this);
    }
    SignalHook.prototype.onDispatch = function (payload) {
        this.hook.execute(payload, this.kontext);
    };
    SignalHook.prototype.attach = function () {
        this.signal.addListener(this.listener);
    };
    SignalHook.prototype.dettach = function () {
        this.signal.removeListener(this.listener);
    };
    SignalHook.prototype.runOnce = function () {
        this.listener = new signals.SignalListener(this.onDispatch, this, true);
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
            signal = this.signals[name] = new signals.SignalDispatcher();
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

},{"kola-signals":15}],15:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hcHAuanMiLCJidWlsZC9jb21tYW5kcy5qcyIsImJ1aWxkL2Zvb3Rlci9hcHAuanMiLCJidWlsZC9mb290ZXIvdmlld3MvRm9vdGVyLmpzIiwiYnVpbGQvaGVhZGVyL2FwcC5qcyIsImJ1aWxkL2hlYWRlci92aWV3cy9IZWFkZXIuanMiLCJidWlsZC9tYWluL2FwcC5qcyIsImJ1aWxkL21haW4vdmlld3MvTWFpbi5qcyIsImJ1aWxkL21haW4vdmlld3MvVG9kby5qcyIsImJ1aWxkL21vZGVscy5qcyIsImJ1aWxkL3ZpZXdzL1RvZG9BcHAuanMiLCJub2RlX21vZHVsZXMva29sYS1ob29rcy9kaXN0L2hvb2tzLmpzIiwibm9kZV9tb2R1bGVzL2tvbGEtc2lnbmFscy9kaXN0L3NpZ25hbHMuanMiLCJub2RlX21vZHVsZXMva29sYS9kaXN0L2tvbGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgaG9va3MgPSByZXF1aXJlKCdrb2xhLWhvb2tzJyk7XG52YXIgbW9kZWxzID0gcmVxdWlyZSgnLi9tb2RlbHMnKTtcbnZhciBtYWluID0gcmVxdWlyZSgnLi9tYWluL2FwcCcpO1xudmFyIGhlYWRlciA9IHJlcXVpcmUoJy4vaGVhZGVyL2FwcCcpO1xudmFyIGZvb3RlciA9IHJlcXVpcmUoJy4vZm9vdGVyL2FwcCcpO1xudmFyIGNvbW1hbmRzID0gcmVxdWlyZSgnLi9jb21tYW5kcycpO1xudmFyIFRvZG9BcHBWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9Ub2RvQXBwJyk7XG52YXIgVG9kb0FwcCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFRvZG9BcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVG9kb0FwcCgpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uS29udGV4dCA9IGZ1bmN0aW9uIChrb250ZXh0LCBvcHRzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMudG9kb1ZpZXcgPSBuZXcgVG9kb0FwcFZpZXcoKTtcbiAgICAgICAga29udGV4dC5zZXRTaWduYWwoJ2luaXQnLCBob29rcy5leGVjdXRlcyhbY29tbWFuZHMuaW5pdGlhbGl6ZWQsIGNvbW1hbmRzLnNldFN0YXRlTWFpbkFuZEZvb3Rlcl0pKTtcbiAgICAgICAga29udGV4dC5zZXRTaWduYWwoJ3RvZG8uYWRkJywgaG9va3MuZXhlY3V0ZXMoW2NvbW1hbmRzLmFkZFRvZG8sIGNvbW1hbmRzLnNldFN0YXRlTWFpbkFuZEZvb3Rlcl0pKTtcbiAgICAgICAga29udGV4dC5zZXRTaWduYWwoJ3RvZG8ucmVtb3ZlJyk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2RvLmNvbXBsZXRlJyk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2Rvcy5jbGVhci5jb21wbGV0ZWQnKTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndG9kb3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IG1vZGVscy5Ub2RvcygpO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBrb250ZXh0LnNldEluc3RhbmNlKCd0b2RvJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBtb2RlbHMuVG9kbygpO1xuICAgICAgICB9KTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndmlldy5mb290ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMudG9kb1ZpZXcuZm9vdGVyO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBrb250ZXh0LnNldEluc3RhbmNlKCd2aWV3Lm1haW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMudG9kb1ZpZXcubWFpbjtcbiAgICAgICAgfSkuYXNTaW5nbGV0b24oKTtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5vbktvbnRleHQuY2FsbCh0aGlzLCBrb250ZXh0LCBvcHRzKTtcbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudG9kb1ZpZXcuYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucyk7XG4gICAgICAgIHRoaXMuaGVhZGVyQXBwID0gbmV3IGhlYWRlci5BcHAodGhpcykuc3RhcnQodGhpcy50b2RvVmlldy5oZWFkZXIpO1xuICAgICAgICB0aGlzLmZvb3RlckFwcCA9IG5ldyBmb290ZXIuQXBwKHRoaXMpLnN0YXJ0KHRoaXMudG9kb1ZpZXcuZm9vdGVyKTtcbiAgICAgICAgdGhpcy5tYWluQXBwID0gbmV3IG1haW4uQXBwKHRoaXMpLnN0YXJ0KHRoaXMudG9kb1ZpZXcubWFpbik7XG4gICAgICAgIHRoaXMua29udGV4dC5nZXRTaWduYWwoJ2luaXQnKS5kaXNwYXRjaCgpO1xuICAgIH07XG4gICAgVG9kb0FwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRvZG9WaWV3LnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmhlYWRlckFwcC5zdG9wKCk7XG4gICAgICAgIHRoaXMuZm9vdGVyQXBwLnN0b3AoKTtcbiAgICAgICAgdGhpcy5tYWluQXBwLnN0b3AoKTtcbiAgICB9O1xuICAgIHJldHVybiBUb2RvQXBwO1xufSkoa29sYS5BcHApO1xuZXhwb3J0cy5Ub2RvQXBwID0gVG9kb0FwcDtcbnZhciB0b2RvQXBwID0gbmV3IFRvZG9BcHAoKS5zdGFydCh3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZG9hcHAnKSk7XG4iLCJmdW5jdGlvbiBpbml0aWFsaXplZChwYXlsb2FkLCBrb250ZXh0KSB7XG59XG5leHBvcnRzLmluaXRpYWxpemVkID0gaW5pdGlhbGl6ZWQ7XG5mdW5jdGlvbiBhZGRUb2RvKHBheWxvYWQsIGtvbnRleHQpIHtcbiAgICB2YXIgdG9kb3MgPSBrb250ZXh0LmdldEluc3RhbmNlKCd0b2RvcycpO1xuICAgIHRvZG9zLmFkZFRvZG8ocGF5bG9hZCk7XG59XG5leHBvcnRzLmFkZFRvZG8gPSBhZGRUb2RvO1xuZnVuY3Rpb24gc2V0U3RhdGVNYWluQW5kRm9vdGVyKHBheWxvYWQsIGtvbnRleHQpIHtcbiAgICB2YXIgZm9vdGVyID0ga29udGV4dC5nZXRJbnN0YW5jZSgndmlldy5mb290ZXInKTtcbiAgICB2YXIgbWFpbiA9IGtvbnRleHQuZ2V0SW5zdGFuY2UoJ3ZpZXcubWFpbicpO1xuICAgIHZhciB0b2RvcyA9IGtvbnRleHQuZ2V0SW5zdGFuY2UoJ3RvZG9zJyk7XG4gICAgdmFyIHN0YXRlID0gdG9kb3Muc2l6ZSgpID4gMCA/ICdoYXNUb2RvcycgOiAnbm9Ub2Rvcyc7XG4gICAgZm9vdGVyLmNsYXNzTmFtZSA9IG1haW4uY2xhc3NOYW1lID0gc3RhdGU7XG59XG5leHBvcnRzLnNldFN0YXRlTWFpbkFuZEZvb3RlciA9IHNldFN0YXRlTWFpbkFuZEZvb3RlcjtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xuLyoqXG4gKiBDcmVhdGVkIGJ5IGpjYWJyZXNvcyBvbiAzLzEzLzE1LlxuICovXG52YXIga29sYSA9IHJlcXVpcmUoJ2tvbGEnKTtcbnZhciBGb290ZXIgPSByZXF1aXJlKCcuL3ZpZXdzL0Zvb3RlcicpO1xudmFyIEFwcCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFwcCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBcHAoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBBcHAucHJvdG90eXBlLm9uU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3RlcigpO1xuICAgICAgICB0aGlzLmZvb3Rlci5hcHBlbmRUbyh0aGlzLnN0YXJ0dXBPcHRpb25zKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgcmV0dXJuIEFwcDtcbn0pKGtvbGEuQXBwKTtcbmV4cG9ydHMuQXBwID0gQXBwO1xuIiwidmFyIEZvb3RlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRm9vdGVyKCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB0aGlzLnRvZG9Db3VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgdGhpcy50b2RvQ291bnQuc2V0QXR0cmlidXRlKCdpZCcsICd0b2RvLWNvdW50Jyk7XG4gICAgICAgIHZhciBuMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0cm9uZycpO1xuICAgICAgICB2YXIgbjIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnMCcpO1xuICAgICAgICB2YXIgbjMgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIGl0ZW0gbGVmdCcpO1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICB0aGlzLmZpbHRlcnMuc2V0QXR0cmlidXRlKCdpZCcsICdmaWx0ZXJzJyk7XG4gICAgICAgIHZhciBuNSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHZhciBuNiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbjYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZWxlY3RlZCcpO1xuICAgICAgICBuNi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIy8nKTtcbiAgICAgICAgdmFyIG43ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0FsbCcpO1xuICAgICAgICB2YXIgbjggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgbjkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIG45LnNldEF0dHJpYnV0ZSgnaHJlZicsICcjL2FjdGl2ZScpO1xuICAgICAgICB2YXIgbjEwID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0FjdGl2ZScpO1xuICAgICAgICB2YXIgbjExID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgdmFyIG4xMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbjEyLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjL2NvbXBsZXRlZCcpO1xuICAgICAgICB2YXIgbjEzID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0NvbXBsZXRlZCcpO1xuICAgICAgICB0aGlzLmNsZWFyQ29tcGxldGVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIHRoaXMuY2xlYXJDb21wbGV0ZWQuc2V0QXR0cmlidXRlKCdpZCcsICdjbGVhci1jb21wbGV0ZWQnKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLnRvZG9Db3VudCk7XG4gICAgICAgIHRoaXMudG9kb0NvdW50LmFwcGVuZENoaWxkKG4xKTtcbiAgICAgICAgbjEuYXBwZW5kQ2hpbGQobjIpO1xuICAgICAgICB0aGlzLnRvZG9Db3VudC5hcHBlbmRDaGlsZChuMyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5maWx0ZXJzKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzLmFwcGVuZENoaWxkKG41KTtcbiAgICAgICAgbjUuYXBwZW5kQ2hpbGQobjYpO1xuICAgICAgICBuNi5hcHBlbmRDaGlsZChuNyk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5hcHBlbmRDaGlsZChuOCk7XG4gICAgICAgIG44LmFwcGVuZENoaWxkKG45KTtcbiAgICAgICAgbjkuYXBwZW5kQ2hpbGQobjEwKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzLmFwcGVuZENoaWxkKG4xMSk7XG4gICAgICAgIG4xMS5hcHBlbmRDaGlsZChuMTIpO1xuICAgICAgICBuMTIuYXBwZW5kQ2hpbGQobjEzKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLmNsZWFyQ29tcGxldGVkKTtcbiAgICB9XG4gICAgRm9vdGVyLnByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBGb290ZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIEZvb3Rlcjtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IEZvb3RlcjtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xuLyoqXG4gKiBDcmVhdGVkIGJ5IGpjYWJyZXNvcyBvbiAzLzEzLzE1LlxuICovXG52YXIga29sYSA9IHJlcXVpcmUoJ2tvbGEnKTtcbnZhciBIZWFkZXIgPSByZXF1aXJlKCcuL3ZpZXdzL0hlYWRlcicpO1xudmFyIEFwcCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFwcCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBcHAoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBBcHAucHJvdG90eXBlLm9uS29udGV4dCA9IGZ1bmN0aW9uIChrb250ZXh0KSB7XG4gICAgICAgIHRoaXMuYWRkVG9kbyA9IGtvbnRleHQuZ2V0U2lnbmFsKCd0b2RvLmFkZCcpO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmhlYWRlciA9IG5ldyBIZWFkZXIoKTtcbiAgICAgICAgdGhpcy5oZWFkZXIuYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucyk7XG4gICAgICAgIHRoaXMuaGVhZGVyLm5ld1RvZG8uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlEb3duLmJpbmQodGhpcykpO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vbktleURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgIHZhciBkZXNjID0gdGhpcy5oZWFkZXIubmV3VG9kby52YWx1ZTtcbiAgICAgICAgICAgIHZhciB0b2RvID0gdGhpcy5rb250ZXh0LmdldEluc3RhbmNlKCd0b2RvJyk7XG4gICAgICAgICAgICB0b2RvLnNldERlc2NyaXB0aW9uKGRlc2MpO1xuICAgICAgICAgICAgdGhpcy5hZGRUb2RvLmRpc3BhdGNoKHRvZG8pO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXIubmV3VG9kby52YWx1ZSA9IG51bGw7IC8vY2xlYXJcbiAgICAgICAgfVxuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyLnJlbW92ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIEFwcDtcbn0pKGtvbGEuQXBwKTtcbmV4cG9ydHMuQXBwID0gQXBwO1xuIiwidmFyIEhlYWRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSGVhZGVyKCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB2YXIgbjAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB2YXIgbjEgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgndG9kb3MnKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvLnNldEF0dHJpYnV0ZSgnaWQnLCAnbmV3LXRvZG8nKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnV2hhdCBuZWVkcyB0byBiZSBkb25lPycpO1xuICAgICAgICB0aGlzLm5ld1RvZG8uc2V0QXR0cmlidXRlKCdhdXRvZm9jdXMnLCAnJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2gobjApO1xuICAgICAgICBuMC5hcHBlbmRDaGlsZChuMSk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5uZXdUb2RvKTtcbiAgICB9XG4gICAgSGVhZGVyLnByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBIZWFkZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIEhlYWRlcjtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlcjtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xuLyoqXG4gKiBDcmVhdGVkIGJ5IGpjYWJyZXNvcyBvbiAzLzEzLzE1LlxuICovXG52YXIga29sYSA9IHJlcXVpcmUoJ2tvbGEnKTtcbnZhciBzaWduYWxzID0gcmVxdWlyZSgna29sYS1zaWduYWxzJyk7XG52YXIgTWFpbiA9IHJlcXVpcmUoJy4vdmlld3MvTWFpbicpO1xudmFyIFRvZG8gPSByZXF1aXJlKCcuL3ZpZXdzL1RvZG8nKTtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1haW4gPSBuZXcgTWFpbigpO1xuICAgICAgICB0aGlzLm1haW4uYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucyk7XG4gICAgICAgIHRoaXMudG9kb3MgPSB0aGlzLmtvbnRleHQuZ2V0SW5zdGFuY2UoJ3RvZG9zJyk7XG4gICAgICAgIHRoaXMub25Ub2RvQWRkID0gbmV3IHNpZ25hbHMuU2lnbmFsTGlzdGVuZXIodGhpcy50b2RvQWRkZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLnRvZG9zLm9uQWRkVG9kby5hZGRMaXN0ZW5lcih0aGlzLm9uVG9kb0FkZCk7XG4gICAgICAgIHRoaXMub25Ub2RvUmVtb3ZlID0gbmV3IHNpZ25hbHMuU2lnbmFsTGlzdGVuZXIodGhpcy50b2RvUmVtb3ZlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMudG9kb3Mub25SZW1vdmVUb2RvLmFkZExpc3RlbmVyKHRoaXMub25Ub2RvUmVtb3ZlKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUudG9kb0FkZGVkID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciB0b2RvID0gbmV3IFRvZG8oKTtcbiAgICAgICAgdG9kby5kZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHZhbHVlLmdldERlc2NyaXB0aW9uKCk7XG4gICAgICAgIHRvZG8uZWRpdC52YWx1ZSA9IHZhbHVlLmdldERlc2NyaXB0aW9uKCk7XG4gICAgICAgIHRvZG8uY29tcGxldGVkLmNoZWNrZWQgPSB2YWx1ZS5nZXRDb21wbGV0ZWQoKTtcbiAgICAgICAgdG9kby5hcHBlbmRUbyh0aGlzLm1haW4udG9kb0xpc3QpO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS50b2RvUmVtb3ZlZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubWFpbi5yZW1vdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBNYWluID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYWluKCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMudG9nZ2xlQWxsLnNldEF0dHJpYnV0ZSgnaWQnLCAndG9nZ2xlLWFsbCcpO1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgICAgdmFyIG4xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgbjEuc2V0QXR0cmlidXRlKCdmb3InLCAndG9nZ2xlLWFsbCcpO1xuICAgICAgICB2YXIgbjIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTWFyayBhbGwgYXMgY29tcGxldGUnKTtcbiAgICAgICAgdGhpcy50b2RvTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgIHRoaXMudG9kb0xpc3Quc2V0QXR0cmlidXRlKCdpZCcsICd0b2RvLWxpc3QnKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLnRvZ2dsZUFsbCk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2gobjEpO1xuICAgICAgICBuMS5hcHBlbmRDaGlsZChuMik7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2RvTGlzdCk7XG4gICAgfVxuICAgIE1haW4ucHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE1haW4ucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIE1haW47XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBNYWluO1xuIiwidmFyIFRvZG8gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRvZG8oKSB7XG4gICAgICAgIHZhciBkb21lcklkID0gKGRvY3VtZW50W1wiX2RvbWVySWRfXCJdID09IHVuZGVmaW5lZCkgPyBkb2N1bWVudFtcIl9kb21lcklkX1wiXSA9IDAgOiBkb2N1bWVudFtcIl9kb21lcklkX1wiXSsrO1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB0aGlzLnRvZG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB0aGlzLnRvZG8uc2V0QXR0cmlidXRlKCdpZCcsICd0b2RvXycgKyBkb21lcklkKTtcbiAgICAgICAgdmFyIG4xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG4xLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndmlldycpO1xuICAgICAgICB0aGlzLmNvbXBsZXRlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMuY29tcGxldGVkLnNldEF0dHJpYnV0ZSgnaWQnLCAnY29tcGxldGVkXycgKyBkb21lcklkKTtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0b2dnbGUnKTtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgIHRoaXMuY29tcGxldGVkLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICcnKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24uc2V0QXR0cmlidXRlKCdpZCcsICdkZXNjcmlwdGlvbl8nICsgZG9tZXJJZCk7XG4gICAgICAgIHZhciBuNCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdUYXN0ZSBKYXZhU2NyaXB0Jyk7XG4gICAgICAgIHRoaXMuZGVzdHJveSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kuc2V0QXR0cmlidXRlKCdpZCcsICdkZXN0cm95XycgKyBkb21lcklkKTtcbiAgICAgICAgdGhpcy5kZXN0cm95LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZGVzdHJveScpO1xuICAgICAgICB0aGlzLmVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICB0aGlzLmVkaXQuc2V0QXR0cmlidXRlKCdpZCcsICdlZGl0XycgKyBkb21lcklkKTtcbiAgICAgICAgdGhpcy5lZGl0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZWRpdCcpO1xuICAgICAgICB0aGlzLmVkaXQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdDcmVhdGUgYSBUb2RvTVZDIHRlbXBsYXRlJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2RvKTtcbiAgICAgICAgdGhpcy50b2RvLmFwcGVuZENoaWxkKG4xKTtcbiAgICAgICAgbjEuYXBwZW5kQ2hpbGQodGhpcy5jb21wbGV0ZWQpO1xuICAgICAgICBuMS5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChuNCk7XG4gICAgICAgIG4xLmFwcGVuZENoaWxkKHRoaXMuZGVzdHJveSk7XG4gICAgICAgIHRoaXMudG9kby5hcHBlbmRDaGlsZCh0aGlzLmVkaXQpO1xuICAgIH1cbiAgICBUb2RvLnByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBUb2RvLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBUb2RvO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gVG9kbztcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIHNpZ25hbHMgPSByZXF1aXJlKCdrb2xhLXNpZ25hbHMnKTtcbnZhciBUb2RvID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUb2RvKCkge1xuICAgICAgICB0aGlzLm9uRGVzY3JpcHRpb24gPSBuZXcgc2lnbmFscy5TaWduYWxEaXNwYXRjaGVyKCk7XG4gICAgICAgIHRoaXMub25Db21wbGV0ZWQgPSBuZXcgc2lnbmFscy5TaWduYWxEaXNwYXRjaGVyKCk7XG4gICAgfVxuICAgIFRvZG8ucHJvdG90eXBlLnNldERlc2NyaXB0aW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5vbkRlc2NyaXB0aW9uLmRpc3BhdGNoKHZhbHVlKTtcbiAgICB9O1xuICAgIFRvZG8ucHJvdG90eXBlLmdldERlc2NyaXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbjtcbiAgICB9O1xuICAgIFRvZG8ucHJvdG90eXBlLnNldENvbXBsZXRlZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmNvbXBsZXRlZCA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9uQ29tcGxldGVkLmRpc3BhdGNoKHZhbHVlKTtcbiAgICB9O1xuICAgIFRvZG8ucHJvdG90eXBlLmdldENvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGVkO1xuICAgIH07XG4gICAgcmV0dXJuIFRvZG87XG59KSgpO1xuZXhwb3J0cy5Ub2RvID0gVG9kbztcbnZhciBUb2RvcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVG9kb3MoKSB7XG4gICAgICAgIHRoaXMub25BZGRUb2RvID0gbmV3IHNpZ25hbHMuU2lnbmFsRGlzcGF0Y2hlcigpO1xuICAgICAgICB0aGlzLm9uUmVtb3ZlVG9kbyA9IG5ldyBzaWduYWxzLlNpZ25hbERpc3BhdGNoZXIoKTtcbiAgICAgICAgdGhpcy50b2RvcyA9IFtdO1xuICAgIH1cbiAgICBUb2Rvcy5wcm90b3R5cGUuYWRkVG9kbyA9IGZ1bmN0aW9uICh0b2RvKSB7XG4gICAgICAgIHRoaXMudG9kb3MucHVzaCh0b2RvKTtcbiAgICAgICAgdGhpcy5vbkFkZFRvZG8uZGlzcGF0Y2godG9kbyk7XG4gICAgfTtcbiAgICBUb2Rvcy5wcm90b3R5cGUucmVtb3ZlVG9kbyA9IGZ1bmN0aW9uICh0b2RvKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRvZG8gPT0gdGhpcy50b2Rvc1tpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9kb3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMub25SZW1vdmVUb2RvLmRpc3BhdGNoKHRvZG8pO1xuICAgIH07XG4gICAgVG9kb3MucHJvdG90eXBlLmdldENvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvZG9zQ29tcGxldGVkID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMudG9kb3NbaV0uZ2V0Q29tcGxldGVkKCkpXG4gICAgICAgICAgICAgICAgdG9kb3NDb21wbGV0ZWQucHVzaCh0aGlzLnRvZG9zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9kb3NDb21wbGV0ZWQ7XG4gICAgfTtcbiAgICBUb2Rvcy5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b2Rvcy5zcGxpY2UoMCk7XG4gICAgfTtcbiAgICBUb2Rvcy5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9kb3MubGVuZ3RoO1xuICAgIH07XG4gICAgcmV0dXJuIFRvZG9zO1xufSkoKTtcbmV4cG9ydHMuVG9kb3MgPSBUb2RvcztcbiIsInZhciBUb2RvQXBwID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUb2RvQXBwKCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB0aGlzLmhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpO1xuICAgICAgICB0aGlzLmhlYWRlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2hlYWRlcicpO1xuICAgICAgICB0aGlzLm1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWN0aW9uJyk7XG4gICAgICAgIHRoaXMubWFpbi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21haW4nKTtcbiAgICAgICAgdGhpcy5mb290ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb290ZXInKTtcbiAgICAgICAgdGhpcy5mb290ZXIuc2V0QXR0cmlidXRlKCdpZCcsICdmb290ZXInKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLmhlYWRlcik7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5tYWluKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLmZvb3Rlcik7XG4gICAgfVxuICAgIFRvZG9BcHAucHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIFRvZG9BcHA7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBUb2RvQXBwO1xuIiwidmFyIEV4ZWN1dGlvbkNoYWluVGltZW91dCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXhlY3V0aW9uQ2hhaW5UaW1lb3V0KGtvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJFeGVjdXRpb25DaGFpblRpbWVvdXRcIjtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gXCJFeGVjdXRpb24gdGltZW91dFwiO1xuICAgICAgICB0aGlzLmtvbW1hbmQgPSBrb21tYW5kO1xuICAgIH1cbiAgICByZXR1cm4gRXhlY3V0aW9uQ2hhaW5UaW1lb3V0O1xufSkoKTtcbmV4cG9ydHMuRXhlY3V0aW9uQ2hhaW5UaW1lb3V0ID0gRXhlY3V0aW9uQ2hhaW5UaW1lb3V0O1xudmFyIEV4ZWN1dGlvbkNoYWluID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFeGVjdXRpb25DaGFpbihwYXlsb2FkLCBrb250ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgICAgIHRoaXMua29udGV4dCA9IGtvbnRleHQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5leGVjdXRlZCA9IHt9O1xuICAgIH1cbiAgICBFeGVjdXRpb25DaGFpbi5wcm90b3R5cGUubm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBFeGVjdXRpb25DaGFpbi5wcm90b3R5cGUub25Eb25lID0gZnVuY3Rpb24gKGluZGV4LCBlcnJvcikge1xuICAgICAgICAvL2lmIHRoaXMgaW5kZXggaXMgZXF1YWwgdG8gY3VycmVudEluZGV4IHRoZW4gY2FsbCBuZXh0XG4gICAgICAgIC8vaWYgbm90LCBpZ25vcmUsIGJ1dCBpZiBpdCBoYXMgYW4gZXJyb3IsIGxldCBpdCBjYWxsIG9uIGVycm9yXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIGlmIChlcnJvciAmJiB0aGlzLm9wdGlvbnMuZXJyb3JDb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZXJyb3JDb21tYW5kKGVycm9yLCB0aGlzLmtvbnRleHQpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5mcmFnaWxlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4Kys7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW4ucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmV4ZWN1dGVkW3RoaXMuY3VycmVudEluZGV4XSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4IDwgdGhpcy5vcHRpb25zLmNvbW1hbmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNvbW1hbmQgPSB0aGlzLm9wdGlvbnMuY29tbWFuZHNbdGhpcy5jdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgdmFyIGRvbmU7XG4gICAgICAgICAgICBpZiAoY29tbWFuZC5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgZG9uZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5vbkRvbmUoX3RoaXMuY3VycmVudEluZGV4LCBlcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgb25UaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5vbkRvbmUoX3RoaXMuY3VycmVudEluZGV4LCBuZXcgRXhlY3V0aW9uQ2hhaW5UaW1lb3V0KGNvbW1hbmQpKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dElkID0gc2V0VGltZW91dChvblRpbWVvdXQsIHRoaXMub3B0aW9ucy50aW1lb3V0KTtcbiAgICAgICAgICAgICAgICBjb21tYW5kKHRoaXMucGF5bG9hZCwgdGhpcy5rb250ZXh0LCBkb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBjb21tYW5kKHRoaXMucGF5bG9hZCwgdGhpcy5rb250ZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCsrO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5leGVjdXRlZFt0aGlzLmN1cnJlbnRJbmRleF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gRXhlY3V0aW9uQ2hhaW47XG59KSgpO1xuZXhwb3J0cy5FeGVjdXRpb25DaGFpbiA9IEV4ZWN1dGlvbkNoYWluO1xudmFyIEV4ZWN1dGlvbkNoYWluRmFjdG9yeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXhlY3V0aW9uQ2hhaW5GYWN0b3J5KGNvbW1hbmRDaGFpbikge1xuICAgICAgICB0aGlzLmNvbW1hbmRDaGFpbiA9IGNvbW1hbmRDaGFpbjtcbiAgICB9XG4gICAgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5LnByb3RvdHlwZS5icmVha0NoYWluT25FcnJvciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmNoYWluQnJlYWtzT25FcnJvciA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEV4ZWN1dGlvbkNoYWluRmFjdG9yeS5wcm90b3R5cGUub25FcnJvciA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgIHRoaXMub25FcnJvckNvbW1hbmQgPSBjb21tYW5kO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEV4ZWN1dGlvbkNoYWluRmFjdG9yeS5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uIChtcykge1xuICAgICAgICB0aGlzLnRpbWVvdXRNcyA9IG1zO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEV4ZWN1dGlvbkNoYWluRmFjdG9yeS5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uIChwYXlsb2FkLCBrb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXcgRXhlY3V0aW9uQ2hhaW4ocGF5bG9hZCwga29udGV4dCwge1xuICAgICAgICAgICAgXCJjb21tYW5kc1wiOiB0aGlzLmNvbW1hbmRDaGFpbixcbiAgICAgICAgICAgIFwiZXJyb3JDb21tYW5kXCI6IHRoaXMub25FcnJvckNvbW1hbmQsXG4gICAgICAgICAgICBcImZyYWdpbGVcIjogdGhpcy5jaGFpbkJyZWFrc09uRXJyb3IsXG4gICAgICAgICAgICBcInRpbWVvdXRcIjogdGhpcy50aW1lb3V0TXNcbiAgICAgICAgfSkubm93KCk7XG4gICAgfTtcbiAgICByZXR1cm4gRXhlY3V0aW9uQ2hhaW5GYWN0b3J5O1xufSkoKTtcbmV4cG9ydHMuRXhlY3V0aW9uQ2hhaW5GYWN0b3J5ID0gRXhlY3V0aW9uQ2hhaW5GYWN0b3J5O1xuZnVuY3Rpb24gZXhlY3V0ZXMoa29tbWFuZCkge1xuICAgIHJldHVybiBuZXcgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5KGtvbW1hbmQpO1xufVxuZXhwb3J0cy5leGVjdXRlcyA9IGV4ZWN1dGVzO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGpjYWJyZXNvcyBvbiAyLzE1LzE0LlxuICovXG52YXIgc2lnbmFsQ291bnQgPSAwO1xuZnVuY3Rpb24gZ2VuZXJhdGVTaWduYWxJZCgpIHtcbiAgICB2YXIgbmV4dElkID0gc2lnbmFsQ291bnQrKztcbiAgICByZXR1cm4gbmV4dElkO1xufVxudmFyIFNpZ25hbERpc3BhdGNoZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNpZ25hbERpc3BhdGNoZXIoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgICAgIHRoaXMubnVtTGlzdGVuZXJzID0gMDtcbiAgICB9XG4gICAgU2lnbmFsRGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbbGlzdGVuZXIuaWRdID0gbGlzdGVuZXI7XG4gICAgICAgIHRoaXMubnVtTGlzdGVuZXJzKys7XG4gICAgfTtcbiAgICBTaWduYWxEaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1tsaXN0ZW5lci5pZF0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubnVtTGlzdGVuZXJzLS07XG4gICAgfTtcbiAgICBTaWduYWxEaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgICAgIHRoaXMubnVtTGlzdGVuZXJzID0gMDtcbiAgICB9O1xuICAgIFNpZ25hbERpc3BhdGNoZXIucHJvdG90eXBlLmdldExpc3RlbmVyc0xlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtTGlzdGVuZXJzO1xuICAgIH07XG4gICAgU2lnbmFsRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2ggPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzVG1wID0ge307XG4gICAgICAgIGZvciAodmFyIGlkIGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyc1tpZF07XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5yZWNlaXZlU2lnbmFsKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5jYWxsT25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1RtcFtpZF0gPSB0aGlzLmxpc3RlbmVyc1tpZF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBsaXN0ZW5lcnNUbXA7XG4gICAgfTtcbiAgICByZXR1cm4gU2lnbmFsRGlzcGF0Y2hlcjtcbn0pKCk7XG5leHBvcnRzLlNpZ25hbERpc3BhdGNoZXIgPSBTaWduYWxEaXNwYXRjaGVyO1xudmFyIFNpZ25hbExpc3RlbmVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaWduYWxMaXN0ZW5lcihjYWxsYmFjaywgdGFyZ2V0LCBjYWxsT25jZSkge1xuICAgICAgICB0aGlzLmlkID0gZ2VuZXJhdGVTaWduYWxJZCgpO1xuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLmNhbGxPbmNlID0gY2FsbE9uY2U7XG4gICAgfVxuICAgIFNpZ25hbExpc3RlbmVyLnByb3RvdHlwZS5yZWNlaXZlU2lnbmFsID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgdGhpcy5jYWxsYmFjay5jYWxsKHRoaXMudGFyZ2V0LCBwYXlsb2FkKTtcbiAgICB9O1xuICAgIHJldHVybiBTaWduYWxMaXN0ZW5lcjtcbn0pKCk7XG5leHBvcnRzLlNpZ25hbExpc3RlbmVyID0gU2lnbmFsTGlzdGVuZXI7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgc3RhdGljZnVuY3Rpb24gb24gOC8yMC8xNC5cbiAqL1xudmFyIHNpZ25hbHMgPSByZXF1aXJlKCdrb2xhLXNpZ25hbHMnKTtcbnZhciBLb250ZXh0RmFjdG9yeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gS29udGV4dEZhY3RvcnkoZ2VuZXJhdG9yKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gdGhpcy5nZXRJbnN0YW5jZSA9IGdlbmVyYXRvcjtcbiAgICB9XG4gICAgS29udGV4dEZhY3RvcnkucHJvdG90eXBlLmFzU2luZ2xldG9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5zaW5nbGVJbnN0YW5jZSlcbiAgICAgICAgICAgICAgICBfdGhpcy5zaW5nbGVJbnN0YW5jZSA9IF90aGlzLmdlbmVyYXRvcigpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnNpbmdsZUluc3RhbmNlO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIEtvbnRleHRGYWN0b3J5O1xufSkoKTtcbmV4cG9ydHMuS29udGV4dEZhY3RvcnkgPSBLb250ZXh0RmFjdG9yeTtcbnZhciBTaWduYWxIb29rID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaWduYWxIb29rKGtvbnRleHQsIHNpZ25hbCwgaG9vaykge1xuICAgICAgICB0aGlzLmtvbnRleHQgPSBrb250ZXh0O1xuICAgICAgICB0aGlzLnNpZ25hbCA9IHNpZ25hbDtcbiAgICAgICAgdGhpcy5ob29rID0gaG9vaztcbiAgICAgICAgdGhpcy5saXN0ZW5lciA9IG5ldyBzaWduYWxzLlNpZ25hbExpc3RlbmVyKHRoaXMub25EaXNwYXRjaCwgdGhpcyk7XG4gICAgfVxuICAgIFNpZ25hbEhvb2sucHJvdG90eXBlLm9uRGlzcGF0Y2ggPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICB0aGlzLmhvb2suZXhlY3V0ZShwYXlsb2FkLCB0aGlzLmtvbnRleHQpO1xuICAgIH07XG4gICAgU2lnbmFsSG9vay5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNpZ25hbC5hZGRMaXN0ZW5lcih0aGlzLmxpc3RlbmVyKTtcbiAgICB9O1xuICAgIFNpZ25hbEhvb2sucHJvdG90eXBlLmRldHRhY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2lnbmFsLnJlbW92ZUxpc3RlbmVyKHRoaXMubGlzdGVuZXIpO1xuICAgIH07XG4gICAgU2lnbmFsSG9vay5wcm90b3R5cGUucnVuT25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lciA9IG5ldyBzaWduYWxzLlNpZ25hbExpc3RlbmVyKHRoaXMub25EaXNwYXRjaCwgdGhpcywgdHJ1ZSk7XG4gICAgfTtcbiAgICByZXR1cm4gU2lnbmFsSG9vaztcbn0pKCk7XG5leHBvcnRzLlNpZ25hbEhvb2sgPSBTaWduYWxIb29rO1xudmFyIEtvbnRleHRJbXBsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBLb250ZXh0SW1wbChwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgICAgICB0aGlzLnNpZ25hbEhvb2tzID0gW107XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzID0ge307XG4gICAgfVxuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5oYXNTaWduYWwgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaWduYWxzW25hbWVdICE9IG51bGw7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuc2V0U2lnbmFsID0gZnVuY3Rpb24gKG5hbWUsIGhvb2spIHtcbiAgICAgICAgdmFyIHNpZ25hbCA9IHRoaXMuZ2V0U2lnbmFsKG5hbWUpO1xuICAgICAgICBpZiAoIXNpZ25hbClcbiAgICAgICAgICAgIHNpZ25hbCA9IHRoaXMuc2lnbmFsc1tuYW1lXSA9IG5ldyBzaWduYWxzLlNpZ25hbERpc3BhdGNoZXIoKTtcbiAgICAgICAgdmFyIHNpZ0hvb2s7XG4gICAgICAgIGlmIChob29rKSB7XG4gICAgICAgICAgICBzaWdIb29rID0gbmV3IFNpZ25hbEhvb2sodGhpcywgc2lnbmFsLCBob29rKTtcbiAgICAgICAgICAgIHRoaXMuc2lnbmFsSG9va3MucHVzaChzaWdIb29rKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2lnSG9vaztcbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5nZXRTaWduYWwgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgc2lnbmFsID0gdGhpcy5zaWduYWxzW25hbWVdO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXNpZ25hbCkge1xuICAgICAgICAgICAgc2lnbmFsID0gdGhpcy5wYXJlbnQuZ2V0U2lnbmFsKG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWduYWw7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuc2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAobmFtZSwgZmFjdG9yeSkge1xuICAgICAgICBpZiAoIWZhY3RvcnkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Vycm9yIHRyeWluZyB0byBkZWZpbmUgaW5zdGFuY2U6ICcgKyBuYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzW25hbWVdID0gbmV3IEtvbnRleHRGYWN0b3J5KGZhY3RvcnkpO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB0aGlzLmluc3RhbmNlc1tuYW1lXTtcbiAgICAgICAgaWYgKGZhY3RvcnkpXG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0SW5zdGFuY2UobmFtZSk7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaWduYWxIb29rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zaWduYWxIb29rc1tpXS5hdHRhY2goKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaWduYWxIb29rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zaWduYWxIb29rc1tpXS5kZXR0YWNoKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBLb250ZXh0SW1wbDtcbn0pKCk7XG5leHBvcnRzLktvbnRleHRJbXBsID0gS29udGV4dEltcGw7XG52YXIgQXBwID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBcHAocGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMua29udGV4dCA9IG5ldyBLb250ZXh0SW1wbCh0aGlzLnBhcmVudC5rb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmtvbnRleHQgPSBuZXcgS29udGV4dEltcGwoKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vbktvbnRleHQgPSBmdW5jdGlvbiAoa29udGV4dCwgb3B0cykge1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIHRoaXMuc3RhcnR1cE9wdGlvbnMgPSBvcHRzO1xuICAgICAgICB0aGlzLm9uS29udGV4dCh0aGlzLmtvbnRleHQsIG9wdHMpO1xuICAgICAgICB0aGlzLmtvbnRleHQuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5vblN0YXJ0KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMua29udGV4dC5zdG9wKCk7XG4gICAgICAgIHRoaXMub25TdG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgcmV0dXJuIEFwcDtcbn0pKCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiJdfQ==
