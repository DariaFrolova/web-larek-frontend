import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.initElements();
        this.attachEventListeners();
    }

    private initElements() {
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._content = ensureElement<HTMLElement>('.modal__content', this.container);
    }

    private attachEventListeners() {
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement | null) {
        this._content.replaceChildren(value);
    }

    open() {
        console.log('open from modal ts вызван');
        
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {

        console.log('close from modal ts вызван');

        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {

        console.log('render from modal ts вызван');

        super.render(data);
        this.open();
        return this.container;
    }

}
