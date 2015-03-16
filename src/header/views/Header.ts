class Header {

    rootNodes: HTMLElement[];
    parent: HTMLElement;
    newTodo: HTMLInputElement;

    constructor() {
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

    appendTo(parent:HTMLElement): void {
        this.remove();
        this.parent = parent;
        this.rootNodes.forEach((node:HTMLElement) => {
            this.parent.appendChild(node);
        });
    }
    remove(): void {
        if(!this.parent)
            return;
        this.rootNodes.forEach((node:HTMLElement) => {
            this.parent.removeChild(node);
        });
        this.parent = null;
    }
}

export = Header;