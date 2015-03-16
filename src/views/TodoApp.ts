class TodoApp {

    rootNodes: HTMLElement[];
    parent: HTMLElement;
    header: HTMLElement;
    main: HTMLElement;
    footer: HTMLElement;

    constructor() {
        this.rootNodes = [];
        this.header = document.createElement('header');
        this.main = document.createElement('section');
        this.footer = document.createElement('footer');
        this.rootNodes.push(this.header);
        this.rootNodes.push(this.main);
        this.rootNodes.push(this.footer);
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

export = TodoApp;