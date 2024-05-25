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

//     render(state: Partial<T> & FormState): HTMLFormElement {
//         const { valid, errors, ...inputs } = state;
//         super.render({ valid, errors });
//         Object.assign(this, inputs);
//         return this.formElement;
//     }
// }

// Form.ts
import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";

interface FormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<FormState> {
    private submitButton: HTMLButtonElement;
    private errorElement: HTMLElement;

    constructor(protected formElement: HTMLFormElement, private events: IEvents) {
        super(formElement);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.formElement);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.formElement);

        this.formElement.addEventListener('input', this.handleInput.bind(this));
        this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private handleInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const fieldName = target.name as keyof T;
        const value = target.value;
        this.onInputChange(fieldName, value);
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        this.events.emit(`${this.formElement.name}:submit`);
    }

    protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`${this.formElement.name}.${String(field)}:change`, { field, value });
    }

    set valid(isValid: boolean) {
        this.submitButton.disabled = !isValid;
    }

    set errors(errorMessage: string) {
        this.setText(this.errorElement, errorMessage);
    }

    render(state: Partial<T> & FormState): HTMLFormElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.formElement;
    }
}
