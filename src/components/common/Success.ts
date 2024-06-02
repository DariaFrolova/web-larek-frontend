import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IOrderSuccess } from '../../types';

interface ISuccess {
	// total: number; // Изменение типа на number
    total: number;
}

export interface SuccessActions {
	onClick?: () => void;
}

export class Success extends Component<ISuccess> {
	[x: string]: any;
	private _close: HTMLElement;
	private _total: HTMLElement;

    constructor(container: HTMLElement, actions: SuccessActions, private totalAmount: number) {
        super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
            this._total.textContent = `Списано ${this.totalAmount} синапсов`;
          }
          
	}
}

// export class Success extends Component<ISuccess> {
//     private _close: HTMLElement;
//     private _total: HTMLElement;

//     constructor(container: HTMLElement, actions: SuccessActions, successData: ISuccess) {
//         super(container);

//         this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
//         this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

//         if (actions?.onClick && successData) {
//             this._close.addEventListener('click', actions.onClick);
//             this._total.textContent = `Списано ${successData.total} синапсов`;
//         }
//     }
// }

// export interface SuccessData {
//     orderSuccess: IOrderSuccess;
// }

// export interface SuccessActions {
//     onClick?: () => void;
// }

// export class Success extends Component<SuccessData> {
//     private closeButton: HTMLElement;
//     private totalElement: HTMLElement;

//     constructor(container: HTMLElement, actions: SuccessActions, orderSuccess: IOrderSuccess) {
//         super(container);

//         this.closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);
//         this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

//         this.setupActions(actions, orderSuccess);
//     }

//     // constructor(container: HTMLElement, actions: SuccessActions, orderSuccess: IOrderSuccess) {
//     //     super(container);

//     //     this.closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);
//     //     this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

//     //     this.setupActions(actions, orderSuccess);
//     // }

//     // private setupActions(actions: SuccessActions, orderSuccess: IOrderSuccess): void {
//     //     console.log('Setting up actions with order success:', orderSuccess);

//     //     if (actions?.onClick) {
//     //         console.log('ClickListener added to closeButton');
//     //         this.closeButton.addEventListener('click', actions.onClick);
//     //     }

//     //     this.updateTotalText(orderSuccess);
//     // }

//     private setupActions(actions: SuccessActions, orderSuccess: IOrderSuccess): void {
//         console.log('Setting up actions with order success:', orderSuccess);

//         if (actions?.onClick) {
//             console.log('ClickListener added to closeButton');
//             this.closeButton.addEventListener('click', actions.onClick);
//         }

//         this.updateTotalText(orderSuccess);
//     }

//     private updateTotalText(orderSuccess: IOrderSuccess): void {
//         console.log('Updating total text with order success:', orderSuccess);

//         if (orderSuccess.totalAmount) {
//             this.totalElement.textContent = `Списано ${orderSuccess.totalAmount} синапсов`;
//         } else {
//             console.error('Ошибка: Не удалось получить сумму заказа');
//         }
//     }
//     // private updateTotalText(orderSuccess: IOrderSuccess): void {
//     //     console.log('Updating total text with order success:', orderSuccess);

//     //     this.totalElement.textContent = `Списано ${orderSuccess.totalAmount} синапсов`;
//     // }

// }

// // private updateTotalText(orderSuccess: IOrderSuccess): void {
// //     console.log('Updating total text with order success:', orderSuccess);

// //     if (orderSuccess && orderSuccess.totalAmount !== undefined) {
// //         this.totalElement.textContent = `Списано ${orderSuccess.totalAmount} синапсов`;
// //     } else {
// //         console.error('Ошибка: Не удалось получить сумму заказа');
// //     }
// // }
// // }

// // import { Component } from "../base/Component";
// // import { ensureElement } from "../../utils/utils";
// // import { IOrder } from "../../types";

// // export interface SuccessData {
// //     total: number;
// // }

// // export interface SuccessActions {
// //     onClick?: () => void;
// // }

// // export class Success extends Component<SuccessData> {
// //     private closeButton: HTMLElement;
// //     private totalElement: HTMLElement;

// //     constructor(container: HTMLElement, actions: SuccessActions, value: number) {
// //         super(container);

// //         this.closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);
// //         this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

// //         this.setupActions(actions, value);
// //     }

// //     private setupActions(actions: SuccessActions, value: number): void {
// //         console.log('Setting up actions with value:', value);

// //         if (actions?.onClick) {
// //             console.log('ClickListener added to closeButton');

// //             this.closeButton.addEventListener('click', actions.onClick);
// //         }
// //         this.updateTotalText(value);
// //     }

// //     private updateTotalText(value: number): void {
// //         console.log('Updating total text with value:', value);

// //         this.totalElement.textContent = `Списано ${value} синапсов`;
// //     }
// // }
