class Main {

    rootNodes: HTMLElement[];
    parent: HTMLElement;
    toggleAll: HTMLInputElement;
    todoList: HTMLUListElement;

    constructor() {
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

export = Main;