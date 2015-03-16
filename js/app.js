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
var signals = require('kola-signals');
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
        kontext.setSignal('todo.add', hooks.executes([commands.addTodo]));
        kontext.setSignal('todo.remove');
        kontext.setSignal('todo.complete');
        kontext.setSignal('todos.clear.completed');
        kontext.setInstance('todos', function () {
            return new models.Todos();
        }).asSingleton();
        kontext.setInstance('todo', function () {
            return new models.Todo();
        });
        kontext.setInstance('view', function () {
            return opts;
        }).asSingleton();
        _super.prototype.onKontext.call(this, kontext, opts);
    };
    TodoApp.prototype.onStart = function () {
        this.todoView = new TodoAppView();
        this.todoView.appendTo(this.startupOptions);
        this.todos = this.kontext.getInstance('todos');
        this.headerApp = new header.App(this).start(this.todoView.header);
        this.footerApp = new footer.App(this).start(this.todoView.footer);
        this.mainApp = new main.App(this).start(this.todoView.main);
        this.todosChanged = new signals.SignalListener(this.onTodosChange, this);
        this.todos.onAddTodo.addListener(this.todosChanged);
        this.todos.onRemoveTodo.addListener(this.todosChanged);
        this.onTodosChange();
    };
    TodoApp.prototype.onTodosChange = function () {
        if (this.todos.size() > 0) {
            this.todoView.footer.className = this.todoView.main.className = "hasTodos";
        }
        else {
            this.todoView.footer.className = this.todoView.main.className = "noTodos";
        }
    };
    TodoApp.prototype.onStop = function () {
        this.todoView.remove();
        this.headerApp.stop();
        this.footerApp.stop();
        this.mainApp.stop();
        this.todos.onAddTodo.removeListener(this.todosChanged);
        this.todos.onRemoveTodo.removeListener(this.todosChanged);
    };
    return TodoApp;
})(kola.App);
exports.TodoApp = TodoApp;
var todoApp = new TodoApp().start(window.document.getElementById('todoapp'));

},{"./commands":2,"./footer/app":3,"./header/app":5,"./main/app":7,"./models":10,"./views/TodoApp":11,"kola":14,"kola-hooks":12,"kola-signals":13}],2:[function(require,module,exports){
function addTodo(payload, kontext) {
    var todos = kontext.getInstance('todos');
    todos.addTodo(payload);
}
exports.addTodo = addTodo;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hcHAuanMiLCJidWlsZC9jb21tYW5kcy5qcyIsImJ1aWxkL2Zvb3Rlci9hcHAuanMiLCJidWlsZC9mb290ZXIvdmlld3MvRm9vdGVyLmpzIiwiYnVpbGQvaGVhZGVyL2FwcC5qcyIsImJ1aWxkL2hlYWRlci92aWV3cy9IZWFkZXIuanMiLCJidWlsZC9tYWluL2FwcC5qcyIsImJ1aWxkL21haW4vdmlld3MvTWFpbi5qcyIsImJ1aWxkL21haW4vdmlld3MvVG9kby5qcyIsImJ1aWxkL21vZGVscy5qcyIsImJ1aWxkL3ZpZXdzL1RvZG9BcHAuanMiLCJub2RlX21vZHVsZXMva29sYS1ob29rcy9kaXN0L2hvb2tzLmpzIiwibm9kZV9tb2R1bGVzL2tvbGEtc2lnbmFscy9kaXN0L3NpZ25hbHMuanMiLCJub2RlX21vZHVsZXMva29sYS9kaXN0L2tvbGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgc2lnbmFscyA9IHJlcXVpcmUoJ2tvbGEtc2lnbmFscycpO1xudmFyIGhvb2tzID0gcmVxdWlyZSgna29sYS1ob29rcycpO1xudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4vbW9kZWxzJyk7XG52YXIgbWFpbiA9IHJlcXVpcmUoJy4vbWFpbi9hcHAnKTtcbnZhciBoZWFkZXIgPSByZXF1aXJlKCcuL2hlYWRlci9hcHAnKTtcbnZhciBmb290ZXIgPSByZXF1aXJlKCcuL2Zvb3Rlci9hcHAnKTtcbnZhciBjb21tYW5kcyA9IHJlcXVpcmUoJy4vY29tbWFuZHMnKTtcbnZhciBUb2RvQXBwVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvVG9kb0FwcCcpO1xudmFyIFRvZG9BcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUb2RvQXBwLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFRvZG9BcHAoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBUb2RvQXBwLnByb3RvdHlwZS5vbktvbnRleHQgPSBmdW5jdGlvbiAoa29udGV4dCwgb3B0cykge1xuICAgICAgICBrb250ZXh0LnNldFNpZ25hbCgndG9kby5hZGQnLCBob29rcy5leGVjdXRlcyhbY29tbWFuZHMuYWRkVG9kb10pKTtcbiAgICAgICAga29udGV4dC5zZXRTaWduYWwoJ3RvZG8ucmVtb3ZlJyk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2RvLmNvbXBsZXRlJyk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2Rvcy5jbGVhci5jb21wbGV0ZWQnKTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndG9kb3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IG1vZGVscy5Ub2RvcygpO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBrb250ZXh0LnNldEluc3RhbmNlKCd0b2RvJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBtb2RlbHMuVG9kbygpO1xuICAgICAgICB9KTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndmlldycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRzO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLm9uS29udGV4dC5jYWxsKHRoaXMsIGtvbnRleHQsIG9wdHMpO1xuICAgIH07XG4gICAgVG9kb0FwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50b2RvVmlldyA9IG5ldyBUb2RvQXBwVmlldygpO1xuICAgICAgICB0aGlzLnRvZG9WaWV3LmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgICAgICB0aGlzLnRvZG9zID0gdGhpcy5rb250ZXh0LmdldEluc3RhbmNlKCd0b2RvcycpO1xuICAgICAgICB0aGlzLmhlYWRlckFwcCA9IG5ldyBoZWFkZXIuQXBwKHRoaXMpLnN0YXJ0KHRoaXMudG9kb1ZpZXcuaGVhZGVyKTtcbiAgICAgICAgdGhpcy5mb290ZXJBcHAgPSBuZXcgZm9vdGVyLkFwcCh0aGlzKS5zdGFydCh0aGlzLnRvZG9WaWV3LmZvb3Rlcik7XG4gICAgICAgIHRoaXMubWFpbkFwcCA9IG5ldyBtYWluLkFwcCh0aGlzKS5zdGFydCh0aGlzLnRvZG9WaWV3Lm1haW4pO1xuICAgICAgICB0aGlzLnRvZG9zQ2hhbmdlZCA9IG5ldyBzaWduYWxzLlNpZ25hbExpc3RlbmVyKHRoaXMub25Ub2Rvc0NoYW5nZSwgdGhpcyk7XG4gICAgICAgIHRoaXMudG9kb3Mub25BZGRUb2RvLmFkZExpc3RlbmVyKHRoaXMudG9kb3NDaGFuZ2VkKTtcbiAgICAgICAgdGhpcy50b2Rvcy5vblJlbW92ZVRvZG8uYWRkTGlzdGVuZXIodGhpcy50b2Rvc0NoYW5nZWQpO1xuICAgICAgICB0aGlzLm9uVG9kb3NDaGFuZ2UoKTtcbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uVG9kb3NDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRvZG9zLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMudG9kb1ZpZXcuZm9vdGVyLmNsYXNzTmFtZSA9IHRoaXMudG9kb1ZpZXcubWFpbi5jbGFzc05hbWUgPSBcImhhc1RvZG9zXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRvZG9WaWV3LmZvb3Rlci5jbGFzc05hbWUgPSB0aGlzLnRvZG9WaWV3Lm1haW4uY2xhc3NOYW1lID0gXCJub1RvZG9zXCI7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50b2RvVmlldy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5oZWFkZXJBcHAuc3RvcCgpO1xuICAgICAgICB0aGlzLmZvb3RlckFwcC5zdG9wKCk7XG4gICAgICAgIHRoaXMubWFpbkFwcC5zdG9wKCk7XG4gICAgICAgIHRoaXMudG9kb3Mub25BZGRUb2RvLnJlbW92ZUxpc3RlbmVyKHRoaXMudG9kb3NDaGFuZ2VkKTtcbiAgICAgICAgdGhpcy50b2Rvcy5vblJlbW92ZVRvZG8ucmVtb3ZlTGlzdGVuZXIodGhpcy50b2Rvc0NoYW5nZWQpO1xuICAgIH07XG4gICAgcmV0dXJuIFRvZG9BcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLlRvZG9BcHAgPSBUb2RvQXBwO1xudmFyIHRvZG9BcHAgPSBuZXcgVG9kb0FwcCgpLnN0YXJ0KHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9kb2FwcCcpKTtcbiIsImZ1bmN0aW9uIGFkZFRvZG8ocGF5bG9hZCwga29udGV4dCkge1xuICAgIHZhciB0b2RvcyA9IGtvbnRleHQuZ2V0SW5zdGFuY2UoJ3RvZG9zJyk7XG4gICAgdG9kb3MuYWRkVG9kbyhwYXlsb2FkKTtcbn1cbmV4cG9ydHMuYWRkVG9kbyA9IGFkZFRvZG87XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgRm9vdGVyID0gcmVxdWlyZSgnLi92aWV3cy9Gb290ZXInKTtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmZvb3RlciA9IG5ldyBGb290ZXIoKTtcbiAgICAgICAgdGhpcy5mb290ZXIuYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucyk7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBGb290ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZvb3RlcigpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy50b2RvQ291bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHRoaXMudG9kb0NvdW50LnNldEF0dHJpYnV0ZSgnaWQnLCAndG9kby1jb3VudCcpO1xuICAgICAgICB2YXIgbjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHJvbmcnKTtcbiAgICAgICAgdmFyIG4yID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzAnKTtcbiAgICAgICAgdmFyIG4zID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBpdGVtIGxlZnQnKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzLnNldEF0dHJpYnV0ZSgnaWQnLCAnZmlsdGVycycpO1xuICAgICAgICB2YXIgbjUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgbjYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIG42LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgbjYuc2V0QXR0cmlidXRlKCdocmVmJywgJyMvJyk7XG4gICAgICAgIHZhciBuNyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBbGwnKTtcbiAgICAgICAgdmFyIG44ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgdmFyIG45ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBuOS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIy9hY3RpdmUnKTtcbiAgICAgICAgdmFyIG4xMCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBY3RpdmUnKTtcbiAgICAgICAgdmFyIG4xMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHZhciBuMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIG4xMi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIy9jb21wbGV0ZWQnKTtcbiAgICAgICAgdmFyIG4xMyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdDb21wbGV0ZWQnKTtcbiAgICAgICAgdGhpcy5jbGVhckNvbXBsZXRlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLmNsZWFyQ29tcGxldGVkLnNldEF0dHJpYnV0ZSgnaWQnLCAnY2xlYXItY29tcGxldGVkJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2RvQ291bnQpO1xuICAgICAgICB0aGlzLnRvZG9Db3VudC5hcHBlbmRDaGlsZChuMSk7XG4gICAgICAgIG4xLmFwcGVuZENoaWxkKG4yKTtcbiAgICAgICAgdGhpcy50b2RvQ291bnQuYXBwZW5kQ2hpbGQobjMpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMuZmlsdGVycyk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5hcHBlbmRDaGlsZChuNSk7XG4gICAgICAgIG41LmFwcGVuZENoaWxkKG42KTtcbiAgICAgICAgbjYuYXBwZW5kQ2hpbGQobjcpO1xuICAgICAgICB0aGlzLmZpbHRlcnMuYXBwZW5kQ2hpbGQobjgpO1xuICAgICAgICBuOC5hcHBlbmRDaGlsZChuOSk7XG4gICAgICAgIG45LmFwcGVuZENoaWxkKG4xMCk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5hcHBlbmRDaGlsZChuMTEpO1xuICAgICAgICBuMTEuYXBwZW5kQ2hpbGQobjEyKTtcbiAgICAgICAgbjEyLmFwcGVuZENoaWxkKG4xMyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5jbGVhckNvbXBsZXRlZCk7XG4gICAgfVxuICAgIEZvb3Rlci5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRm9vdGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBGb290ZXI7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBGb290ZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgSGVhZGVyID0gcmVxdWlyZSgnLi92aWV3cy9IZWFkZXInKTtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vbktvbnRleHQgPSBmdW5jdGlvbiAoa29udGV4dCkge1xuICAgICAgICB0aGlzLmFkZFRvZG8gPSBrb250ZXh0LmdldFNpZ25hbCgndG9kby5hZGQnKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBuZXcgSGVhZGVyKCk7XG4gICAgICAgIHRoaXMuaGVhZGVyLmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgICAgICB0aGlzLmhlYWRlci5uZXdUb2RvLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25LZXlEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICB2YXIgZGVzYyA9IHRoaXMuaGVhZGVyLm5ld1RvZG8udmFsdWU7XG4gICAgICAgICAgICB2YXIgdG9kbyA9IHRoaXMua29udGV4dC5nZXRJbnN0YW5jZSgndG9kbycpO1xuICAgICAgICAgICAgdG9kby5zZXREZXNjcmlwdGlvbihkZXNjKTtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9kby5kaXNwYXRjaCh0b2RvKTtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyLm5ld1RvZG8udmFsdWUgPSBudWxsOyAvL2NsZWFyXG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmhlYWRlci5yZW1vdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBIZWFkZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEhlYWRlcigpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIG4wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICAgICAgdmFyIG4xID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3RvZG9zJyk7XG4gICAgICAgIHRoaXMubmV3VG9kbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMubmV3VG9kby5zZXRBdHRyaWJ1dGUoJ2lkJywgJ25ldy10b2RvJyk7XG4gICAgICAgIHRoaXMubmV3VG9kby5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ1doYXQgbmVlZHMgdG8gYmUgZG9uZT8nKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvLnNldEF0dHJpYnV0ZSgnYXV0b2ZvY3VzJywgJycpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKG4wKTtcbiAgICAgICAgbjAuYXBwZW5kQ2hpbGQobjEpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMubmV3VG9kbyk7XG4gICAgfVxuICAgIEhlYWRlci5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgSGVhZGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBIZWFkZXI7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgc2lnbmFscyA9IHJlcXVpcmUoJ2tvbGEtc2lnbmFscycpO1xudmFyIE1haW4gPSByZXF1aXJlKCcuL3ZpZXdzL01haW4nKTtcbnZhciBUb2RvID0gcmVxdWlyZSgnLi92aWV3cy9Ub2RvJyk7XG52YXIgQXBwID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXBwLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFwcCgpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tYWluID0gbmV3IE1haW4oKTtcbiAgICAgICAgdGhpcy5tYWluLmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgICAgICB0aGlzLnRvZG9zID0gdGhpcy5rb250ZXh0LmdldEluc3RhbmNlKCd0b2RvcycpO1xuICAgICAgICB0aGlzLm9uVG9kb0FkZCA9IG5ldyBzaWduYWxzLlNpZ25hbExpc3RlbmVyKHRoaXMudG9kb0FkZGVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy50b2Rvcy5vbkFkZFRvZG8uYWRkTGlzdGVuZXIodGhpcy5vblRvZG9BZGQpO1xuICAgICAgICB0aGlzLm9uVG9kb1JlbW92ZSA9IG5ldyBzaWduYWxzLlNpZ25hbExpc3RlbmVyKHRoaXMudG9kb1JlbW92ZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLnRvZG9zLm9uUmVtb3ZlVG9kby5hZGRMaXN0ZW5lcih0aGlzLm9uVG9kb1JlbW92ZSk7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLnRvZG9BZGRlZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgdG9kbyA9IG5ldyBUb2RvKCk7XG4gICAgICAgIHRvZG8uZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB2YWx1ZS5nZXREZXNjcmlwdGlvbigpO1xuICAgICAgICB0b2RvLmVkaXQudmFsdWUgPSB2YWx1ZS5nZXREZXNjcmlwdGlvbigpO1xuICAgICAgICB0b2RvLmNvbXBsZXRlZC5jaGVja2VkID0gdmFsdWUuZ2V0Q29tcGxldGVkKCk7XG4gICAgICAgIHRvZG8uYXBwZW5kVG8odGhpcy5tYWluLnRvZG9MaXN0KTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUudG9kb1JlbW92ZWQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1haW4ucmVtb3ZlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gQXBwO1xufSkoa29sYS5BcHApO1xuZXhwb3J0cy5BcHAgPSBBcHA7XG4iLCJ2YXIgTWFpbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWFpbigpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy50b2dnbGVBbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RvZ2dsZS1hbGwnKTtcbiAgICAgICAgdGhpcy50b2dnbGVBbGwuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgIHZhciBuMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIG4xLnNldEF0dHJpYnV0ZSgnZm9yJywgJ3RvZ2dsZS1hbGwnKTtcbiAgICAgICAgdmFyIG4yID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ01hcmsgYWxsIGFzIGNvbXBsZXRlJyk7XG4gICAgICAgIHRoaXMudG9kb0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICB0aGlzLnRvZG9MaXN0LnNldEF0dHJpYnV0ZSgnaWQnLCAndG9kby1saXN0Jyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2dnbGVBbGwpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKG4xKTtcbiAgICAgICAgbjEuYXBwZW5kQ2hpbGQobjIpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMudG9kb0xpc3QpO1xuICAgIH1cbiAgICBNYWluLnByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBNYWluLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBNYWluO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gTWFpbjtcbiIsInZhciBUb2RvID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUb2RvKCkge1xuICAgICAgICB2YXIgZG9tZXJJZCA9IChkb2N1bWVudFtcIl9kb21lcklkX1wiXSA9PSB1bmRlZmluZWQpID8gZG9jdW1lbnRbXCJfZG9tZXJJZF9cIl0gPSAwIDogZG9jdW1lbnRbXCJfZG9tZXJJZF9cIl0rKztcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy50b2RvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgdGhpcy50b2RvLnNldEF0dHJpYnV0ZSgnaWQnLCAndG9kb18nICsgZG9tZXJJZCk7XG4gICAgICAgIHZhciBuMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBuMS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3ZpZXcnKTtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICB0aGlzLmNvbXBsZXRlZC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2NvbXBsZXRlZF8nICsgZG9tZXJJZCk7XG4gICAgICAgIHRoaXMuY29tcGxldGVkLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndG9nZ2xlJyk7XG4gICAgICAgIHRoaXMuY29tcGxldGVkLnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgICAgICB0aGlzLmNvbXBsZXRlZC5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnJyk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uLnNldEF0dHJpYnV0ZSgnaWQnLCAnZGVzY3JpcHRpb25fJyArIGRvbWVySWQpO1xuICAgICAgICB2YXIgbjQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnVGFzdGUgSmF2YVNjcmlwdCcpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgdGhpcy5kZXN0cm95LnNldEF0dHJpYnV0ZSgnaWQnLCAnZGVzdHJveV8nICsgZG9tZXJJZCk7XG4gICAgICAgIHRoaXMuZGVzdHJveS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Rlc3Ryb3knKTtcbiAgICAgICAgdGhpcy5lZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgdGhpcy5lZGl0LnNldEF0dHJpYnV0ZSgnaWQnLCAnZWRpdF8nICsgZG9tZXJJZCk7XG4gICAgICAgIHRoaXMuZWRpdC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2VkaXQnKTtcbiAgICAgICAgdGhpcy5lZGl0LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnQ3JlYXRlIGEgVG9kb01WQyB0ZW1wbGF0ZScpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMudG9kbyk7XG4gICAgICAgIHRoaXMudG9kby5hcHBlbmRDaGlsZChuMSk7XG4gICAgICAgIG4xLmFwcGVuZENoaWxkKHRoaXMuY29tcGxldGVkKTtcbiAgICAgICAgbjEuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24uYXBwZW5kQ2hpbGQobjQpO1xuICAgICAgICBuMS5hcHBlbmRDaGlsZCh0aGlzLmRlc3Ryb3kpO1xuICAgICAgICB0aGlzLnRvZG8uYXBwZW5kQ2hpbGQodGhpcy5lZGl0KTtcbiAgICB9XG4gICAgVG9kby5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgVG9kby5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMucGFyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gVG9kbztcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFRvZG87XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamNhYnJlc29zIG9uIDMvMTMvMTUuXG4gKi9cbnZhciBzaWduYWxzID0gcmVxdWlyZSgna29sYS1zaWduYWxzJyk7XG52YXIgVG9kbyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVG9kbygpIHtcbiAgICAgICAgdGhpcy5vbkRlc2NyaXB0aW9uID0gbmV3IHNpZ25hbHMuU2lnbmFsRGlzcGF0Y2hlcigpO1xuICAgICAgICB0aGlzLm9uQ29tcGxldGVkID0gbmV3IHNpZ25hbHMuU2lnbmFsRGlzcGF0Y2hlcigpO1xuICAgIH1cbiAgICBUb2RvLnByb3RvdHlwZS5zZXREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25EZXNjcmlwdGlvbi5kaXNwYXRjaCh2YWx1ZSk7XG4gICAgfTtcbiAgICBUb2RvLnByb3RvdHlwZS5nZXREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb247XG4gICAgfTtcbiAgICBUb2RvLnByb3RvdHlwZS5zZXRDb21wbGV0ZWQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlZC5kaXNwYXRjaCh2YWx1ZSk7XG4gICAgfTtcbiAgICBUb2RvLnByb3RvdHlwZS5nZXRDb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlZDtcbiAgICB9O1xuICAgIHJldHVybiBUb2RvO1xufSkoKTtcbmV4cG9ydHMuVG9kbyA9IFRvZG87XG52YXIgVG9kb3MgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRvZG9zKCkge1xuICAgICAgICB0aGlzLm9uQWRkVG9kbyA9IG5ldyBzaWduYWxzLlNpZ25hbERpc3BhdGNoZXIoKTtcbiAgICAgICAgdGhpcy5vblJlbW92ZVRvZG8gPSBuZXcgc2lnbmFscy5TaWduYWxEaXNwYXRjaGVyKCk7XG4gICAgICAgIHRoaXMudG9kb3MgPSBbXTtcbiAgICB9XG4gICAgVG9kb3MucHJvdG90eXBlLmFkZFRvZG8gPSBmdW5jdGlvbiAodG9kbykge1xuICAgICAgICB0aGlzLnRvZG9zLnB1c2godG9kbyk7XG4gICAgICAgIHRoaXMub25BZGRUb2RvLmRpc3BhdGNoKHRvZG8pO1xuICAgIH07XG4gICAgVG9kb3MucHJvdG90eXBlLnJlbW92ZVRvZG8gPSBmdW5jdGlvbiAodG9kbykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0b2RvID09IHRoaXMudG9kb3NbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uUmVtb3ZlVG9kby5kaXNwYXRjaCh0b2RvKTtcbiAgICB9O1xuICAgIFRvZG9zLnByb3RvdHlwZS5nZXRDb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0b2Rvc0NvbXBsZXRlZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLmdldENvbXBsZXRlZCgpKVxuICAgICAgICAgICAgICAgIHRvZG9zQ29tcGxldGVkLnB1c2godGhpcy50b2Rvc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvZG9zQ29tcGxldGVkO1xuICAgIH07XG4gICAgVG9kb3MucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9kb3Muc3BsaWNlKDApO1xuICAgIH07XG4gICAgVG9kb3MucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvZG9zLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBUb2Rvcztcbn0pKCk7XG5leHBvcnRzLlRvZG9zID0gVG9kb3M7XG4iLCJ2YXIgVG9kb0FwcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVG9kb0FwcCgpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoZWFkZXInKTtcbiAgICAgICAgdGhpcy5oZWFkZXIuc2V0QXR0cmlidXRlKCdpZCcsICdoZWFkZXInKTtcbiAgICAgICAgdGhpcy5tYWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VjdGlvbicpO1xuICAgICAgICB0aGlzLm1haW4uc2V0QXR0cmlidXRlKCdpZCcsICdtYWluJyk7XG4gICAgICAgIHRoaXMuZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9vdGVyJyk7XG4gICAgICAgIHRoaXMuZm9vdGVyLnNldEF0dHJpYnV0ZSgnaWQnLCAnZm9vdGVyJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5oZWFkZXIpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMubWFpbik7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5mb290ZXIpO1xuICAgIH1cbiAgICBUb2RvQXBwLnByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBUb2RvQXBwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBUb2RvQXBwO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gVG9kb0FwcDtcbiIsInZhciBFeGVjdXRpb25DaGFpblRpbWVvdXQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV4ZWN1dGlvbkNoYWluVGltZW91dChrb21tYW5kKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiRXhlY3V0aW9uQ2hhaW5UaW1lb3V0XCI7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IFwiRXhlY3V0aW9uIHRpbWVvdXRcIjtcbiAgICAgICAgdGhpcy5rb21tYW5kID0ga29tbWFuZDtcbiAgICB9XG4gICAgcmV0dXJuIEV4ZWN1dGlvbkNoYWluVGltZW91dDtcbn0pKCk7XG5leHBvcnRzLkV4ZWN1dGlvbkNoYWluVGltZW91dCA9IEV4ZWN1dGlvbkNoYWluVGltZW91dDtcbnZhciBFeGVjdXRpb25DaGFpbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXhlY3V0aW9uQ2hhaW4ocGF5bG9hZCwga29udGV4dCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgICAgICB0aGlzLmtvbnRleHQgPSBrb250ZXh0O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuZXhlY3V0ZWQgPSB7fTtcbiAgICB9XG4gICAgRXhlY3V0aW9uQ2hhaW4ucHJvdG90eXBlLm5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW4ucHJvdG90eXBlLm9uRG9uZSA9IGZ1bmN0aW9uIChpbmRleCwgZXJyb3IpIHtcbiAgICAgICAgLy9pZiB0aGlzIGluZGV4IGlzIGVxdWFsIHRvIGN1cnJlbnRJbmRleCB0aGVuIGNhbGwgbmV4dFxuICAgICAgICAvL2lmIG5vdCwgaWdub3JlLCBidXQgaWYgaXQgaGFzIGFuIGVycm9yLCBsZXQgaXQgY2FsbCBvbiBlcnJvclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICBpZiAoZXJyb3IgJiYgdGhpcy5vcHRpb25zLmVycm9yQ29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVycm9yQ29tbWFuZChlcnJvciwgdGhpcy5rb250ZXh0KTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZnJhZ2lsZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCsrO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICB9O1xuICAgIEV4ZWN1dGlvbkNoYWluLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5leGVjdXRlZFt0aGlzLmN1cnJlbnRJbmRleF0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbmRleCA8IHRoaXMub3B0aW9ucy5jb21tYW5kcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kID0gdGhpcy5vcHRpb25zLmNvbW1hbmRzW3RoaXMuY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIHZhciBkb25lO1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICAgIGRvbmUgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMub25Eb25lKF90aGlzLmN1cnJlbnRJbmRleCwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdmFyIG9uVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMub25Eb25lKF90aGlzLmN1cnJlbnRJbmRleCwgbmV3IEV4ZWN1dGlvbkNoYWluVGltZW91dChjb21tYW5kKSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQob25UaW1lb3V0LCB0aGlzLm9wdGlvbnMudGltZW91dCk7XG4gICAgICAgICAgICAgICAgY29tbWFuZCh0aGlzLnBheWxvYWQsIHRoaXMua29udGV4dCwgZG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgY29tbWFuZCh0aGlzLnBheWxvYWQsIHRoaXMua29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXgrKztcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZWRbdGhpcy5jdXJyZW50SW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEV4ZWN1dGlvbkNoYWluO1xufSkoKTtcbmV4cG9ydHMuRXhlY3V0aW9uQ2hhaW4gPSBFeGVjdXRpb25DaGFpbjtcbnZhciBFeGVjdXRpb25DaGFpbkZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV4ZWN1dGlvbkNoYWluRmFjdG9yeShjb21tYW5kQ2hhaW4pIHtcbiAgICAgICAgdGhpcy5jb21tYW5kQ2hhaW4gPSBjb21tYW5kQ2hhaW47XG4gICAgfVxuICAgIEV4ZWN1dGlvbkNoYWluRmFjdG9yeS5wcm90b3R5cGUuYnJlYWtDaGFpbk9uRXJyb3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5jaGFpbkJyZWFrc09uRXJyb3IgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBFeGVjdXRpb25DaGFpbkZhY3RvcnkucHJvdG90eXBlLm9uRXJyb3IgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICB0aGlzLm9uRXJyb3JDb21tYW5kID0gY29tbWFuZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBFeGVjdXRpb25DaGFpbkZhY3RvcnkucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbiAobXMpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0TXMgPSBtcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBFeGVjdXRpb25DaGFpbkZhY3RvcnkucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAocGF5bG9hZCwga29udGV4dCkge1xuICAgICAgICByZXR1cm4gbmV3IEV4ZWN1dGlvbkNoYWluKHBheWxvYWQsIGtvbnRleHQsIHtcbiAgICAgICAgICAgIFwiY29tbWFuZHNcIjogdGhpcy5jb21tYW5kQ2hhaW4sXG4gICAgICAgICAgICBcImVycm9yQ29tbWFuZFwiOiB0aGlzLm9uRXJyb3JDb21tYW5kLFxuICAgICAgICAgICAgXCJmcmFnaWxlXCI6IHRoaXMuY2hhaW5CcmVha3NPbkVycm9yLFxuICAgICAgICAgICAgXCJ0aW1lb3V0XCI6IHRoaXMudGltZW91dE1zXG4gICAgICAgIH0pLm5vdygpO1xuICAgIH07XG4gICAgcmV0dXJuIEV4ZWN1dGlvbkNoYWluRmFjdG9yeTtcbn0pKCk7XG5leHBvcnRzLkV4ZWN1dGlvbkNoYWluRmFjdG9yeSA9IEV4ZWN1dGlvbkNoYWluRmFjdG9yeTtcbmZ1bmN0aW9uIGV4ZWN1dGVzKGtvbW1hbmQpIHtcbiAgICByZXR1cm4gbmV3IEV4ZWN1dGlvbkNoYWluRmFjdG9yeShrb21tYW5kKTtcbn1cbmV4cG9ydHMuZXhlY3V0ZXMgPSBleGVjdXRlcztcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMi8xNS8xNC5cbiAqL1xudmFyIHNpZ25hbENvdW50ID0gMDtcbmZ1bmN0aW9uIGdlbmVyYXRlU2lnbmFsSWQoKSB7XG4gICAgdmFyIG5leHRJZCA9IHNpZ25hbENvdW50Kys7XG4gICAgcmV0dXJuIG5leHRJZDtcbn1cbnZhciBTaWduYWxEaXNwYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaWduYWxEaXNwYXRjaGVyKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgICAgICB0aGlzLm51bUxpc3RlbmVycyA9IDA7XG4gICAgfVxuICAgIFNpZ25hbERpc3BhdGNoZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2xpc3RlbmVyLmlkXSA9IGxpc3RlbmVyO1xuICAgICAgICB0aGlzLm51bUxpc3RlbmVycysrO1xuICAgIH07XG4gICAgU2lnbmFsRGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbbGlzdGVuZXIuaWRdID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm51bUxpc3RlbmVycy0tO1xuICAgIH07XG4gICAgU2lnbmFsRGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgICAgICB0aGlzLm51bUxpc3RlbmVycyA9IDA7XG4gICAgfTtcbiAgICBTaWduYWxEaXNwYXRjaGVyLnByb3RvdHlwZS5nZXRMaXN0ZW5lcnNMZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm51bUxpc3RlbmVycztcbiAgICB9O1xuICAgIFNpZ25hbERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyc1RtcCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcnNbaWRdO1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucmVjZWl2ZVNpZ25hbChwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuY2FsbE9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnNUbXBbaWRdID0gdGhpcy5saXN0ZW5lcnNbaWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gbGlzdGVuZXJzVG1wO1xuICAgIH07XG4gICAgcmV0dXJuIFNpZ25hbERpc3BhdGNoZXI7XG59KSgpO1xuZXhwb3J0cy5TaWduYWxEaXNwYXRjaGVyID0gU2lnbmFsRGlzcGF0Y2hlcjtcbnZhciBTaWduYWxMaXN0ZW5lciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2lnbmFsTGlzdGVuZXIoY2FsbGJhY2ssIHRhcmdldCwgY2FsbE9uY2UpIHtcbiAgICAgICAgdGhpcy5pZCA9IGdlbmVyYXRlU2lnbmFsSWQoKTtcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgdGhpcy5jYWxsT25jZSA9IGNhbGxPbmNlO1xuICAgIH1cbiAgICBTaWduYWxMaXN0ZW5lci5wcm90b3R5cGUucmVjZWl2ZVNpZ25hbCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2suY2FsbCh0aGlzLnRhcmdldCwgcGF5bG9hZCk7XG4gICAgfTtcbiAgICByZXR1cm4gU2lnbmFsTGlzdGVuZXI7XG59KSgpO1xuZXhwb3J0cy5TaWduYWxMaXN0ZW5lciA9IFNpZ25hbExpc3RlbmVyO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHN0YXRpY2Z1bmN0aW9uIG9uIDgvMjAvMTQuXG4gKi9cbnZhciBzaWduYWxzID0gcmVxdWlyZSgna29sYS1zaWduYWxzJyk7XG52YXIgS29udGV4dEZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEtvbnRleHRGYWN0b3J5KGdlbmVyYXRvcikge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UgPSBnZW5lcmF0b3I7XG4gICAgfVxuICAgIEtvbnRleHRGYWN0b3J5LnByb3RvdHlwZS5hc1NpbmdsZXRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghX3RoaXMuc2luZ2xlSW5zdGFuY2UpXG4gICAgICAgICAgICAgICAgX3RoaXMuc2luZ2xlSW5zdGFuY2UgPSBfdGhpcy5nZW5lcmF0b3IoKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zaW5nbGVJbnN0YW5jZTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBLb250ZXh0RmFjdG9yeTtcbn0pKCk7XG5leHBvcnRzLktvbnRleHRGYWN0b3J5ID0gS29udGV4dEZhY3Rvcnk7XG52YXIgU2lnbmFsSG9vayA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2lnbmFsSG9vayhrb250ZXh0LCBzaWduYWwsIGhvb2spIHtcbiAgICAgICAgdGhpcy5rb250ZXh0ID0ga29udGV4dDtcbiAgICAgICAgdGhpcy5zaWduYWwgPSBzaWduYWw7XG4gICAgICAgIHRoaXMuaG9vayA9IGhvb2s7XG4gICAgICAgIHRoaXMubGlzdGVuZXIgPSBuZXcgc2lnbmFscy5TaWduYWxMaXN0ZW5lcih0aGlzLm9uRGlzcGF0Y2gsIHRoaXMpO1xuICAgIH1cbiAgICBTaWduYWxIb29rLnByb3RvdHlwZS5vbkRpc3BhdGNoID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgdGhpcy5ob29rLmV4ZWN1dGUocGF5bG9hZCwgdGhpcy5rb250ZXh0KTtcbiAgICB9O1xuICAgIFNpZ25hbEhvb2sucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zaWduYWwuYWRkTGlzdGVuZXIodGhpcy5saXN0ZW5lcik7XG4gICAgfTtcbiAgICBTaWduYWxIb29rLnByb3RvdHlwZS5kZXR0YWNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNpZ25hbC5yZW1vdmVMaXN0ZW5lcih0aGlzLmxpc3RlbmVyKTtcbiAgICB9O1xuICAgIFNpZ25hbEhvb2sucHJvdG90eXBlLnJ1bk9uY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXIgPSBuZXcgc2lnbmFscy5TaWduYWxMaXN0ZW5lcih0aGlzLm9uRGlzcGF0Y2gsIHRoaXMsIHRydWUpO1xuICAgIH07XG4gICAgcmV0dXJuIFNpZ25hbEhvb2s7XG59KSgpO1xuZXhwb3J0cy5TaWduYWxIb29rID0gU2lnbmFsSG9vaztcbnZhciBLb250ZXh0SW1wbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gS29udGV4dEltcGwocGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnNpZ25hbHMgPSB7fTtcbiAgICAgICAgdGhpcy5zaWduYWxIb29rcyA9IFtdO1xuICAgICAgICB0aGlzLmluc3RhbmNlcyA9IHt9O1xuICAgIH1cbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuaGFzU2lnbmFsID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2lnbmFsc1tuYW1lXSAhPSBudWxsO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLnNldFNpZ25hbCA9IGZ1bmN0aW9uIChuYW1lLCBob29rKSB7XG4gICAgICAgIHZhciBzaWduYWwgPSB0aGlzLmdldFNpZ25hbChuYW1lKTtcbiAgICAgICAgaWYgKCFzaWduYWwpXG4gICAgICAgICAgICBzaWduYWwgPSB0aGlzLnNpZ25hbHNbbmFtZV0gPSBuZXcgc2lnbmFscy5TaWduYWxEaXNwYXRjaGVyKCk7XG4gICAgICAgIHZhciBzaWdIb29rO1xuICAgICAgICBpZiAoaG9vaykge1xuICAgICAgICAgICAgc2lnSG9vayA9IG5ldyBTaWduYWxIb29rKHRoaXMsIHNpZ25hbCwgaG9vayk7XG4gICAgICAgICAgICB0aGlzLnNpZ25hbEhvb2tzLnB1c2goc2lnSG9vayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpZ0hvb2s7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuZ2V0U2lnbmFsID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIHNpZ25hbCA9IHRoaXMuc2lnbmFsc1tuYW1lXTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICYmICFzaWduYWwpIHtcbiAgICAgICAgICAgIHNpZ25hbCA9IHRoaXMucGFyZW50LmdldFNpZ25hbChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2lnbmFsO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLnNldEluc3RhbmNlID0gZnVuY3Rpb24gKG5hbWUsIGZhY3RvcnkpIHtcbiAgICAgICAgaWYgKCFmYWN0b3J5KVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdlcnJvciB0cnlpbmcgdG8gZGVmaW5lIGluc3RhbmNlOiAnICsgbmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc1tuYW1lXSA9IG5ldyBLb250ZXh0RmFjdG9yeShmYWN0b3J5KTtcbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0gdGhpcy5pbnN0YW5jZXNbbmFtZV07XG4gICAgICAgIGlmIChmYWN0b3J5KVxuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnkuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldEluc3RhbmNlKG5hbWUpO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2lnbmFsSG9va3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2lnbmFsSG9va3NbaV0uYXR0YWNoKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2lnbmFsSG9va3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2lnbmFsSG9va3NbaV0uZGV0dGFjaCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gS29udGV4dEltcGw7XG59KSgpO1xuZXhwb3J0cy5Lb250ZXh0SW1wbCA9IEtvbnRleHRJbXBsO1xudmFyIEFwcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQXBwKHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRleHQgPSBuZXcgS29udGV4dEltcGwodGhpcy5wYXJlbnQua29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5rb250ZXh0ID0gbmV3IEtvbnRleHRJbXBsKCk7XG4gICAgfVxuICAgIEFwcC5wcm90b3R5cGUub25Lb250ZXh0ID0gZnVuY3Rpb24gKGtvbnRleHQsIG9wdHMpIHtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAob3B0cykge1xuICAgICAgICB0aGlzLnN0YXJ0dXBPcHRpb25zID0gb3B0cztcbiAgICAgICAgdGhpcy5vbktvbnRleHQodGhpcy5rb250ZXh0LCBvcHRzKTtcbiAgICAgICAgdGhpcy5rb250ZXh0LnN0YXJ0KCk7XG4gICAgICAgIHRoaXMub25TdGFydCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmtvbnRleHQuc3RvcCgpO1xuICAgICAgICB0aGlzLm9uU3RvcCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KSgpO1xuZXhwb3J0cy5BcHAgPSBBcHA7XG4iXX0=
