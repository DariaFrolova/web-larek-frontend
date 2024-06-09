import _ from 'lodash';
import { Model } from './base/model';
import { IEvents, EventEmitter } from './base/events';
import {
	IProductItem,
	IAppState,
	IOrder,
	FormErrorsType,
	PaymentMethod,
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
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		payment: null,
		address: '',
		total: 0,
	};

	formErrors: FormErrorsType = {};
	catalog: IProductItem[] = [];
	basket: string[] = [];
	preview: string | null;

	constructor(data: Partial<IAppState>, protected events: EventEmitter) {
		super(data, events);

		this.events.on('basketItemRemoved', (data: { itemId: string }) => {
			this.deleteFromBasket(data.itemId);
		});
	}

	//добавление товаров в корзину - новый метод
	addInBasket(item: IProductItem): void {
		console.log('в корзину добавлен товар', item.id);
		this.basket.push(item.id);
		localStorage.setItem('basket', JSON.stringify(this.basket));
		this.emitChanges('itemsBasket:changed');
		console.log('товар успешно добавлен в корзину');
	}

	// удаление товара из корзины - новый метод
	deleteFromBasket(id: string): void {
		console.log('товар удален из корзины', id);
		this.basket = this.basket.filter((item) => item !== id);
		localStorage.setItem('basket', JSON.stringify(this.basket));
		this.emitChanges('itemsBasket:changed');
		console.log('товар успешно удален из корзины');
	}

	// возвращаем количество товаров в корзине - обновленный метод
	getCountProductInBasket(): number {
		console.log('Получаем количество товаров в корзине');
		const count = this.basket.length;
		console.log('Количество товаров в корзине:', count);
		return count;
	}

	//загружаем данные корзины из localStorage - обновленный метод
	loadBasketFromLocalStorage(callback: () => void): void {
		console.log('Загружаем данные корзины из localStorage');
		const storedBasket = localStorage.getItem('basket');
		if (storedBasket) {
			this.basket = JSON.parse(storedBasket);
			this.emitChanges('itemsBasket:changed');
			console.log('Данные корзины успешно загружены');
			callback();
		} else {
			console.log('LocalStorage не содержит данных для корзины');
		}
	}

	//устанавливаем значение для объекта order по умолчанию
	defaultOrder() {
		console.log('устанавливаем значения по умолчанию для заказа');
		this.order = {
			email: '',
			phone: '',
			items: [],
			payment: null,
			address: '',
			total: 0,
		};
		console.log('значения заказа успешно установлены по умолчанию');
	}

	// Очистка корзины - надо проверить
	clearBasket(): void {
		console.log('очистка корзины начата');
		this.basket = [];
		console.log('корзина очищена');
		this.emitChanges('itemsBasket:changed');
		console.log('событие itemsBasket:changed вызвано');
		this.defaultOrder();
		console.log('значения по умолчанию для заказа установлены');
		console.log('очистка корзины завершена');
	}

	getTotal(): number {
		console.log('Вызов метода getTotal()');
		return this.basket.reduce((total, itemId) => {
			const product = this.catalog.find((item) => item.id === itemId);
			return total + (product?.price ?? 0);
		}, 0);
	}

	setCatalog(items: IProductItem[]): void {
		console.log('Вызов метода setCatalog()');
		this.catalog = items.map((item) => new CatalogProduct(item, this.events));
		this.emitChanges('items:changed', { catalog: [...this.catalog] });
		console.log('Каталог обновлен: ', this.catalog);
	}

	getProductById(productId: string): IProductItem | undefined {
		console.log('Вызов метода getProductById()');
		return this.catalog.find((product) => product.id === productId);
	}

	fullBasket(): IProductItem[] {
		console.log('Вызов метода fullBasket()');
		const productsInBasket = this.basket
			.map((productId) => this.getProductById(productId))
			.filter((product): product is IProductItem => product !== undefined);
		console.log('Результат fullBasket(): ', productsInBasket);
		return productsInBasket;
	}

	checkBasket(item: IProductItem): boolean {
		console.log(
			`Вызов метода checkBasket() для товара с идентификатором: ${item.id}`
		);
		return this.basket.includes(item.id);
	}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
		console.log(`Установлен предпросмотр товара с идентификатором: ${item.id}`);
	}

	setOrder(): void {
		console.log('Вызов метода setOrder()');
		this.order.total = this.getTotal();
		console.log('Установлено общее значение заказа: ', this.order.total);

		const fullBasket = this.fullBasket();
		if (fullBasket.length > 0) {
			this.order.items = fullBasket.map((item) => item.id);
			console.log('Товары в заказе: ', this.order.items);
		} else {
			console.error('Корзина пуста. Невозможно установить товары в заказе.');
		}
	}

	checkPayment(orderPayment: PaymentMethod): void {
		console.log('Вызов метода checkPayment()');
		this.order.payment = orderPayment;
		this.validateOrder();
		console.log('Установлен способ оплаты: ', this.order.payment);
	}

	checkAddress(orderAddress: string): void {
		console.log('Вызов метода checkAddress()');
		this.order.address = orderAddress;

		// Сохраняем адрес доставки в локальное хранилище - дополнение для order:open 
		localStorage.setItem('deliveryAddress', orderAddress);

		this.validateOrder();
		console.log('Установлен адрес доставки заказчика: ', this.order.address);
	}

	checkAddressInLocalStorage() {
		const savedAddress = localStorage.getItem('deliveryAddress');
		if (savedAddress) {
			this.order.address = savedAddress;
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address || this.order.payment === null) {
			errors.address = 'Выберите способ оплаты и укажите адрес доставки';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderField(
		payment: keyof IOrderPersonalData,
		value: 'cash' | 'card' | null
	) {
		this.order[payment] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IOrderPersonalData, value: string): void {
		if (field === 'payment') {
			if (value === 'cash' || value === 'card') {
				this.order[field] = value as PaymentMethod;
			} else {
				this.order[field] = null;
			}
		} else {
			this.order[field] = value;
		}
		this.validateOrder();
	}
}
