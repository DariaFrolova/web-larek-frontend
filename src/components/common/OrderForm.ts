// OrderForm.ts
import { Form } from "./Form";
import { IOrderAdress, IOrderPersonalData, PaymentMethod } from "../../types";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface OrderFormState extends IOrderAdress, IOrderPersonalData {
    valid: boolean;
    errors: string[];
}

export class OrderForm extends Form<OrderFormState> {
    private paymentButtons: HTMLButtonElement[];
    private addressInput: HTMLInputElement;
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(formElement: HTMLFormElement, events: IEvents) {
        super(formElement, events);

        this.paymentButtons = Array.from(formElement.querySelectorAll('.payment-button'));
        this.addressInput = ensureElement<HTMLInputElement>('input[name="shippingAddress"]', formElement);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', formElement);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', formElement);

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const paymentMethod = button.dataset.paymentMethod as PaymentMethod;
                this.onInputChange('selectPaymentMethod', paymentMethod);
            });
        });
    }

    render(state: OrderFormState): HTMLFormElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.formElement;
    }
}
