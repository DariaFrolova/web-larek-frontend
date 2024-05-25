
// import { IProductBasket } from "../../types";
// import { Component } from "../base/Component";
// import { ICardActions } from "../../types";
// import { ensureElement } from "../../utils/utils";

// export class ProductBasket extends Component<IProductBasket> {
//     private _index: HTMLElement;
//     private _title: HTMLElement;
//     private _button: HTMLButtonElement;
//     private _price: HTMLElement;

//     constructor(idx: number, container: HTMLElement, events: ICardActions) {
//         super(container);

//         this._index = ensureElement<HTMLElement>('.basket__item-index', container);
//         this._title = ensureElement<HTMLElement>('.card__title', container);
//         this._button = ensureElement<HTMLButtonElement>('.card__button', container);
//         this._price = ensureElement<HTMLElement>('.card__price', container);

//         this.setText(this._index, idx + 1);
//         this._button.addEventListener('click', events.onClick);

//         // if (events.onClick) {  // Проверка наличия обработчика события onClick
//         //     this._button.addEventListener('click', events.onClick);
//         // } else {
//         //     console.warn('No onClick event handler provided!');
//         // }

//     }

//     set title(value: string) {
//         this.setText(this._title, value);  
//     }

//     set price(value: number) {
//         this.setText(this._price, `${value} синапсов`);      
//     }

//     set index(value: number) {
//         this.setText(this._index, value);  
//     }
// }


// // export class ProductBasket extends Component<IProductBasket> {
// //     private _index: HTMLElement;
// //     private _title: HTMLElement;
// //     private _button: HTMLButtonElement;
// //     private _price: HTMLElement;

// //     constructor(idx: number, container: HTMLElement, events: ICardActions) {
// //         super(container);

// //         this._index = ensureElement<HTMLElement>('.basket__item-index', container);
// //         this._title = ensureElement<HTMLElement>('.card__title', container);
// //         this._button = ensureElement<HTMLButtonElement>('.card__button', container);
// //         this._price = ensureElement<HTMLElement>('.card__price', container);

// //         this.setText(this._index, idx + 1);

// //         console.log('Inside ProductBasket constructor'); // Отладочное сообщение

// //         if (events.onClick) {  
// //             this._button.addEventListener('click', events.onClick);
// //             console.log('onClick handler attached to button'); // Отладочное сообщение
// //         } else {
// //             console.warn('No onClick event handler provided!');
// //         }
// //     }

// //     set title(value: string) {
// //         this.setText(this._title, value);  
// //     }

// //     set price(value: number) {
// //         this.setText(this._price, `${value} синапсов`);      
// //     }

// //     set index(value: number) {
// //         this.setText(this._index, value);  
// //     }
// // }
