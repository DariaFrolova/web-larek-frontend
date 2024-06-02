import { IOrderAddress, IOrderPersonalData, PaymentMethod } from "../types";
import { IEvents } from "./base/events";
import { Form, FormState } from "./common/Form";

export class ContactsOrder extends Form<IOrderPersonalData> {
    private form: HTMLFormElement;
    // selectPaymentMethod: boolean;
    selectPaymentMethod: PaymentMethod | null;
    // shippingAddress: boolean;
    shippingAddress: string;
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.form = container;
        this.registerEvents();
    }

    set phone(value: string) {
        (this.form.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.form.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    open() {
        this.form.classList.add('active');
    }

    close() {
        this.form.classList.remove('active');
    }

    // render(state: Partial<IOrderPersonalData> & FormState & { selectPaymentMethod: PaymentMethodData | string; shippingAddress: string }): HTMLElement {
    //     return super.render(state);
    // }

    render(state: Partial<IOrderPersonalData> & FormState & { selectPaymentMethod: PaymentMethodData | string; shippingAddress: string }): HTMLFormElement {
        return super.render(state);
    }
    

    private registerEvents() {
        const phoneInput = this.form.elements.namedItem('phone') as HTMLInputElement;
        const emailInput = this.form.elements.namedItem('email') as HTMLInputElement;

        phoneInput.addEventListener('input', () => {
            this.events.emit('contacts.phone:change', { value: phoneInput.value });
        });

        emailInput.addEventListener('input', () => {
            this.events.emit('contacts.email:change', { value: emailInput.value });
        });
    }
}


// import { IOrderAddress, IOrderPersonalData } from "../types";
// import { IEvents } from "./base/events";
// import { Form, FormState } from "./common/Form";


// export class ContactsOrder extends Form<IOrderPersonalData> {
//     // static render: any;
//     // [x: string]: any;
//     private form: HTMLFormElement;
    
//     constructor(container: HTMLFormElement, events: IEvents) {
//         super(container, events);
//         this.form = container;
//     }

//     set phone(value: string) {
//         (this.form.elements.namedItem('phone') as HTMLInputElement).value = value;
//     }

//     set email(value: string) {
//         (this.form.elements.namedItem('email') as HTMLInputElement).value = value;
//     }

//     open() {
//         this.form.classList.add('active');
//     }

//     close() {
//         this.form.classList.remove('active');
//     }

//     // render(state: Partial<IOrderPersonalData> & FormState & IOrderAddress): HTMLElement {
//     //     return super.render(state);
//     // }

//     render(state: Partial<IOrderPersonalData> & FormState & { selectPaymentMethod: PaymentMethodData | string; shippingAddress: string }): HTMLElement {
//         return super.render(state);
//     }

//     // render(state: Partial<IOrderPersonalData> & FormState): HTMLElement {
//     //     return super.render(state);
//     //   }
//     // render(state: Partial<IOrderPersonalData> & FormState & IOrderAddress): HTMLElement {
//     //     // Добавляем метод render в класс ContactsOrder
//     //     const element = document.createElement('div');
//     //     element.innerText = JSON.stringify(state);
//     //     return element;
//     // }
// }





//старье


// export class ContactsOrder extends Form<IOrderPersonalData> {
//     private form: HTMLFormElement;
    
//     constructor(container: HTMLFormElement, events: IEvents) {
//         super(container, events);
//         this.form = container;
//     }

//     set phone(value: string) {
//         (this.form.elements.namedItem('phone') as HTMLInputElement).value = value;
//     }

//     set email(value: string) {
//         (this.form.elements.namedItem('email') as HTMLInputElement).value = value;
//     }

//     open() {
//         this.form.classList.add('active');
//     }

//     close() {
//         this.form.classList.remove('active');
//     }

//     render(state: Partial<IOrderPersonalData> & FormState & IOrderAdress): HTMLElement {
//         return super.render(state);
//     }
// }



// export class ContactsOrder extends Form<IOrderPersonalData> {
//     private form: HTMLFormElement;
//     static render: any;
    
//     constructor(container: HTMLFormElement, events: IEvents) {
//         super(container, events);
//         this.form = container;
//     }

//     set phone(value: string) {
//         (this.form.elements.namedItem('phone') as HTMLInputElement).value = value;
//     }

//     set email(value: string) {
//         (this.form.elements.namedItem('email') as HTMLInputElement).value = value;
//     }

//     open() {
//         this.form.classList.add('active');
//     }

//     close() {
//         this.form.classList.remove('active');
//     }

//     render(state: Partial<IOrderPersonalData> & FormState & IOrderAdress): HTMLElement {
//         return super.render(state);
//     }
//         // Handle errors if needed
//         // You can remove return or handle errors as needed
//     }





// import { Form } from "./common/Form";
// import { IOrderPersonalData } from "../types";
// import { IEvents } from "./base/events";

// export class ContactsOrder extends Form<IOrderPersonalData> {
//     private form: HTMLFormElement; // добавляем это свойство
//     static render: any;
//     constructor(container: HTMLFormElement, events: IEvents) {
//         super(container, events);
//         this.form = container; // инициализируем его здесь
//     }

//     set phone(value: string) {
//         (this.form.elements.namedItem('phone') as HTMLInputElement).value = value;
//     }

//     set email(value: string) {
//         (this.form.elements.namedItem('email') as HTMLInputElement).value = value;
//     }
    
// }

