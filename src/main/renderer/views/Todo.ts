class Todo {

    rootNodes: HTMLElement[];
    parent: HTMLElement;
    todo: HTMLLIElement;
    completed: HTMLInputElement;
    description: HTMLLabelElement;
    destroy: HTMLButtonElement;
    edit: HTMLInputElement;

    constructor() {
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

export = Todo;