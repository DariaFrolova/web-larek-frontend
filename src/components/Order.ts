import { Form } from "./common/Form";
import { IOrderAddress } from "../types";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { PaymentMethod } from "../types";


export class OrderAddress extends Form<IOrderAddress> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

        this._buttons.forEach((element) =>
            element.addEventListener('click', (event: MouseEvent) => {
                const target = event.target as HTMLButtonElement;
                const name = target.name;
                this.setButtonClass(name);
                events.emit('payment:changed', { target: name });
            })
        );
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
        const addressInput = this.container.querySelector('input[name=address]') as HTMLInputElement;
        if (addressInput) {
            addressInput.value = address;
        }
    }

    // set address(address: string) {
    //     (this.container.elements.namedItem('address') as HTMLInputElement).value = address;
    //   }
}



// export class OrderAddress extends Form<IOrderAddress> {
//     validate(orderData: Partial<IOrderAddress> & import("./common/Form").FormState & {
//         selectPaymentMethod: PaymentMethod; shippingAddress: string;
//     }) {
//         throw new Error('Method not implemented.');
//     }
//     protected _buttons: HTMLButtonElement[];

//     constructor(container: HTMLFormElement, events: IEvents) {
//         super(container, events);
//         this._buttons = Array.from(container.querySelectorAll('.button_alt'));

//         const addressInput = container.elements.namedItem('address') as HTMLInputElement;
//         addressInput.addEventListener('input', (event: Event) => {
//             const target = event.target as HTMLInputElement;
//             console.log(`Address input changed: ${target.value}`);
//         });

//         this._buttons.forEach((element) => {
//             element.addEventListener('click', (event: MouseEvent) => {
//                 const target = event.target as HTMLButtonElement;
//                 const paymentMethod = target.name === 'cash' ? 'cash' : 'card'; // Определяем способ оплаты
//                 this.setButtonClass(paymentMethod);
//                 events.emit('payment:changed', { target: paymentMethod });
//                 console.log(`Button "${paymentMethod}" was clicked`);
//             });
//         });
//     }

//     setButtonClass(name: string): void {
//         this._buttons.forEach((button) => {
//             if (button.name === name) {
//                 button.classList.add('button_alt-active');
//             } else {
//                 button.classList.remove('button_alt-active');
//             }
//         });
//     }

//     set address(address: string) {
//         const form = this.container as HTMLFormElement;
//         const addressInput = form.elements.namedItem('address') as HTMLInputElement;
//         if (addressInput) {
//             addressInput.value = address;
//         }
//     }

// }










    // onNextStep({ shippingAddress, paymentMethod }: { shippingAddress: string, paymentMethod: string }): void {
    //     // Пример тестовой логики валидации
    //     if (shippingAddress.trim() === '') {
    //         console.log('Адрес доставки не может быть пустым!');
    //     } else {
    //         console.log('Адрес доставки валиден!');
    //         // Здесь можно добавить код для перехода к следующему шагу оформления заказа
    //     }
    // }

    // onNextStep({ shippingAddress, paymentMethod }: { shippingAddress: string; paymentMethod: string }): void {
    //     if (shippingAddress.trim().length > 0 && paymentMethod !== '') {
    //         console.log('Адрес доставки введен и способ оплаты выбран, кнопка "дальше" активна.');
    //         // Активировать кнопку для перехода к следующему шагу оформления заказа
    //         this.activateNextButton();
    //     } else {
    //         console.log('Пожалуйста, введите адрес доставки и выберите способ оплаты.');
    //         // Деактивировать кнопку "дальше"
    //         this.deactivateNextButton();
    //     }
    // }

    // activateNextButton(): void {
    //     // Например, добавить класс для активации кнопки
    //     const nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    //     nextButton.disabled = false;
    //     nextButton.classList.add('active');
    // }

    // deactivateNextButton(): void {
    //     // Например, удалить класс для деактивации кнопки
    //     const nextButton = document.getElementById('nextButton') as HTMLButtonElement;
    //     nextButton.disabled = true;
    //     nextButton.classList.remove('active');
 
    // }

    // activateNextButton(): void {
    //     const nextButton = document.querySelector('.next-button') as HTMLButtonElement;
    //     if (nextButton) {
    //         nextButton.classList.add('active');
    //         nextButton.disabled = false;
    //     }
    // }
    
    // deactivateNextButton(): void {
    //     const nextButton = document.querySelector('.next-button') as HTMLButtonElement;
    //     if (nextButton) {
    //         nextButton.classList.remove('active');
    //         nextButton.disabled = true;
    //     }
    // }

    // setValid(valid: boolean): void {
    //     if(valid) {
    //         // Установить статус валидности данных
    //         console.log('Данные валидны');
    //         // Добавить логику для изменения вида компонента, если данные валидны
    //     } else {
    //         console.log('Данные не прошли валидацию');
    //         // Добавить логику для изменения вида компонента, если данные не валидны
    //     }
    // }
    
    // setErrors(errors: string[]): void {
    //     if(errors.length > 0) {
    //         // Обработать ошибки и отобразить сообщения об ошибках
    //         console.log('Ошибки валидации:', errors);
    //         // Добавить логику для отображения сообщений об ошибках в компоненте
    //     }
    // }



