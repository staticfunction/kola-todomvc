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

},{"./commands":2,"./footer/app":3,"./header/app":5,"./main/app":7,"./models":9,"./views/TodoApp":10,"kola":13,"kola-hooks":11,"kola-signals":12}],2:[function(require,module,exports){
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

},{"./views/Footer":4,"kola":13}],4:[function(require,module,exports){
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

},{"./views/Header":6,"kola":13}],6:[function(require,module,exports){
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
var Main = require('./views/Main');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.onStart = function () {
        this.main = new Main();
        this.main.appendTo(this.startupOptions);
    };
    App.prototype.onStop = function () {
        this.main.remove();
    };
    return App;
})(kola.App);
exports.App = App;

},{"./views/Main":8,"kola":13}],8:[function(require,module,exports){
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
        var n4 = document.createElement('li');
        n4.setAttribute('class', 'completed');
        var n5 = document.createElement('div');
        n5.setAttribute('class', 'view');
        var n6 = document.createElement('input');
        n6.setAttribute('class', 'toggle');
        n6.setAttribute('type', 'checkbox');
        n6.setAttribute('checked', '');
        var n7 = document.createElement('label');
        var n8 = document.createTextNode('Taste JavaScript');
        var n9 = document.createElement('button');
        n9.setAttribute('class', 'destroy');
        var n10 = document.createElement('input');
        n10.setAttribute('class', 'edit');
        n10.setAttribute('value', 'Create a TodoMVC template');
        var n11 = document.createElement('li');
        var n12 = document.createElement('div');
        n12.setAttribute('class', 'view');
        var n13 = document.createElement('input');
        n13.setAttribute('class', 'toggle');
        n13.setAttribute('type', 'checkbox');
        var n14 = document.createElement('label');
        var n15 = document.createTextNode('Buy a unicorn');
        var n16 = document.createElement('button');
        n16.setAttribute('class', 'destroy');
        var n17 = document.createElement('input');
        n17.setAttribute('class', 'edit');
        n17.setAttribute('value', 'Rule the web');
        this.rootNodes.push(this.toggleAll);
        this.rootNodes.push(n1);
        n1.appendChild(n2);
        this.rootNodes.push(this.todoList);
        this.todoList.appendChild(n4);
        n4.appendChild(n5);
        n5.appendChild(n6);
        n5.appendChild(n7);
        n7.appendChild(n8);
        n5.appendChild(n9);
        n4.appendChild(n10);
        this.todoList.appendChild(n11);
        n11.appendChild(n12);
        n12.appendChild(n13);
        n12.appendChild(n14);
        n14.appendChild(n15);
        n12.appendChild(n16);
        n11.appendChild(n17);
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

},{"kola-signals":12}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"kola-signals":14}],14:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hcHAuanMiLCJidWlsZC9jb21tYW5kcy5qcyIsImJ1aWxkL2Zvb3Rlci9hcHAuanMiLCJidWlsZC9mb290ZXIvdmlld3MvRm9vdGVyLmpzIiwiYnVpbGQvaGVhZGVyL2FwcC5qcyIsImJ1aWxkL2hlYWRlci92aWV3cy9IZWFkZXIuanMiLCJidWlsZC9tYWluL2FwcC5qcyIsImJ1aWxkL21haW4vdmlld3MvTWFpbi5qcyIsImJ1aWxkL21vZGVscy5qcyIsImJ1aWxkL3ZpZXdzL1RvZG9BcHAuanMiLCJub2RlX21vZHVsZXMva29sYS1ob29rcy9kaXN0L2hvb2tzLmpzIiwibm9kZV9tb2R1bGVzL2tvbGEtc2lnbmFscy9kaXN0L3NpZ25hbHMuanMiLCJub2RlX21vZHVsZXMva29sYS9kaXN0L2tvbGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgc2lnbmFscyA9IHJlcXVpcmUoJ2tvbGEtc2lnbmFscycpO1xudmFyIGhvb2tzID0gcmVxdWlyZSgna29sYS1ob29rcycpO1xudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4vbW9kZWxzJyk7XG52YXIgbWFpbiA9IHJlcXVpcmUoJy4vbWFpbi9hcHAnKTtcbnZhciBoZWFkZXIgPSByZXF1aXJlKCcuL2hlYWRlci9hcHAnKTtcbnZhciBmb290ZXIgPSByZXF1aXJlKCcuL2Zvb3Rlci9hcHAnKTtcbnZhciBjb21tYW5kcyA9IHJlcXVpcmUoJy4vY29tbWFuZHMnKTtcbnZhciBUb2RvQXBwVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvVG9kb0FwcCcpO1xudmFyIFRvZG9BcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUb2RvQXBwLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFRvZG9BcHAoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBUb2RvQXBwLnByb3RvdHlwZS5vbktvbnRleHQgPSBmdW5jdGlvbiAoa29udGV4dCwgb3B0cykge1xuICAgICAgICBrb250ZXh0LnNldFNpZ25hbCgndG9kby5hZGQnLCBob29rcy5leGVjdXRlcyhbY29tbWFuZHMuYWRkVG9kb10pKTtcbiAgICAgICAga29udGV4dC5zZXRTaWduYWwoJ3RvZG8ucmVtb3ZlJyk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2RvLmNvbXBsZXRlJyk7XG4gICAgICAgIGtvbnRleHQuc2V0U2lnbmFsKCd0b2Rvcy5jbGVhci5jb21wbGV0ZWQnKTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndG9kb3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IG1vZGVscy5Ub2RvcygpO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBrb250ZXh0LnNldEluc3RhbmNlKCd0b2RvJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBtb2RlbHMuVG9kbygpO1xuICAgICAgICB9KTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndmlldycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRzO1xuICAgICAgICB9KS5hc1NpbmdsZXRvbigpO1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLm9uS29udGV4dC5jYWxsKHRoaXMsIGtvbnRleHQsIG9wdHMpO1xuICAgIH07XG4gICAgVG9kb0FwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50b2RvVmlldyA9IG5ldyBUb2RvQXBwVmlldygpO1xuICAgICAgICB0aGlzLnRvZG9WaWV3LmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgICAgICB0aGlzLnRvZG9zID0gdGhpcy5rb250ZXh0LmdldEluc3RhbmNlKCd0b2RvcycpO1xuICAgICAgICB0aGlzLmhlYWRlckFwcCA9IG5ldyBoZWFkZXIuQXBwKHRoaXMpLnN0YXJ0KHRoaXMudG9kb1ZpZXcuaGVhZGVyKTtcbiAgICAgICAgdGhpcy5mb290ZXJBcHAgPSBuZXcgZm9vdGVyLkFwcCh0aGlzKS5zdGFydCh0aGlzLnRvZG9WaWV3LmZvb3Rlcik7XG4gICAgICAgIHRoaXMubWFpbkFwcCA9IG5ldyBtYWluLkFwcCh0aGlzKS5zdGFydCh0aGlzLnRvZG9WaWV3Lm1haW4pO1xuICAgICAgICB0aGlzLnRvZG9zQ2hhbmdlZCA9IG5ldyBzaWduYWxzLlNpZ25hbExpc3RlbmVyKHRoaXMub25Ub2Rvc0NoYW5nZSwgdGhpcyk7XG4gICAgICAgIHRoaXMudG9kb3Mub25BZGRUb2RvLmFkZExpc3RlbmVyKHRoaXMudG9kb3NDaGFuZ2VkKTtcbiAgICAgICAgdGhpcy50b2Rvcy5vblJlbW92ZVRvZG8uYWRkTGlzdGVuZXIodGhpcy50b2Rvc0NoYW5nZWQpO1xuICAgICAgICB0aGlzLm9uVG9kb3NDaGFuZ2UoKTtcbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uVG9kb3NDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRvZG9zLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMudG9kb1ZpZXcuZm9vdGVyLmNsYXNzTmFtZSA9IHRoaXMudG9kb1ZpZXcubWFpbi5jbGFzc05hbWUgPSBcImhhc1RvZG9zXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRvZG9WaWV3LmZvb3Rlci5jbGFzc05hbWUgPSB0aGlzLnRvZG9WaWV3Lm1haW4uY2xhc3NOYW1lID0gXCJub1RvZG9zXCI7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50b2RvVmlldy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5oZWFkZXJBcHAuc3RvcCgpO1xuICAgICAgICB0aGlzLmZvb3RlckFwcC5zdG9wKCk7XG4gICAgICAgIHRoaXMubWFpbkFwcC5zdG9wKCk7XG4gICAgICAgIHRoaXMudG9kb3Mub25BZGRUb2RvLnJlbW92ZUxpc3RlbmVyKHRoaXMudG9kb3NDaGFuZ2VkKTtcbiAgICAgICAgdGhpcy50b2Rvcy5vblJlbW92ZVRvZG8ucmVtb3ZlTGlzdGVuZXIodGhpcy50b2Rvc0NoYW5nZWQpO1xuICAgIH07XG4gICAgcmV0dXJuIFRvZG9BcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLlRvZG9BcHAgPSBUb2RvQXBwO1xudmFyIHRvZG9BcHAgPSBuZXcgVG9kb0FwcCgpLnN0YXJ0KHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9kb2FwcCcpKTtcbiIsImZ1bmN0aW9uIGFkZFRvZG8ocGF5bG9hZCwga29udGV4dCkge1xuICAgIHZhciB0b2RvcyA9IGtvbnRleHQuZ2V0SW5zdGFuY2UoJ3RvZG9zJyk7XG4gICAgdG9kb3MuYWRkVG9kbyhwYXlsb2FkKTtcbn1cbmV4cG9ydHMuYWRkVG9kbyA9IGFkZFRvZG87XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgRm9vdGVyID0gcmVxdWlyZSgnLi92aWV3cy9Gb290ZXInKTtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmZvb3RlciA9IG5ldyBGb290ZXIoKTtcbiAgICAgICAgdGhpcy5mb290ZXIuYXBwZW5kVG8odGhpcy5zdGFydHVwT3B0aW9ucyk7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBGb290ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEZvb3RlcigpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy50b2RvQ291bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHRoaXMudG9kb0NvdW50LnNldEF0dHJpYnV0ZSgnaWQnLCAndG9kby1jb3VudCcpO1xuICAgICAgICB2YXIgbjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHJvbmcnKTtcbiAgICAgICAgdmFyIG4yID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzAnKTtcbiAgICAgICAgdmFyIG4zID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBpdGVtIGxlZnQnKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzLnNldEF0dHJpYnV0ZSgnaWQnLCAnZmlsdGVycycpO1xuICAgICAgICB2YXIgbjUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgbjYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIG42LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgbjYuc2V0QXR0cmlidXRlKCdocmVmJywgJyMvJyk7XG4gICAgICAgIHZhciBuNyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBbGwnKTtcbiAgICAgICAgdmFyIG44ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgdmFyIG45ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBuOS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIy9hY3RpdmUnKTtcbiAgICAgICAgdmFyIG4xMCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBY3RpdmUnKTtcbiAgICAgICAgdmFyIG4xMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHZhciBuMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIG4xMi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIy9jb21wbGV0ZWQnKTtcbiAgICAgICAgdmFyIG4xMyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdDb21wbGV0ZWQnKTtcbiAgICAgICAgdGhpcy5jbGVhckNvbXBsZXRlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLmNsZWFyQ29tcGxldGVkLnNldEF0dHJpYnV0ZSgnaWQnLCAnY2xlYXItY29tcGxldGVkJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2RvQ291bnQpO1xuICAgICAgICB0aGlzLnRvZG9Db3VudC5hcHBlbmRDaGlsZChuMSk7XG4gICAgICAgIG4xLmFwcGVuZENoaWxkKG4yKTtcbiAgICAgICAgdGhpcy50b2RvQ291bnQuYXBwZW5kQ2hpbGQobjMpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMuZmlsdGVycyk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5hcHBlbmRDaGlsZChuNSk7XG4gICAgICAgIG41LmFwcGVuZENoaWxkKG42KTtcbiAgICAgICAgbjYuYXBwZW5kQ2hpbGQobjcpO1xuICAgICAgICB0aGlzLmZpbHRlcnMuYXBwZW5kQ2hpbGQobjgpO1xuICAgICAgICBuOC5hcHBlbmRDaGlsZChuOSk7XG4gICAgICAgIG45LmFwcGVuZENoaWxkKG4xMCk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5hcHBlbmRDaGlsZChuMTEpO1xuICAgICAgICBuMTEuYXBwZW5kQ2hpbGQobjEyKTtcbiAgICAgICAgbjEyLmFwcGVuZENoaWxkKG4xMyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5jbGVhckNvbXBsZXRlZCk7XG4gICAgfVxuICAgIEZvb3Rlci5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRm9vdGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBGb290ZXI7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBGb290ZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgSGVhZGVyID0gcmVxdWlyZSgnLi92aWV3cy9IZWFkZXInKTtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5vbktvbnRleHQgPSBmdW5jdGlvbiAoa29udGV4dCkge1xuICAgICAgICB0aGlzLmFkZFRvZG8gPSBrb250ZXh0LmdldFNpZ25hbCgndG9kby5hZGQnKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBuZXcgSGVhZGVyKCk7XG4gICAgICAgIHRoaXMuaGVhZGVyLmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgICAgICB0aGlzLmhlYWRlci5uZXdUb2RvLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25LZXlEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICB2YXIgZGVzYyA9IHRoaXMuaGVhZGVyLm5ld1RvZG8udmFsdWU7XG4gICAgICAgICAgICB2YXIgdG9kbyA9IHRoaXMua29udGV4dC5nZXRJbnN0YW5jZSgndG9kbycpO1xuICAgICAgICAgICAgdG9kby5zZXREZXNjcmlwdGlvbihkZXNjKTtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9kby5kaXNwYXRjaCh0b2RvKTtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyLm5ld1RvZG8udmFsdWUgPSBudWxsOyAvL2NsZWFyXG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmhlYWRlci5yZW1vdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBIZWFkZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEhlYWRlcigpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIG4wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICAgICAgdmFyIG4xID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3RvZG9zJyk7XG4gICAgICAgIHRoaXMubmV3VG9kbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMubmV3VG9kby5zZXRBdHRyaWJ1dGUoJ2lkJywgJ25ldy10b2RvJyk7XG4gICAgICAgIHRoaXMubmV3VG9kby5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ1doYXQgbmVlZHMgdG8gYmUgZG9uZT8nKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvLnNldEF0dHJpYnV0ZSgnYXV0b2ZvY3VzJywgJycpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKG4wKTtcbiAgICAgICAgbjAuYXBwZW5kQ2hpbGQobjEpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMubmV3VG9kbyk7XG4gICAgfVxuICAgIEhlYWRlci5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgSGVhZGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBIZWFkZXI7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXI7XG4iLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgTWFpbiA9IHJlcXVpcmUoJy4vdmlld3MvTWFpbicpO1xudmFyIEFwcCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFwcCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBcHAoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBBcHAucHJvdG90eXBlLm9uU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubWFpbiA9IG5ldyBNYWluKCk7XG4gICAgICAgIHRoaXMubWFpbi5hcHBlbmRUbyh0aGlzLnN0YXJ0dXBPcHRpb25zKTtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1haW4ucmVtb3ZlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gQXBwO1xufSkoa29sYS5BcHApO1xuZXhwb3J0cy5BcHAgPSBBcHA7XG4iLCJ2YXIgTWFpbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWFpbigpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy50b2dnbGVBbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RvZ2dsZS1hbGwnKTtcbiAgICAgICAgdGhpcy50b2dnbGVBbGwuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgIHZhciBuMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIG4xLnNldEF0dHJpYnV0ZSgnZm9yJywgJ3RvZ2dsZS1hbGwnKTtcbiAgICAgICAgdmFyIG4yID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ01hcmsgYWxsIGFzIGNvbXBsZXRlJyk7XG4gICAgICAgIHRoaXMudG9kb0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICB0aGlzLnRvZG9MaXN0LnNldEF0dHJpYnV0ZSgnaWQnLCAndG9kby1saXN0Jyk7XG4gICAgICAgIHZhciBuNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIG40LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY29tcGxldGVkJyk7XG4gICAgICAgIHZhciBuNSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBuNS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3ZpZXcnKTtcbiAgICAgICAgdmFyIG42ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgbjYuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0b2dnbGUnKTtcbiAgICAgICAgbjYuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgIG42LnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICcnKTtcbiAgICAgICAgdmFyIG43ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgdmFyIG44ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1Rhc3RlIEphdmFTY3JpcHQnKTtcbiAgICAgICAgdmFyIG45ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIG45LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZGVzdHJveScpO1xuICAgICAgICB2YXIgbjEwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgbjEwLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZWRpdCcpO1xuICAgICAgICBuMTAuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdDcmVhdGUgYSBUb2RvTVZDIHRlbXBsYXRlJyk7XG4gICAgICAgIHZhciBuMTEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgbjEyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG4xMi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3ZpZXcnKTtcbiAgICAgICAgdmFyIG4xMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIG4xMy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RvZ2dsZScpO1xuICAgICAgICBuMTMuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgIHZhciBuMTQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICB2YXIgbjE1ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0J1eSBhIHVuaWNvcm4nKTtcbiAgICAgICAgdmFyIG4xNiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBuMTYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdkZXN0cm95Jyk7XG4gICAgICAgIHZhciBuMTcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBuMTcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdlZGl0Jyk7XG4gICAgICAgIG4xNy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ1J1bGUgdGhlIHdlYicpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMudG9nZ2xlQWxsKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaChuMSk7XG4gICAgICAgIG4xLmFwcGVuZENoaWxkKG4yKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLnRvZG9MaXN0KTtcbiAgICAgICAgdGhpcy50b2RvTGlzdC5hcHBlbmRDaGlsZChuNCk7XG4gICAgICAgIG40LmFwcGVuZENoaWxkKG41KTtcbiAgICAgICAgbjUuYXBwZW5kQ2hpbGQobjYpO1xuICAgICAgICBuNS5hcHBlbmRDaGlsZChuNyk7XG4gICAgICAgIG43LmFwcGVuZENoaWxkKG44KTtcbiAgICAgICAgbjUuYXBwZW5kQ2hpbGQobjkpO1xuICAgICAgICBuNC5hcHBlbmRDaGlsZChuMTApO1xuICAgICAgICB0aGlzLnRvZG9MaXN0LmFwcGVuZENoaWxkKG4xMSk7XG4gICAgICAgIG4xMS5hcHBlbmRDaGlsZChuMTIpO1xuICAgICAgICBuMTIuYXBwZW5kQ2hpbGQobjEzKTtcbiAgICAgICAgbjEyLmFwcGVuZENoaWxkKG4xNCk7XG4gICAgICAgIG4xNC5hcHBlbmRDaGlsZChuMTUpO1xuICAgICAgICBuMTIuYXBwZW5kQ2hpbGQobjE2KTtcbiAgICAgICAgbjExLmFwcGVuZENoaWxkKG4xNyk7XG4gICAgfVxuICAgIE1haW4ucHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE1haW4ucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIE1haW47XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBNYWluO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGpjYWJyZXNvcyBvbiAzLzEzLzE1LlxuICovXG52YXIgc2lnbmFscyA9IHJlcXVpcmUoJ2tvbGEtc2lnbmFscycpO1xudmFyIFRvZG8gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRvZG8oKSB7XG4gICAgICAgIHRoaXMub25EZXNjcmlwdGlvbiA9IG5ldyBzaWduYWxzLlNpZ25hbERpc3BhdGNoZXIoKTtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlZCA9IG5ldyBzaWduYWxzLlNpZ25hbERpc3BhdGNoZXIoKTtcbiAgICB9XG4gICAgVG9kby5wcm90b3R5cGUuc2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9uRGVzY3JpcHRpb24uZGlzcGF0Y2godmFsdWUpO1xuICAgIH07XG4gICAgVG9kby5wcm90b3R5cGUuZ2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xuICAgIH07XG4gICAgVG9kby5wcm90b3R5cGUuc2V0Q29tcGxldGVkID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY29tcGxldGVkID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25Db21wbGV0ZWQuZGlzcGF0Y2godmFsdWUpO1xuICAgIH07XG4gICAgVG9kby5wcm90b3R5cGUuZ2V0Q29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZWQ7XG4gICAgfTtcbiAgICByZXR1cm4gVG9kbztcbn0pKCk7XG5leHBvcnRzLlRvZG8gPSBUb2RvO1xudmFyIFRvZG9zID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUb2RvcygpIHtcbiAgICAgICAgdGhpcy5vbkFkZFRvZG8gPSBuZXcgc2lnbmFscy5TaWduYWxEaXNwYXRjaGVyKCk7XG4gICAgICAgIHRoaXMub25SZW1vdmVUb2RvID0gbmV3IHNpZ25hbHMuU2lnbmFsRGlzcGF0Y2hlcigpO1xuICAgICAgICB0aGlzLnRvZG9zID0gW107XG4gICAgfVxuICAgIFRvZG9zLnByb3RvdHlwZS5hZGRUb2RvID0gZnVuY3Rpb24gKHRvZG8pIHtcbiAgICAgICAgdGhpcy50b2Rvcy5wdXNoKHRvZG8pO1xuICAgICAgICB0aGlzLm9uQWRkVG9kby5kaXNwYXRjaCh0b2RvKTtcbiAgICB9O1xuICAgIFRvZG9zLnByb3RvdHlwZS5yZW1vdmVUb2RvID0gZnVuY3Rpb24gKHRvZG8pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodG9kbyA9PSB0aGlzLnRvZG9zW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vblJlbW92ZVRvZG8uZGlzcGF0Y2godG9kbyk7XG4gICAgfTtcbiAgICBUb2Rvcy5wcm90b3R5cGUuZ2V0Q29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9kb3NDb21wbGV0ZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS5nZXRDb21wbGV0ZWQoKSlcbiAgICAgICAgICAgICAgICB0b2Rvc0NvbXBsZXRlZC5wdXNoKHRoaXMudG9kb3NbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2Rvc0NvbXBsZXRlZDtcbiAgICB9O1xuICAgIFRvZG9zLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvZG9zLnNwbGljZSgwKTtcbiAgICB9O1xuICAgIFRvZG9zLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b2Rvcy5sZW5ndGg7XG4gICAgfTtcbiAgICByZXR1cm4gVG9kb3M7XG59KSgpO1xuZXhwb3J0cy5Ub2RvcyA9IFRvZG9zO1xuIiwidmFyIFRvZG9BcHAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRvZG9BcHAoKSB7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzID0gW107XG4gICAgICAgIHRoaXMuaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaGVhZGVyJyk7XG4gICAgICAgIHRoaXMuaGVhZGVyLnNldEF0dHJpYnV0ZSgnaWQnLCAnaGVhZGVyJyk7XG4gICAgICAgIHRoaXMubWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlY3Rpb24nKTtcbiAgICAgICAgdGhpcy5tYWluLnNldEF0dHJpYnV0ZSgnaWQnLCAnbWFpbicpO1xuICAgICAgICB0aGlzLmZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpO1xuICAgICAgICB0aGlzLmZvb3Rlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2Zvb3RlcicpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMuaGVhZGVyKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLm1haW4pO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMuZm9vdGVyKTtcbiAgICB9XG4gICAgVG9kb0FwcC5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgVG9kb0FwcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMucGFyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gVG9kb0FwcDtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFRvZG9BcHA7XG4iLCJ2YXIgRXhlY3V0aW9uQ2hhaW5UaW1lb3V0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFeGVjdXRpb25DaGFpblRpbWVvdXQoa29tbWFuZCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkV4ZWN1dGlvbkNoYWluVGltZW91dFwiO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBcIkV4ZWN1dGlvbiB0aW1lb3V0XCI7XG4gICAgICAgIHRoaXMua29tbWFuZCA9IGtvbW1hbmQ7XG4gICAgfVxuICAgIHJldHVybiBFeGVjdXRpb25DaGFpblRpbWVvdXQ7XG59KSgpO1xuZXhwb3J0cy5FeGVjdXRpb25DaGFpblRpbWVvdXQgPSBFeGVjdXRpb25DaGFpblRpbWVvdXQ7XG52YXIgRXhlY3V0aW9uQ2hhaW4gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV4ZWN1dGlvbkNoYWluKHBheWxvYWQsIGtvbnRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgdGhpcy5rb250ZXh0ID0ga29udGV4dDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xuICAgICAgICB0aGlzLmV4ZWN1dGVkID0ge307XG4gICAgfVxuICAgIEV4ZWN1dGlvbkNoYWluLnByb3RvdHlwZS5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEV4ZWN1dGlvbkNoYWluLnByb3RvdHlwZS5vbkRvbmUgPSBmdW5jdGlvbiAoaW5kZXgsIGVycm9yKSB7XG4gICAgICAgIC8vaWYgdGhpcyBpbmRleCBpcyBlcXVhbCB0byBjdXJyZW50SW5kZXggdGhlbiBjYWxsIG5leHRcbiAgICAgICAgLy9pZiBub3QsIGlnbm9yZSwgYnV0IGlmIGl0IGhhcyBhbiBlcnJvciwgbGV0IGl0IGNhbGwgb24gZXJyb3JcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcbiAgICAgICAgaWYgKGVycm9yICYmIHRoaXMub3B0aW9ucy5lcnJvckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lcnJvckNvbW1hbmQoZXJyb3IsIHRoaXMua29udGV4dCk7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZyYWdpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXgrKztcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgfTtcbiAgICBFeGVjdXRpb25DaGFpbi5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuZXhlY3V0ZWRbdGhpcy5jdXJyZW50SW5kZXhdKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPCB0aGlzLm9wdGlvbnMuY29tbWFuZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgY29tbWFuZCA9IHRoaXMub3B0aW9ucy5jb21tYW5kc1t0aGlzLmN1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB2YXIgZG9uZTtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICBkb25lID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9uRG9uZShfdGhpcy5jdXJyZW50SW5kZXgsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBvblRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9uRG9uZShfdGhpcy5jdXJyZW50SW5kZXgsIG5ldyBFeGVjdXRpb25DaGFpblRpbWVvdXQoY29tbWFuZCkpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KG9uVGltZW91dCwgdGhpcy5vcHRpb25zLnRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIGNvbW1hbmQodGhpcy5wYXlsb2FkLCB0aGlzLmtvbnRleHQsIGRvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIGNvbW1hbmQodGhpcy5wYXlsb2FkLCB0aGlzLmtvbnRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVkW3RoaXMuY3VycmVudEluZGV4XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFeGVjdXRpb25DaGFpbjtcbn0pKCk7XG5leHBvcnRzLkV4ZWN1dGlvbkNoYWluID0gRXhlY3V0aW9uQ2hhaW47XG52YXIgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFeGVjdXRpb25DaGFpbkZhY3RvcnkoY29tbWFuZENoYWluKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZENoYWluID0gY29tbWFuZENoYWluO1xuICAgIH1cbiAgICBFeGVjdXRpb25DaGFpbkZhY3RvcnkucHJvdG90eXBlLmJyZWFrQ2hhaW5PbkVycm9yID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY2hhaW5CcmVha3NPbkVycm9yID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5LnByb3RvdHlwZS5vbkVycm9yID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5vbkVycm9yQ29tbWFuZCA9IGNvbW1hbmQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5LnByb3RvdHlwZS50aW1lb3V0ID0gZnVuY3Rpb24gKG1zKSB7XG4gICAgICAgIHRoaXMudGltZW91dE1zID0gbXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRXhlY3V0aW9uQ2hhaW5GYWN0b3J5LnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKHBheWxvYWQsIGtvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFeGVjdXRpb25DaGFpbihwYXlsb2FkLCBrb250ZXh0LCB7XG4gICAgICAgICAgICBcImNvbW1hbmRzXCI6IHRoaXMuY29tbWFuZENoYWluLFxuICAgICAgICAgICAgXCJlcnJvckNvbW1hbmRcIjogdGhpcy5vbkVycm9yQ29tbWFuZCxcbiAgICAgICAgICAgIFwiZnJhZ2lsZVwiOiB0aGlzLmNoYWluQnJlYWtzT25FcnJvcixcbiAgICAgICAgICAgIFwidGltZW91dFwiOiB0aGlzLnRpbWVvdXRNc1xuICAgICAgICB9KS5ub3coKTtcbiAgICB9O1xuICAgIHJldHVybiBFeGVjdXRpb25DaGFpbkZhY3Rvcnk7XG59KSgpO1xuZXhwb3J0cy5FeGVjdXRpb25DaGFpbkZhY3RvcnkgPSBFeGVjdXRpb25DaGFpbkZhY3Rvcnk7XG5mdW5jdGlvbiBleGVjdXRlcyhrb21tYW5kKSB7XG4gICAgcmV0dXJuIG5ldyBFeGVjdXRpb25DaGFpbkZhY3Rvcnkoa29tbWFuZCk7XG59XG5leHBvcnRzLmV4ZWN1dGVzID0gZXhlY3V0ZXM7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamNhYnJlc29zIG9uIDIvMTUvMTQuXG4gKi9cbnZhciBzaWduYWxDb3VudCA9IDA7XG5mdW5jdGlvbiBnZW5lcmF0ZVNpZ25hbElkKCkge1xuICAgIHZhciBuZXh0SWQgPSBzaWduYWxDb3VudCsrO1xuICAgIHJldHVybiBuZXh0SWQ7XG59XG52YXIgU2lnbmFsRGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2lnbmFsRGlzcGF0Y2hlcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICAgICAgdGhpcy5udW1MaXN0ZW5lcnMgPSAwO1xuICAgIH1cbiAgICBTaWduYWxEaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1tsaXN0ZW5lci5pZF0gPSBsaXN0ZW5lcjtcbiAgICAgICAgdGhpcy5udW1MaXN0ZW5lcnMrKztcbiAgICB9O1xuICAgIFNpZ25hbERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2xpc3RlbmVyLmlkXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5udW1MaXN0ZW5lcnMtLTtcbiAgICB9O1xuICAgIFNpZ25hbERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICAgICAgdGhpcy5udW1MaXN0ZW5lcnMgPSAwO1xuICAgIH07XG4gICAgU2lnbmFsRGlzcGF0Y2hlci5wcm90b3R5cGUuZ2V0TGlzdGVuZXJzTGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5udW1MaXN0ZW5lcnM7XG4gICAgfTtcbiAgICBTaWduYWxEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnNUbXAgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJzW2lkXTtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnJlY2VpdmVTaWduYWwocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLmNhbGxPbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzVG1wW2lkXSA9IHRoaXMubGlzdGVuZXJzW2lkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IGxpc3RlbmVyc1RtcDtcbiAgICB9O1xuICAgIHJldHVybiBTaWduYWxEaXNwYXRjaGVyO1xufSkoKTtcbmV4cG9ydHMuU2lnbmFsRGlzcGF0Y2hlciA9IFNpZ25hbERpc3BhdGNoZXI7XG52YXIgU2lnbmFsTGlzdGVuZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNpZ25hbExpc3RlbmVyKGNhbGxiYWNrLCB0YXJnZXQsIGNhbGxPbmNlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBnZW5lcmF0ZVNpZ25hbElkKCk7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuY2FsbE9uY2UgPSBjYWxsT25jZTtcbiAgICB9XG4gICAgU2lnbmFsTGlzdGVuZXIucHJvdG90eXBlLnJlY2VpdmVTaWduYWwgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICB0aGlzLmNhbGxiYWNrLmNhbGwodGhpcy50YXJnZXQsIHBheWxvYWQpO1xuICAgIH07XG4gICAgcmV0dXJuIFNpZ25hbExpc3RlbmVyO1xufSkoKTtcbmV4cG9ydHMuU2lnbmFsTGlzdGVuZXIgPSBTaWduYWxMaXN0ZW5lcjtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBzdGF0aWNmdW5jdGlvbiBvbiA4LzIwLzE0LlxuICovXG52YXIgc2lnbmFscyA9IHJlcXVpcmUoJ2tvbGEtc2lnbmFscycpO1xudmFyIEtvbnRleHRGYWN0b3J5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBLb250ZXh0RmFjdG9yeShnZW5lcmF0b3IpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSB0aGlzLmdldEluc3RhbmNlID0gZ2VuZXJhdG9yO1xuICAgIH1cbiAgICBLb250ZXh0RmFjdG9yeS5wcm90b3R5cGUuYXNTaW5nbGV0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLnNpbmdsZUluc3RhbmNlKVxuICAgICAgICAgICAgICAgIF90aGlzLnNpbmdsZUluc3RhbmNlID0gX3RoaXMuZ2VuZXJhdG9yKCk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2luZ2xlSW5zdGFuY2U7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gS29udGV4dEZhY3Rvcnk7XG59KSgpO1xuZXhwb3J0cy5Lb250ZXh0RmFjdG9yeSA9IEtvbnRleHRGYWN0b3J5O1xudmFyIFNpZ25hbEhvb2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNpZ25hbEhvb2soa29udGV4dCwgc2lnbmFsLCBob29rKSB7XG4gICAgICAgIHRoaXMua29udGV4dCA9IGtvbnRleHQ7XG4gICAgICAgIHRoaXMuc2lnbmFsID0gc2lnbmFsO1xuICAgICAgICB0aGlzLmhvb2sgPSBob29rO1xuICAgICAgICB0aGlzLmxpc3RlbmVyID0gbmV3IHNpZ25hbHMuU2lnbmFsTGlzdGVuZXIodGhpcy5vbkRpc3BhdGNoLCB0aGlzKTtcbiAgICB9XG4gICAgU2lnbmFsSG9vay5wcm90b3R5cGUub25EaXNwYXRjaCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIHRoaXMuaG9vay5leGVjdXRlKHBheWxvYWQsIHRoaXMua29udGV4dCk7XG4gICAgfTtcbiAgICBTaWduYWxIb29rLnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2lnbmFsLmFkZExpc3RlbmVyKHRoaXMubGlzdGVuZXIpO1xuICAgIH07XG4gICAgU2lnbmFsSG9vay5wcm90b3R5cGUuZGV0dGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zaWduYWwucmVtb3ZlTGlzdGVuZXIodGhpcy5saXN0ZW5lcik7XG4gICAgfTtcbiAgICBTaWduYWxIb29rLnByb3RvdHlwZS5ydW5PbmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyID0gbmV3IHNpZ25hbHMuU2lnbmFsTGlzdGVuZXIodGhpcy5vbkRpc3BhdGNoLCB0aGlzLCB0cnVlKTtcbiAgICB9O1xuICAgIHJldHVybiBTaWduYWxIb29rO1xufSkoKTtcbmV4cG9ydHMuU2lnbmFsSG9vayA9IFNpZ25hbEhvb2s7XG52YXIgS29udGV4dEltcGwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEtvbnRleHRJbXBsKHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgICAgIHRoaXMuc2lnbmFsSG9va3MgPSBbXTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMgPSB7fTtcbiAgICB9XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLmhhc1NpZ25hbCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpZ25hbHNbbmFtZV0gIT0gbnVsbDtcbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5zZXRTaWduYWwgPSBmdW5jdGlvbiAobmFtZSwgaG9vaykge1xuICAgICAgICB2YXIgc2lnbmFsID0gdGhpcy5nZXRTaWduYWwobmFtZSk7XG4gICAgICAgIGlmICghc2lnbmFsKVxuICAgICAgICAgICAgc2lnbmFsID0gdGhpcy5zaWduYWxzW25hbWVdID0gbmV3IHNpZ25hbHMuU2lnbmFsRGlzcGF0Y2hlcigpO1xuICAgICAgICB2YXIgc2lnSG9vaztcbiAgICAgICAgaWYgKGhvb2spIHtcbiAgICAgICAgICAgIHNpZ0hvb2sgPSBuZXcgU2lnbmFsSG9vayh0aGlzLCBzaWduYWwsIGhvb2spO1xuICAgICAgICAgICAgdGhpcy5zaWduYWxIb29rcy5wdXNoKHNpZ0hvb2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWdIb29rO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLmdldFNpZ25hbCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBzaWduYWwgPSB0aGlzLnNpZ25hbHNbbmFtZV07XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAmJiAhc2lnbmFsKSB7XG4gICAgICAgICAgICBzaWduYWwgPSB0aGlzLnBhcmVudC5nZXRTaWduYWwobmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpZ25hbDtcbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5zZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIChuYW1lLCBmYWN0b3J5KSB7XG4gICAgICAgIGlmICghZmFjdG9yeSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZXJyb3IgdHJ5aW5nIHRvIGRlZmluZSBpbnN0YW5jZTogJyArIG5hbWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXNbbmFtZV0gPSBuZXcgS29udGV4dEZhY3RvcnkoZmFjdG9yeSk7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHRoaXMuaW5zdGFuY2VzW25hbWVdO1xuICAgICAgICBpZiAoZmFjdG9yeSlcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5LmdldEluc3RhbmNlKCk7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRJbnN0YW5jZShuYW1lKTtcbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNpZ25hbEhvb2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnNpZ25hbEhvb2tzW2ldLmF0dGFjaCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNpZ25hbEhvb2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnNpZ25hbEhvb2tzW2ldLmRldHRhY2goKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEtvbnRleHRJbXBsO1xufSkoKTtcbmV4cG9ydHMuS29udGV4dEltcGwgPSBLb250ZXh0SW1wbDtcbnZhciBBcHAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFwcChwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5rb250ZXh0ID0gbmV3IEtvbnRleHRJbXBsKHRoaXMucGFyZW50LmtvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMua29udGV4dCA9IG5ldyBLb250ZXh0SW1wbCgpO1xuICAgIH1cbiAgICBBcHAucHJvdG90eXBlLm9uS29udGV4dCA9IGZ1bmN0aW9uIChrb250ZXh0LCBvcHRzKSB7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgICAgdGhpcy5zdGFydHVwT3B0aW9ucyA9IG9wdHM7XG4gICAgICAgIHRoaXMub25Lb250ZXh0KHRoaXMua29udGV4dCwgb3B0cyk7XG4gICAgICAgIHRoaXMua29udGV4dC5zdGFydCgpO1xuICAgICAgICB0aGlzLm9uU3RhcnQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLm9uU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICBBcHAucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5rb250ZXh0LnN0b3AoKTtcbiAgICAgICAgdGhpcy5vblN0b3AoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICByZXR1cm4gQXBwO1xufSkoKTtcbmV4cG9ydHMuQXBwID0gQXBwO1xuIl19
