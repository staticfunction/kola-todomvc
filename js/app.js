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
var models = require('./models');
var main = require('./main/app');
var header = require('./header/app');
var footer = require('./footer/app');
var TodoAppView = require('./views/TodoApp');
var TodoApp = (function (_super) {
    __extends(TodoApp, _super);
    function TodoApp() {
        _super.apply(this, arguments);
    }
    TodoApp.prototype.onKontext = function (kontext, opts) {
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
        this.headerApp = new header.App(this).start(this.todoView.header);
        this.footerApp = new footer.App(this).start(this.todoView.footer);
        this.mainApp = new main.App(this).start(this.todoView.main);
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

},{"./footer/app":2,"./header/app":4,"./main/app":6,"./models":8,"./views/TodoApp":9,"kola":10}],2:[function(require,module,exports){
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

},{"./views/Footer":3,"kola":10}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
    App.prototype.onStart = function () {
        this.header = new Header();
        this.header.appendTo(this.startupOptions);
    };
    App.prototype.onStop = function () {
        this.header.remove();
    };
    return App;
})(kola.App);
exports.App = App;

},{"./views/Header":5,"kola":10}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./views/Main":7,"kola":10}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var Todo = (function () {
    function Todo() {
    }
    return Todo;
})();
exports.Todo = Todo;
var Todos = (function () {
    function Todos() {
    }
    Todos.prototype.addTodo = function () {
    };
    return Todos;
})();
exports.Todos = Todos;

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"kola-signals":11}],11:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hcHAuanMiLCJidWlsZC9mb290ZXIvYXBwLmpzIiwiYnVpbGQvZm9vdGVyL3ZpZXdzL0Zvb3Rlci5qcyIsImJ1aWxkL2hlYWRlci9hcHAuanMiLCJidWlsZC9oZWFkZXIvdmlld3MvSGVhZGVyLmpzIiwiYnVpbGQvbWFpbi9hcHAuanMiLCJidWlsZC9tYWluL3ZpZXdzL01haW4uanMiLCJidWlsZC9tb2RlbHMuanMiLCJidWlsZC92aWV3cy9Ub2RvQXBwLmpzIiwibm9kZV9tb2R1bGVzL2tvbGEvZGlzdC9rb2xhLmpzIiwibm9kZV9tb2R1bGVzL2tvbGEvbm9kZV9tb2R1bGVzL2tvbGEtc2lnbmFscy9kaXN0L3NpZ25hbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgX19leHRlbmRzID0gdGhpcy5fX2V4dGVuZHMgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbi8qKlxuICogQ3JlYXRlZCBieSBqY2FicmVzb3Mgb24gMy8xMy8xNS5cbiAqL1xudmFyIGtvbGEgPSByZXF1aXJlKCdrb2xhJyk7XG52YXIgbW9kZWxzID0gcmVxdWlyZSgnLi9tb2RlbHMnKTtcbnZhciBtYWluID0gcmVxdWlyZSgnLi9tYWluL2FwcCcpO1xudmFyIGhlYWRlciA9IHJlcXVpcmUoJy4vaGVhZGVyL2FwcCcpO1xudmFyIGZvb3RlciA9IHJlcXVpcmUoJy4vZm9vdGVyL2FwcCcpO1xudmFyIFRvZG9BcHBWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9Ub2RvQXBwJyk7XG52YXIgVG9kb0FwcCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFRvZG9BcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVG9kb0FwcCgpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uS29udGV4dCA9IGZ1bmN0aW9uIChrb250ZXh0LCBvcHRzKSB7XG4gICAgICAgIGtvbnRleHQuc2V0SW5zdGFuY2UoJ3RvZG9zJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBtb2RlbHMuVG9kb3MoKTtcbiAgICAgICAgfSkuYXNTaW5nbGV0b24oKTtcbiAgICAgICAga29udGV4dC5zZXRJbnN0YW5jZSgndG9kbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgbW9kZWxzLlRvZG8oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGtvbnRleHQuc2V0SW5zdGFuY2UoJ3ZpZXcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0cztcbiAgICAgICAgfSkuYXNTaW5nbGV0b24oKTtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5vbktvbnRleHQuY2FsbCh0aGlzLCBrb250ZXh0LCBvcHRzKTtcbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudG9kb1ZpZXcgPSBuZXcgVG9kb0FwcFZpZXcoKTtcbiAgICAgICAgdGhpcy50b2RvVmlldy5hcHBlbmRUbyh0aGlzLnN0YXJ0dXBPcHRpb25zKTtcbiAgICAgICAgdGhpcy5oZWFkZXJBcHAgPSBuZXcgaGVhZGVyLkFwcCh0aGlzKS5zdGFydCh0aGlzLnRvZG9WaWV3LmhlYWRlcik7XG4gICAgICAgIHRoaXMuZm9vdGVyQXBwID0gbmV3IGZvb3Rlci5BcHAodGhpcykuc3RhcnQodGhpcy50b2RvVmlldy5mb290ZXIpO1xuICAgICAgICB0aGlzLm1haW5BcHAgPSBuZXcgbWFpbi5BcHAodGhpcykuc3RhcnQodGhpcy50b2RvVmlldy5tYWluKTtcbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50b2RvVmlldy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5oZWFkZXJBcHAuc3RvcCgpO1xuICAgICAgICB0aGlzLmZvb3RlckFwcC5zdG9wKCk7XG4gICAgICAgIHRoaXMubWFpbkFwcC5zdG9wKCk7XG4gICAgfTtcbiAgICByZXR1cm4gVG9kb0FwcDtcbn0pKGtvbGEuQXBwKTtcbmV4cG9ydHMuVG9kb0FwcCA9IFRvZG9BcHA7XG52YXIgdG9kb0FwcCA9IG5ldyBUb2RvQXBwKCkuc3RhcnQod2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2RvYXBwJykpO1xuIiwidmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgX18oKTtcbn07XG4vKipcbiAqIENyZWF0ZWQgYnkgamNhYnJlc29zIG9uIDMvMTMvMTUuXG4gKi9cbnZhciBrb2xhID0gcmVxdWlyZSgna29sYScpO1xudmFyIEZvb3RlciA9IHJlcXVpcmUoJy4vdmlld3MvRm9vdGVyJyk7XG52YXIgQXBwID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXBwLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFwcCgpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5mb290ZXIgPSBuZXcgRm9vdGVyKCk7XG4gICAgICAgIHRoaXMuZm9vdGVyLmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgfTtcbiAgICByZXR1cm4gQXBwO1xufSkoa29sYS5BcHApO1xuZXhwb3J0cy5BcHAgPSBBcHA7XG4iLCJ2YXIgRm9vdGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGb290ZXIoKSB7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzID0gW107XG4gICAgICAgIHRoaXMudG9kb0NvdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICB0aGlzLnRvZG9Db3VudC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RvZG8tY291bnQnKTtcbiAgICAgICAgdmFyIG4xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3Ryb25nJyk7XG4gICAgICAgIHZhciBuMiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcwJyk7XG4gICAgICAgIHZhciBuMyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgaXRlbSBsZWZ0Jyk7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgIHRoaXMuZmlsdGVycy5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2ZpbHRlcnMnKTtcbiAgICAgICAgdmFyIG41ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgdmFyIG42ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBuNi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgIG42LnNldEF0dHJpYnV0ZSgnaHJlZicsICcjLycpO1xuICAgICAgICB2YXIgbjcgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQWxsJyk7XG4gICAgICAgIHZhciBuOCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHZhciBuOSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbjkuc2V0QXR0cmlidXRlKCdocmVmJywgJyMvYWN0aXZlJyk7XG4gICAgICAgIHZhciBuMTAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQWN0aXZlJyk7XG4gICAgICAgIHZhciBuMTEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgbjEyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBuMTIuc2V0QXR0cmlidXRlKCdocmVmJywgJyMvY29tcGxldGVkJyk7XG4gICAgICAgIHZhciBuMTMgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQ29tcGxldGVkJyk7XG4gICAgICAgIHRoaXMuY2xlYXJDb21wbGV0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgdGhpcy5jbGVhckNvbXBsZXRlZC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2NsZWFyLWNvbXBsZXRlZCcpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMudG9kb0NvdW50KTtcbiAgICAgICAgdGhpcy50b2RvQ291bnQuYXBwZW5kQ2hpbGQobjEpO1xuICAgICAgICBuMS5hcHBlbmRDaGlsZChuMik7XG4gICAgICAgIHRoaXMudG9kb0NvdW50LmFwcGVuZENoaWxkKG4zKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLmZpbHRlcnMpO1xuICAgICAgICB0aGlzLmZpbHRlcnMuYXBwZW5kQ2hpbGQobjUpO1xuICAgICAgICBuNS5hcHBlbmRDaGlsZChuNik7XG4gICAgICAgIG42LmFwcGVuZENoaWxkKG43KTtcbiAgICAgICAgdGhpcy5maWx0ZXJzLmFwcGVuZENoaWxkKG44KTtcbiAgICAgICAgbjguYXBwZW5kQ2hpbGQobjkpO1xuICAgICAgICBuOS5hcHBlbmRDaGlsZChuMTApO1xuICAgICAgICB0aGlzLmZpbHRlcnMuYXBwZW5kQ2hpbGQobjExKTtcbiAgICAgICAgbjExLmFwcGVuZENoaWxkKG4xMik7XG4gICAgICAgIG4xMi5hcHBlbmRDaGlsZChuMTMpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMuY2xlYXJDb21wbGV0ZWQpO1xuICAgIH1cbiAgICBGb290ZXIucHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEZvb3Rlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMucGFyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gRm9vdGVyO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gRm9vdGVyO1xuIiwidmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgX18oKTtcbn07XG4vKipcbiAqIENyZWF0ZWQgYnkgamNhYnJlc29zIG9uIDMvMTMvMTUuXG4gKi9cbnZhciBrb2xhID0gcmVxdWlyZSgna29sYScpO1xudmFyIEhlYWRlciA9IHJlcXVpcmUoJy4vdmlld3MvSGVhZGVyJyk7XG52YXIgQXBwID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXBwLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFwcCgpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBuZXcgSGVhZGVyKCk7XG4gICAgICAgIHRoaXMuaGVhZGVyLmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyLnJlbW92ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIEFwcDtcbn0pKGtvbGEuQXBwKTtcbmV4cG9ydHMuQXBwID0gQXBwO1xuIiwidmFyIEhlYWRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSGVhZGVyKCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB2YXIgbjAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgICAgICB2YXIgbjEgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgndG9kb3MnKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvLnNldEF0dHJpYnV0ZSgnaWQnLCAnbmV3LXRvZG8nKTtcbiAgICAgICAgdGhpcy5uZXdUb2RvLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnV2hhdCBuZWVkcyB0byBiZSBkb25lPycpO1xuICAgICAgICB0aGlzLm5ld1RvZG8uc2V0QXR0cmlidXRlKCdhdXRvZm9jdXMnLCAnJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2gobjApO1xuICAgICAgICBuMC5hcHBlbmRDaGlsZChuMSk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5uZXdUb2RvKTtcbiAgICB9XG4gICAgSGVhZGVyLnByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBIZWFkZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIEhlYWRlcjtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlcjtcbiIsInZhciBfX2V4dGVuZHMgPSB0aGlzLl9fZXh0ZW5kcyB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xuLyoqXG4gKiBDcmVhdGVkIGJ5IGpjYWJyZXNvcyBvbiAzLzEzLzE1LlxuICovXG52YXIga29sYSA9IHJlcXVpcmUoJ2tvbGEnKTtcbnZhciBNYWluID0gcmVxdWlyZSgnLi92aWV3cy9NYWluJyk7XG52YXIgQXBwID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXBwLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFwcCgpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tYWluID0gbmV3IE1haW4oKTtcbiAgICAgICAgdGhpcy5tYWluLmFwcGVuZFRvKHRoaXMuc3RhcnR1cE9wdGlvbnMpO1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubWFpbi5yZW1vdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KShrb2xhLkFwcCk7XG5leHBvcnRzLkFwcCA9IEFwcDtcbiIsInZhciBNYWluID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYWluKCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMudG9nZ2xlQWxsLnNldEF0dHJpYnV0ZSgnaWQnLCAndG9nZ2xlLWFsbCcpO1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgICAgdmFyIG4xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgbjEuc2V0QXR0cmlidXRlKCdmb3InLCAndG9nZ2xlLWFsbCcpO1xuICAgICAgICB2YXIgbjIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTWFyayBhbGwgYXMgY29tcGxldGUnKTtcbiAgICAgICAgdGhpcy50b2RvTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgIHRoaXMudG9kb0xpc3Quc2V0QXR0cmlidXRlKCdpZCcsICd0b2RvLWxpc3QnKTtcbiAgICAgICAgdmFyIG40ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbjQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjb21wbGV0ZWQnKTtcbiAgICAgICAgdmFyIG41ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG41LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndmlldycpO1xuICAgICAgICB2YXIgbjYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBuNi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RvZ2dsZScpO1xuICAgICAgICBuNi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgICAgbjYuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJycpO1xuICAgICAgICB2YXIgbjcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICB2YXIgbjggPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnVGFzdGUgSmF2YVNjcmlwdCcpO1xuICAgICAgICB2YXIgbjkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgbjkuc2V0QXR0cmlidXRlKCdjbGFzcycsICdkZXN0cm95Jyk7XG4gICAgICAgIHZhciBuMTAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBuMTAuc2V0QXR0cmlidXRlKCdjbGFzcycsICdlZGl0Jyk7XG4gICAgICAgIG4xMC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ0NyZWF0ZSBhIFRvZG9NVkMgdGVtcGxhdGUnKTtcbiAgICAgICAgdmFyIG4xMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHZhciBuMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbjEyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndmlldycpO1xuICAgICAgICB2YXIgbjEzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgbjEzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndG9nZ2xlJyk7XG4gICAgICAgIG4xMy5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgICAgdmFyIG4xNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIHZhciBuMTUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQnV5IGEgdW5pY29ybicpO1xuICAgICAgICB2YXIgbjE2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIG4xNi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Rlc3Ryb3knKTtcbiAgICAgICAgdmFyIG4xNyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIG4xNy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2VkaXQnKTtcbiAgICAgICAgbjE3LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnUnVsZSB0aGUgd2ViJyk7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy50b2dnbGVBbGwpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKG4xKTtcbiAgICAgICAgbjEuYXBwZW5kQ2hpbGQobjIpO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5wdXNoKHRoaXMudG9kb0xpc3QpO1xuICAgICAgICB0aGlzLnRvZG9MaXN0LmFwcGVuZENoaWxkKG40KTtcbiAgICAgICAgbjQuYXBwZW5kQ2hpbGQobjUpO1xuICAgICAgICBuNS5hcHBlbmRDaGlsZChuNik7XG4gICAgICAgIG41LmFwcGVuZENoaWxkKG43KTtcbiAgICAgICAgbjcuYXBwZW5kQ2hpbGQobjgpO1xuICAgICAgICBuNS5hcHBlbmRDaGlsZChuOSk7XG4gICAgICAgIG40LmFwcGVuZENoaWxkKG4xMCk7XG4gICAgICAgIHRoaXMudG9kb0xpc3QuYXBwZW5kQ2hpbGQobjExKTtcbiAgICAgICAgbjExLmFwcGVuZENoaWxkKG4xMik7XG4gICAgICAgIG4xMi5hcHBlbmRDaGlsZChuMTMpO1xuICAgICAgICBuMTIuYXBwZW5kQ2hpbGQobjE0KTtcbiAgICAgICAgbjE0LmFwcGVuZENoaWxkKG4xNSk7XG4gICAgICAgIG4xMi5hcHBlbmRDaGlsZChuMTYpO1xuICAgICAgICBuMTEuYXBwZW5kQ2hpbGQobjE3KTtcbiAgICB9XG4gICAgTWFpbi5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTWFpbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMucGFyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnJvb3ROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gTWFpbjtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IE1haW47XG4iLCJ2YXIgVG9kbyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVG9kbygpIHtcbiAgICB9XG4gICAgcmV0dXJuIFRvZG87XG59KSgpO1xuZXhwb3J0cy5Ub2RvID0gVG9kbztcbnZhciBUb2RvcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVG9kb3MoKSB7XG4gICAgfVxuICAgIFRvZG9zLnByb3RvdHlwZS5hZGRUb2RvID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgcmV0dXJuIFRvZG9zO1xufSkoKTtcbmV4cG9ydHMuVG9kb3MgPSBUb2RvcztcbiIsInZhciBUb2RvQXBwID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUb2RvQXBwKCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlcyA9IFtdO1xuICAgICAgICB0aGlzLmhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpO1xuICAgICAgICB0aGlzLmhlYWRlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2hlYWRlcicpO1xuICAgICAgICB0aGlzLm1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWN0aW9uJyk7XG4gICAgICAgIHRoaXMubWFpbi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21haW4nKTtcbiAgICAgICAgdGhpcy5mb290ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb290ZXInKTtcbiAgICAgICAgdGhpcy5mb290ZXIuc2V0QXR0cmlidXRlKCdpZCcsICdmb290ZXInKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLmhlYWRlcik7XG4gICAgICAgIHRoaXMucm9vdE5vZGVzLnB1c2godGhpcy5tYWluKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMucHVzaCh0aGlzLmZvb3Rlcik7XG4gICAgfVxuICAgIFRvZG9BcHAucHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFRvZG9BcHAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yb290Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIFRvZG9BcHA7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBUb2RvQXBwO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHN0YXRpY2Z1bmN0aW9uIG9uIDgvMjAvMTQuXG4gKi9cbnZhciBzaWduYWxzID0gcmVxdWlyZSgna29sYS1zaWduYWxzJyk7XG52YXIgS29udGV4dEZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEtvbnRleHRGYWN0b3J5KGdlbmVyYXRvcikge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UgPSBnZW5lcmF0b3I7XG4gICAgfVxuICAgIEtvbnRleHRGYWN0b3J5LnByb3RvdHlwZS5hc1NpbmdsZXRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghX3RoaXMuc2luZ2xlSW5zdGFuY2UpXG4gICAgICAgICAgICAgICAgX3RoaXMuc2luZ2xlSW5zdGFuY2UgPSBfdGhpcy5nZW5lcmF0b3IoKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zaW5nbGVJbnN0YW5jZTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBLb250ZXh0RmFjdG9yeTtcbn0pKCk7XG5leHBvcnRzLktvbnRleHRGYWN0b3J5ID0gS29udGV4dEZhY3Rvcnk7XG52YXIgU2lnbmFsSG9vayA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2lnbmFsSG9vayhrb250ZXh0LCBzaWduYWwsIGhvb2spIHtcbiAgICAgICAgdGhpcy5rb250ZXh0ID0ga29udGV4dDtcbiAgICAgICAgdGhpcy5zaWduYWwgPSBzaWduYWw7XG4gICAgICAgIHRoaXMuaG9vayA9IGhvb2s7XG4gICAgICAgIHRoaXMubGlzdGVuZXIgPSBuZXcgc2lnbmFscy5TaWduYWxMaXN0ZW5lcih0aGlzLm9uRGlzcGF0Y2gsIHRoaXMpO1xuICAgIH1cbiAgICBTaWduYWxIb29rLnByb3RvdHlwZS5vbkRpc3BhdGNoID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgdGhpcy5ob29rLmV4ZWN1dGUocGF5bG9hZCwgdGhpcy5rb250ZXh0KTtcbiAgICB9O1xuICAgIFNpZ25hbEhvb2sucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zaWduYWwuYWRkTGlzdGVuZXIodGhpcy5saXN0ZW5lcik7XG4gICAgfTtcbiAgICBTaWduYWxIb29rLnByb3RvdHlwZS5kZXR0YWNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNpZ25hbC5yZW1vdmVMaXN0ZW5lcih0aGlzLmxpc3RlbmVyKTtcbiAgICB9O1xuICAgIFNpZ25hbEhvb2sucHJvdG90eXBlLnJ1bk9uY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXIgPSBuZXcgc2lnbmFscy5TaWduYWxMaXN0ZW5lcih0aGlzLm9uRGlzcGF0Y2gsIHRoaXMsIHRydWUpO1xuICAgIH07XG4gICAgcmV0dXJuIFNpZ25hbEhvb2s7XG59KSgpO1xuZXhwb3J0cy5TaWduYWxIb29rID0gU2lnbmFsSG9vaztcbnZhciBLb250ZXh0SW1wbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gS29udGV4dEltcGwocGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnNpZ25hbHMgPSB7fTtcbiAgICAgICAgdGhpcy5zaWduYWxIb29rcyA9IFtdO1xuICAgICAgICB0aGlzLmluc3RhbmNlcyA9IHt9O1xuICAgIH1cbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuaGFzU2lnbmFsID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2lnbmFsc1tuYW1lXSAhPSBudWxsO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLnNldFNpZ25hbCA9IGZ1bmN0aW9uIChuYW1lLCBob29rKSB7XG4gICAgICAgIHZhciBzaWduYWwgPSB0aGlzLmdldFNpZ25hbChuYW1lKTtcbiAgICAgICAgaWYgKCFzaWduYWwpXG4gICAgICAgICAgICBzaWduYWwgPSB0aGlzLnNpZ25hbHNbbmFtZV0gPSBuZXcgc2lnbmFscy5TaWduYWxEaXNwYXRjaGVyKCk7XG4gICAgICAgIHZhciBzaWdIb29rO1xuICAgICAgICBpZiAoaG9vaykge1xuICAgICAgICAgICAgc2lnSG9vayA9IG5ldyBTaWduYWxIb29rKHRoaXMsIHNpZ25hbCwgaG9vayk7XG4gICAgICAgICAgICB0aGlzLnNpZ25hbEhvb2tzLnB1c2goc2lnSG9vayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpZ0hvb2s7XG4gICAgfTtcbiAgICBLb250ZXh0SW1wbC5wcm90b3R5cGUuZ2V0U2lnbmFsID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIHNpZ25hbCA9IHRoaXMuc2lnbmFsc1tuYW1lXTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICYmICFzaWduYWwpIHtcbiAgICAgICAgICAgIHNpZ25hbCA9IHRoaXMucGFyZW50LmdldFNpZ25hbChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2lnbmFsO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLnNldEluc3RhbmNlID0gZnVuY3Rpb24gKG5hbWUsIGZhY3RvcnkpIHtcbiAgICAgICAgaWYgKCFmYWN0b3J5KVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdlcnJvciB0cnlpbmcgdG8gZGVmaW5lIGluc3RhbmNlOiAnICsgbmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc1tuYW1lXSA9IG5ldyBLb250ZXh0RmFjdG9yeShmYWN0b3J5KTtcbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0gdGhpcy5pbnN0YW5jZXNbbmFtZV07XG4gICAgICAgIGlmIChmYWN0b3J5KVxuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnkuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldEluc3RhbmNlKG5hbWUpO1xuICAgIH07XG4gICAgS29udGV4dEltcGwucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2lnbmFsSG9va3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2lnbmFsSG9va3NbaV0uYXR0YWNoKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEtvbnRleHRJbXBsLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2lnbmFsSG9va3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2lnbmFsSG9va3NbaV0uZGV0dGFjaCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gS29udGV4dEltcGw7XG59KSgpO1xuZXhwb3J0cy5Lb250ZXh0SW1wbCA9IEtvbnRleHRJbXBsO1xudmFyIEFwcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQXBwKHBhcmVudCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRleHQgPSBuZXcgS29udGV4dEltcGwodGhpcy5wYXJlbnQua29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5rb250ZXh0ID0gbmV3IEtvbnRleHRJbXBsKCk7XG4gICAgfVxuICAgIEFwcC5wcm90b3R5cGUub25Lb250ZXh0ID0gZnVuY3Rpb24gKGtvbnRleHQsIG9wdHMpIHtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAob3B0cykge1xuICAgICAgICB0aGlzLnN0YXJ0dXBPcHRpb25zID0gb3B0cztcbiAgICAgICAgdGhpcy5vbktvbnRleHQodGhpcy5rb250ZXh0LCBvcHRzKTtcbiAgICAgICAgdGhpcy5rb250ZXh0LnN0YXJ0KCk7XG4gICAgICAgIHRoaXMub25TdGFydCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIEFwcC5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIH07XG4gICAgQXBwLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmtvbnRleHQuc3RvcCgpO1xuICAgICAgICB0aGlzLm9uU3RvcCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHJldHVybiBBcHA7XG59KSgpO1xuZXhwb3J0cy5BcHAgPSBBcHA7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamNhYnJlc29zIG9uIDIvMTUvMTQuXG4gKi9cbnZhciBzaWduYWxDb3VudCA9IDA7XG5mdW5jdGlvbiBnZW5lcmF0ZVNpZ25hbElkKCkge1xuICAgIHZhciBuZXh0SWQgPSBzaWduYWxDb3VudCsrO1xuICAgIHJldHVybiBuZXh0SWQ7XG59XG52YXIgU2lnbmFsRGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2lnbmFsRGlzcGF0Y2hlcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICAgICAgdGhpcy5udW1MaXN0ZW5lcnMgPSAwO1xuICAgIH1cbiAgICBTaWduYWxEaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1tsaXN0ZW5lci5pZF0gPSBsaXN0ZW5lcjtcbiAgICAgICAgdGhpcy5udW1MaXN0ZW5lcnMrKztcbiAgICB9O1xuICAgIFNpZ25hbERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2xpc3RlbmVyLmlkXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5udW1MaXN0ZW5lcnMtLTtcbiAgICB9O1xuICAgIFNpZ25hbERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICAgICAgdGhpcy5udW1MaXN0ZW5lcnMgPSAwO1xuICAgIH07XG4gICAgU2lnbmFsRGlzcGF0Y2hlci5wcm90b3R5cGUuZ2V0TGlzdGVuZXJzTGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5udW1MaXN0ZW5lcnM7XG4gICAgfTtcbiAgICBTaWduYWxEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnNUbXAgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJzW2lkXTtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnJlY2VpdmVTaWduYWwocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLmNhbGxPbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzVG1wW2lkXSA9IHRoaXMubGlzdGVuZXJzW2lkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IGxpc3RlbmVyc1RtcDtcbiAgICB9O1xuICAgIHJldHVybiBTaWduYWxEaXNwYXRjaGVyO1xufSkoKTtcbmV4cG9ydHMuU2lnbmFsRGlzcGF0Y2hlciA9IFNpZ25hbERpc3BhdGNoZXI7XG52YXIgU2lnbmFsTGlzdGVuZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNpZ25hbExpc3RlbmVyKGNhbGxiYWNrLCB0YXJnZXQsIGNhbGxPbmNlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBnZW5lcmF0ZVNpZ25hbElkKCk7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuY2FsbE9uY2UgPSBjYWxsT25jZTtcbiAgICB9XG4gICAgU2lnbmFsTGlzdGVuZXIucHJvdG90eXBlLnJlY2VpdmVTaWduYWwgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICB0aGlzLmNhbGxiYWNrLmNhbGwodGhpcy50YXJnZXQsIHBheWxvYWQpO1xuICAgIH07XG4gICAgcmV0dXJuIFNpZ25hbExpc3RlbmVyO1xufSkoKTtcbmV4cG9ydHMuU2lnbmFsTGlzdGVuZXIgPSBTaWduYWxMaXN0ZW5lcjtcbiJdfQ==
