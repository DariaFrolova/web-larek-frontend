import { Model } from './base/model';
import { IEvents } from './base/events'; // под вопросом
import {
	IProductItem,
	IAppState,
	IOrder,
	FormErrors,
	PaymentMethod,
	IOrderAdress,
	IOrderPersonalData,
	CardCategory,
} from '../types';

export class CatalogProduct extends Model<IProductItem> {
	id: string;
	category: CardCategory;
	title: string;
	description: string;
	image: string;
	price: number | null;
}

export type CatalogProductChange = {
	catalog: CatalogProduct[];
};

export class AppStateModel extends Model<IAppState> {
	catalog: IProductItem[] = [];
	// basket: IProductItem [] = [];
	basket: string[] = [];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		selectPaymentMethod: null,
		shippingAddress: '',
		totalAmount: 0,
	};

	preview: string | null;
	FormErrors: FormErrors = {
		email: '',
		phone: '',
	};

	addInBasket(id: string): void {
		this.basket.push(id);
		localStorage.setItem('basket', JSON.stringify(this.basket));
		this.emitChanges('itemsBasket:changed');
	}

	deleteFromBasket(id: string): void {
		this.basket = this.basket.filter((itemId) => itemId !== id);
		localStorage.setItem('basket', JSON.stringify(this.basket));
		this.emitChanges('itemsBasket:changed');
	}

	defaultOrder() {
		this.order = {
			email: '',
			phone: '',
			items: [],
			selectPaymentMethod: null,
			shippingAddress: '',
			totalAmount: 0,
		};
	}

	clearBasket(): number {
		if (this.basket.length === 0) {
			return 0; // Возвращаем 0 если корзина пуста
		}

		let total = 0;

		// Получаем цену каждого товара и суммируем
		this.basket.forEach((itemId) => {
			const product = this.catalog.find((item) => item.id === itemId);
			if (product) {
				total += product.price || 0; // Если price может быть null
			}
		});

		// Очищаем корзину
		this.basket = [];

		// Сохраняем обновленную корзину в localStorage
		localStorage.setItem('basket', JSON.stringify(this.basket));

		// Уведомляем об изменениях в корзине
		this.emitChanges('itemBasket:changed');

		// Сбрасываем заказ по умолчанию
		this.defaultOrder();

		return total;
	}

	// Добавляем метод получения общей стоимости товаров в корзине
	getTotal(): number {
		if (this.basket.length === 0) {
			return 0; // Возвращаем 0, если корзина пуста
		}
		return this.basket.reduce((total, itemId) => {
			const product = this.catalog.find((item) => item.id === itemId);
			return total + (product ? product.price || 0 : 0);
		}, 0);
	}

	setCatalog(items: IProductItem[], events: IEvents) {
		this.catalog = items.map((item) => new CatalogProduct(item, events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	fullBasket(): IProductItem[] {
		return this.basket
			.map((itemId) => this.catalog.find((item) => item.id === itemId))
			.filter(Boolean) as IProductItem[];
	}

	checkBasket(item: IProductItem) {
		return this.basket.includes(item.id);
	}

	setPreview(item: CatalogProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrder(): void {
		this.order.totalAmount = this.getTotal();
		this.order.items = this.fullBasket().map((item) => item.id);
	}
}

class OrderManager {
	order: IOrderPersonalData & IOrderAdress;
	formErrors: FormErrors;

	constructor() {
		this.order = {
			email: '',
			phone: '',
			selectPaymentMethod: 'онлайн',
			shippingAddress: '',
		};
		this.formErrors = {};
	}

	checkPayment(orderPayment: PaymentMethod): void {
		this.order.selectPaymentMethod = orderPayment;
		this.validateOrderPayment();
	}

	checkAddress(orderAddress: string): void {
		this.order.shippingAddress = orderAddress;
		this.validateOrderPayment();
	}

	checkEmail(orderEmail: string): void {
		this.setContactField('email', orderEmail);
	}

	checkPhone(orderPhone: string): void {
		this.setContactField('phone', orderPhone);
	}

	validateOrderPayment(): boolean {
		const errors: FormErrors = {};
		if (!this.order.selectPaymentMethod) {
			errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
		}
		if (!this.order.shippingAddress) {
			errors.shippingAddress = 'Необходимо указать адрес доставки';
		}
		this.formErrors = errors;
		// Вместо this.events.emit использовать другой механизм для обработки ошибок
		return Object.keys(errors).length === 0;
	}

	validateOrderForm(): boolean {
		const errors: FormErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		// Вместо this.events.emit использовать другой механизм для обработки ошибок
		return Object.keys(errors).length === 0;
	}

	setContactField(field: keyof IOrderPersonalData, value: string): void {
		this.order[field] = value;
		this.validateOrderForm();
	}
}

const orderManager = new OrderManager();

// Пример использования методов
orderManager.checkPayment('онлайн');
orderManager.checkAddress('адрес доставки');
orderManager.checkEmail('email@example.com');
orderManager.checkPhone('+1234567890');

// import { IProductItem, IOrder } from "../types";
// import { IEvents, EventEmitter } from "./base/events";
// import { Model } from "./base/model";

// export interface IAppState {
//     list: IProductItem[];
// }

// export class AppState extends Model<IAppState> {
//     catalog: IProductItem[];
// }

// getTotal(): number {
//     if (this.basket.length === 0) {
//         return 0; // Если корзина пуста, возвращаем 0
//     }
//     let total = 0;

//     // Получаем цену каждого товара из корзины и суммируем
//     this.basket.forEach((itemId) => {
//         const product = this.catalog.find(item => item.id === itemId);
//         if (product) {
//             total += product.price || 0; // Если price может быть null
//         }
//     });

//     return total;
// }

// setCatalog(items: IProductItem[]) {
//     this.catalog = items.map(item => new CatalogProduct(item));
//     this.emitChanges('items:changed', { catalog: this.catalog });
// }
