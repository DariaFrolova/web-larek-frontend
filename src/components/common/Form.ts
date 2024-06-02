import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
// import { IOrderAddress } from '../../types';
// import { PaymentMethod } from '../../types';


export interface FormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<FormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & FormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}


// export interface FormState {
// 	valid: boolean;
// 	errors: string[];
// }

// export class Form<T> extends Component<FormState> {
// 	// private submitButton: HTMLButtonElement;
// 	// private errorElement: HTMLElement;
//     protected _submit: HTMLButtonElement;
//     protected _errors: HTMLElement;


//     // constructor(protected formElement: HTMLFormElement, protected events: IEvents) {
//     //     super(formElement);


// 	// 	this._submit = ensureElement<HTMLButtonElement>(
// 	// 		'button[type=submit]',
// 	// 		this.formElement
// 	// 	);
// 	// 	this._errors = ensureElement<HTMLElement>(
// 	// 		'.form__errors',
// 	// 		this.formElement
// 	// 	);

// 	// 	this.formElement.addEventListener('input', this.handleInput.bind(this));
// 	// 	this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
// 	// }

//     constructor(protected container: HTMLFormElement, protected events: IEvents) {
//         super(container);

//         this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
//         this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

//         this.container.addEventListener('input', (e: Event) => {
//             const target = e.target as HTMLInputElement;
//             const field = target.name as keyof T;
//             const value = target.value;
//             this.onInputChange(field, value);
//         });

//         this.container.addEventListener('submit', (e: Event) => {
//             e.preventDefault();
//             this.events.emit(`${this.container.name}:submit`);
//         });
//     }


//     // private handleInput(event: Event): void {
    
//     //     const target = event.target as HTMLInputElement;
//     //     const fieldName = target.name as keyof IOrderAddress; // Приведение типов
//     //     const value = target.value;
      
//     //     this.onInputChange(fieldName, value);
//     //   }


// 	// private handleSubmit(event: Event): void {
// 	// 	event.preventDefault();
// 	// 	this.events.emit(`${this.formElement.name}:submit`);
// 	// }

//     // НА ЭТОМ МЕСТЕ ОСТАНОВИЛИСЬ
// 	// private onInputChange(field: keyof IOrderAddress, value: string): void {
//     //     console.log('Вызов метода onInputChange()');
// 	// 	this.events.emit(`${this.formElement.name}.${String(field)}:change`, {
// 	// 		field,
// 	// 		value,
// 	// 	});
//     protected onInputChange(field: keyof T, value: string) {
//         this.events.emit(`${this.formElement.name}.${String(field)}:change`, {
//             field,
//             value
//         });
// 	}

// 	// set valid(isValid: boolean) {
// 	// 	this.submitButton.disabled = !isValid;
// 	// }

// 	// set errors(errorMessage: string) {
// 	// 	this.setText(this.errorElement, errorMessage);
// 	// }

//     set valid(value: boolean) {
//         this._submit.disabled = !value;
//     }

//     set errors(value: string) {
//         this.setText(this._errors, value);
//     }


//     // render(state: Partial<T> & FormState & { selectPaymentMethod: PaymentMethod | string; shippingAddress: string }): HTMLElement {
// 	// 	console.log('render state: Partial<T> & FormState & IOrderAddress вызван');

// 	// 	const { valid, errors, ...inputs } = state;
// 	// 	super.render({ valid, errors });
// 	// 	Object.assign(this, inputs);
// 	// 	return this.formElement;
// 	// }

//     render(state: Partial<T> & FormState) {
//         const {valid, errors, ...inputs} = state;
//         super.render({valid, errors});
//         Object.assign(this, inputs);
//         return this.container;

//     }
// }















// interface FormState {
//     valid: boolean;
//     errors: string[];
// }

// export class Form<T> extends Component<FormState> {
//     private submitButton: HTMLButtonElement;
//     private errorElement: HTMLElement;

//     constructor(private formElement: HTMLFormElement, private events: IEvents) {
//         super(formElement);

//         this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.formElement);
//         this.errorElement = ensureElement<HTMLElement>('.form__errors', this.formElement);

//         this.formElement.addEventListener('input', this.handleInput.bind(this));
//         this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
//     }

//     private handleInput(event: Event): void {
//         const target = event.target as HTMLInputElement;
//         const fieldName = target.name as keyof T;
//         const value = target.value;
//         this.onInputChange(fieldName, value);
//     }

//     private handleSubmit(event: Event): void {
//         event.preventDefault();
//         this.events.emit(`${this.formElement.name}:submit`);
//     }

//     private onInputChange(field: keyof T, value: string): void {
//         this.events.emit(`${this.formElement.name}.${String(field)}:change`, { field, value });
//     }

//     set valid(isValid: boolean) {
//         this.submitButton.disabled = !isValid;
//     }

//     set errors(errorMessage: string) {
//         this.setText(this.errorElement, errorMessage);
//     }

//     // render(state: Partial<T> & FormState): HTMLFormElement {
//         render(state: Partial<T> & FormState & IOrderAdress): HTMLElement {
//         const { valid, errors, ...inputs } = state;
//         super.render({ valid, errors });
//         Object.assign(this, inputs);
//         return this.formElement;
//     }
// }

// // Form.ts
// import {Component} from "../base/Component";
// import {IEvents} from "../base/events";
// import {ensureElement} from "../../utils/utils";

// interface FormState {
//     valid: boolean;
//     errors: string[];
// }

// export class Form<T> extends Component<FormState> {
//     private submitButton: HTMLButtonElement;
//     private errorElement: HTMLElement;

//     constructor(protected formElement: HTMLFormElement, private events: IEvents) {
//         super(formElement);

//         this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.formElement);
//         this.errorElement = ensureElement<HTMLElement>('.form__errors', this.formElement);

//         this.formElement.addEventListener('input', this.handleInput.bind(this));
//         this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
//     }

//     private handleInput(event: Event): void {
//         const target = event.target as HTMLInputElement;
//         const fieldName = target.name as keyof T;
//         const value = target.value;
//         this.onInputChange(fieldName, value);
//     }

//     private handleSubmit(event: Event): void {
//         event.preventDefault();
//         this.events.emit(`${this.formElement.name}:submit`);
//     }

//     protected onInputChange(field: keyof T, value: string): void {
//         this.events.emit(`${this.formElement.name}.${String(field)}:change`, { field, value });
//     }

//     set valid(isValid: boolean) {
//         this.submitButton.disabled = !isValid;
//     }

//     set errors(errorMessage: string) {
//         this.setText(this.errorElement, errorMessage);
//     }

//     render(state: Partial<T> & FormState): HTMLFormElement {
//         const { valid, errors, ...inputs } = state;
//         super.render({ valid, errors });
//         Object.assign(this, inputs);
//         return this.formElement;
//     }
// }