// import { Form } from "./common/Form";
// import { IOrderAdress } from "../types";
// import { EventEmitter, IEvents } from "./base/events";
// import { ensureElement } from "../utils/utils";

// export class OrderAddress extends Form<IOrderAdress> {
//     protected _buttons: HTMLButtonElement[];
//     protected _card: HTMLButtonElement;
//     protected _cash: HTMLButtonElement;
//     protected _address: HTMLInputElement;

//     constructor(container: HTMLFormElement, events: IEvents) {
//         super(container, events);
//         this._buttons = Array.from(container.querySelectorAll('.button_alt'));
//         this._card = container.elements.namedItem('card') as HTMLButtonElement;
//         this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
//         this._address = container.elements.namedItem('address') as HTMLInputElement;

//         this._buttons.forEach((element) => {
//             element.addEventListener('click', (event: MouseEvent) => {
//                 const target = event.target as HTMLButtonElement;
//                 const name = target.name;
//                 this.setButtonClass(name);
//                 events.emit('payment:changed', { target: name });
//                 this.onNextStep({ shippingAddress: this._address.value, paymentMethod: name });
//             });
//         });

//         this._address.addEventListener('input', () => {
//             this.onNextStep({ shippingAddress: this._address.value, paymentMethod: this.getSelectedPaymentMethod() });
//         });
//     }

//     setButtonClass(name: string): void {
//         this._buttons.forEach((button) => {
//             if (button.name === name) {
//                 button.classList.add('button_alt-active');
//             } else {
//                 button.classList.remove('button_alt-active');
//             }
//         });
//     }

//     set address(address: string) {
//         if (this._address) {
//             this._address.value = address;
//         }
//     }

//     onNextStep({ shippingAddress, paymentMethod }: { shippingAddress: string; paymentMethod: string }): void {
//         if (shippingAddress.trim().length > 0 && paymentMethod !== '') {
//             console.log('Адрес доставки введен и способ оплаты выбран, кнопка "дальше" активна.');
//             this.activateNextButton();
//         } else {
//             console.log('Пожалуйста, введите адрес доставки и выберите способ оплаты.');
//             this.deactivateNextButton();
//         }
//     }

//     activateNextButton(): void {
//         const nextButton = document.querySelector('.next-button') as HTMLButtonElement;
//         if (nextButton) {
//             nextButton.classList.add('active');
//             nextButton.disabled = false;
//         }
//     }

//     deactivateNextButton(): void {
//         const nextButton = document.querySelector('.next-button') as HTMLButtonElement;
//         if (nextButton) {
//             nextButton.classList.remove('active');
//             nextButton.disabled = true;
//         }
//     }

//     getSelectedPaymentMethod(): string {
//         if (this._card.classList.contains('button_alt-active')) {
//             return 'card';
//         } else if (this._cash.classList.contains('button_alt-active')) {
//             return 'cash';
//         }
//         return '';
//     }
// }
