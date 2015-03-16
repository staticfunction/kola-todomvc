class Main {

    rootNodes: HTMLElement[];
    parent: HTMLElement;
    toggleAll: HTMLInputElement;
    todoList: HTMLUListElement;

    constructor() {
        this.rootNodes = [];
        this.toggleAll = document.createElement('input');
        this.toggleAll.setAttribute('type', 'checkbox');
        var n1 = document.createElement('label');
        n1.setAttribute('for', 'toggle-all');
        var n2 = document.createTextNode('Mark all as complete');
        this.todoList = document.createElement('ul');
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