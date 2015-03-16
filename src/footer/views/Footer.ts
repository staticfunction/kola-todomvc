class Footer {

    rootNodes: HTMLElement[];
    parent: HTMLElement;
    todoCount: HTMLElement;
    filters: HTMLUListElement;
    clearCompleted: HTMLButtonElement;

    constructor() {
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

export = Footer;