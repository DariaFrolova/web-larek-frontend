import { Form } from "./common/Form";
import { IOrderAdress } from "../types";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class OrderAddress extends Form<IOrderAdress> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

        this._buttons.forEach((element) => {
            element.addEventListener('click', (event: MouseEvent) => {
                const target = event.target as HTMLButtonElement;
                const name = target.name;
                this.setButtonClass(name);
                events.emit('payment:changed', { target: name });
            });
        });
    }

    setButtonClass(name: string): void {
        this._buttons.forEach((button) => {
            if (button.name === name) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(address: string) {
        const form = this.container as HTMLFormElement;
        const addressInput = form.elements.namedItem('address') as HTMLInputElement;
        if (addressInput) {
            addressInput.value = address;
        }
    }
}


