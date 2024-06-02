import { Model } from './base/model';
import { IEvents, EventEmitter } from './base/events'; // под вопросом
import {
	IProductItem,
	IAppState,
	IOrder,
	FormErrors,
	FormErrorsType,
	PaymentMethod,
	IOrderAddress,
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
	[x: string]: any;

	catalog: IProductItem[] = [];
	basket: string[] = [];

	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		payment: null,
		// selectPaymentMethod: 'cash',
		shippingAddress: '',
		totalAmount: 0,
	};

	preview: string | null;

	constructor(data: Partial<IAppState>, protected events: EventEmitter) {
		super(data, events);

		this.events.on('basketItemRemoved', (data: { itemId: string }) => {
			this.deleteFromBasket(data.itemId);
		});
	}

	addInBasket(id: string): void {
		console.log('Adding item to basket:', id);
		this.basket.push(id);
		localStorage.setItem('basket', JSON.stringify(this.basket));
		this.emitChanges('itemsBasket:changed');
		console.log('Item successfully added to basket');
	}

	deleteFromBasket(id: string): void {
		console.log('Removing item from basket:', id);
		this.basket = this.basket.filter((itemId) => itemId !== id);
		localStorage.setItem('basket', JSON.stringify(this.basket));
		this.emitChanges('itemsBasket:changed');
		console.log('Item successfully removed from basket');
	}

	getCountProductInBasket(): number {
		return this.basket.length;
	}

	loadBasketFromLocalStorage(callback: () => void): void {
		const storedBasket = localStorage.getItem('basket');
		if (storedBasket) {
			this.basket = JSON.parse(storedBasket);
			this.emitChanges('itemsBasket:changed');
			callback(); 
		}
	}

	defaultOrder() {
		console.log('Resetting order');
		this.order = {
			email: '',
			phone: '',
			items: [],
			payment: null,
			// selectPaymentMethod: 'card',
			shippingAddress: '',
			totalAmount: 0,
		};
		console.log('Order reset successfully');
	}

	clearBasket(): void {
		console.log('Корзина очищена');
		this.basket = [];
		localStorage.setItem('basket', JSON.stringify(this.basket));
		this.defaultOrder();
		this.getTotal();
		this.emitChanges('itemsBasket:changed');
		console.log('Basket cleared successfully');
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

		this.order.totalAmount = this.getTotal();
		console.log('Установлено общее значение заказа: ', this.order.totalAmount);

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
		this.validateOrderPayment();
		console.log('Установлен способ оплаты: ', this.order.payment);
	}

	checkAddress(orderAddress: string): void {
		console.log('Вызов метода checkAddress()');
		this.order.shippingAddress = orderAddress;
		this.validateOrderPayment();
		console.log(
			'Установлен адрес доставки заказчика: ',
			this.order.shippingAddress
		);
	}

	checkEmail(orderEmail: string): void {
		console.log('Вызов метода checkEmail()');
		this.order.email = orderEmail;
		this.validateOrderForm();
		console.log('Установлен email заказчика: ', this.order.email);
	}

	checkPhone(orderPhone: string): void {
		console.log('Вызов метода checkPhone()');
		this.order.phone = orderPhone;
		this.validateOrderForm();
		console.log('Установлен телефон заказчика: ', this.order.phone);
	}

	validateOrderPayment() {
		console.log('Вызов метода validateOrderPayment()');
		const errors: FormErrorsType = {};
		if (!this.order.payment) {
			errors.payment = 'Укажи оплату смурфик';
		}

		if (!this.order.shippingAddress) {
			errors.shippingAddress = 'Укажи куда везти твой заказ - адрес';
		}

		this.formErrors = errors;
		this.events.emit('formAddresErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrderForm() {
		console.log('Вызов метода validateOrderForm()');
		const errors: FormErrorsType = {};

		if (!this.order.phone) {
			errors.phone = 'Укажи телефон';
		}

		if (!this.order.email) {
			errors.email = 'Укажи емейл';
		}

		this.formErrors = errors;
		this.events.emit('formContactErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
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
		this.validateOrderForm();
	}

	// clearBasket(): void {
	// 	console.log('Clearing basket');
	// 	// Очистка корзины
	// 	this.basket = [];
	// 	localStorage.setItem('basket', JSON.stringify(this.basket));
	// 	// Обновление состояния заказа
	// 	this.defaultOrder();
	// 	// // Подсчет и вывод суммы стоимости товаров в корзине
	// 	// const totalAmount = this.basket.reduce((total, itemId) => {
	// 	// 	const item = this.catalog.find((product) => product.id === itemId);
	// 	// 	if (item) {
	// 	// 		return total + item.price;
	// 	// 	}
	// 	// 	return total;
	// 	// }, 0);
	// 	// console.log('Total amount of items in basket:', totalAmount);
	// 	// Излучение события об изменении состояния корзины
	// 	this.emitChanges('itemsBasket:changed');
	// 	console.log('Basket cleared successfully');
	// }

	// fullBasket(): IProductItem[] {
	// 	console.log('Вызов метода fullBasket()');
	// 	const productsInBasket = this.basket.map((productId) => {
	// 		const product: IProductItem | undefined = this.getProductById(productId);
	// 		console.log('Результат fullBasket(): ', validProductsInBasket);
	// 		return product;
	// 	});

	// 	const validProductsInBasket = productsInBasket.filter(
	// 		(product) => product !== undefined
	// 	) as IProductItem[];
	// 	return validProductsInBasket;
	// }

	// getTotal(): number {
	// 	console.log('Вызов метода getTotal()');
	// 	return this.basket.reduce((total, itemId) => {
	// 		const product = this.catalog.find((item) => item.id === itemId);
	// 		return total + (product ? product.price : 0);
	// 	}, 0);
	// }

	// setCatalog(items: IProductItem[]): void {
	// 	console.log('Вызов метода setCatalog()');
	// 	this.catalog = items.map((item) => new CatalogProduct(item, this.events));
	// 	this.emitChanges('items:changed', { catalog: this.catalog });
	// 	console.log('Каталог обновлен: ', this.catalog);
	// }

	// setOrder(): void {
	//     console.log('Вызов метода setOrder()');

	//     this.order.totalAmount = this.getTotal();
	//     console.log('Установлено общее значение заказа: ', this.order.totalAmount);

	//     this.order.items = this.fullBasket().map((item) => item.id);
	//     console.log('Товары в заказе: ', this.order.items);
	// }

	//   setContactField(field: keyof IOrderPersonalData, value: string): void {
	// 	this.order[field] = value;
	// 	this.validateOrderForm();
	//   }

	// setContactField(field: keyof IOrderPersonalData, value: string | PaymentMethod | null): void {
	// 	this.order[field] = value;
	// 	this.validateOrderForm();
	//   }

	// // setPaymentMethod(paymentMethod: PaymentMethod | null): void {
	// // 	this.order.selectPaymentMethod = paymentMethod;
	// // 	console.log('Установлен новый метод оплаты: ', this.order.selectPaymentMethod);
	// // 	this.setOrder();
	// //   }

	// // setPaymentMethod(paymentMethod: PaymentMethod): void {
	// // 	console.log('Установка метода оплаты:', paymentMethod);
	// // 	if (paymentMethod === 'card' || paymentMethod === 'cash') {
	// // 	  this._paymentMethod = paymentMethod;
	// // 	  console.log('Текущий метод оплаты:', this._paymentMethod);
	// // 	} else {
	// // 	  console.error('Некорректный метод оплаты:', paymentMethod);
	// // 	}
	// //   }

	// setPaymentMethod(paymentMethod: PaymentMethod): void {
	// 	this._paymentMethod = paymentMethod;
	// }

	// // checkPayment(orderPayment: PaymentMethod): void {
	// // 	console.log('Вызов метода checkPayment()');
	// // 	this.order.selectPaymentMethod = orderPayment;
	// // 	console.log('Установлен метод оплаты: ', this.order.selectPaymentMethod);
	// // 	this.validatePaymentMethod();
	// // }

	// // checkPayment(paymentMethod: PaymentMethod) {
	// // 	console.log('Установка метода оплаты:', paymentMethod);
	// // 	this.order.selectPaymentMethod = paymentMethod;
	// // 	console.log('Текущий метод оплаты:', this.order.selectPaymentMethod);
	// // 	this.validatePaymentMethod();
	// // }

	// checkPayment(): void {
	// 	console.log('Проверка способа оплаты');
	// 	if (this._paymentMethod) {
	// 		this.validatePaymentMethod();
	// 	} else {
	// 		console.error('Метод оплаты не выбран');
	// 	}
	// }

	// // checkAddress(): void {
	// // 	console.log('Проверка поля с адресом доставки');
	// // 	if (this._address) {
	// // 		this.validateShippingAddress();
	// // 	} else {
	// // 		console.error('Адрес доставки не заполнено');
	// // 	}
	// // }

	// setAddress(address: string): void {
	// 	this._address = address;
	// }

	// checkAddress(): boolean {
	// 	console.log('Проверка поля с адресом доставки');
	// 	return this.validateShippingAddress();
	// }

	// validateShippingAddress(): boolean {
	// 	console.log('Проверка адреса доставки');
	// 	if (this._address) {
	// 		return true;
	// 	} else {
	// 		console.error('Адрес доставки не заполнен');
	// 		return false;
	// 	}
	// }

	// // checkAddress(orderAddress: string): void {
	// // 	console.log('Вызов метода checkAddress()');
	// // 	this.order.shippingAddress = orderAddress;
	// // 	console.log('Установлен адрес заказа: ', this.order.shippingAddress);
	// // 	this.validateShippingAddress();
	// // }

	// checkEmail(orderEmail: string): void {
	// 	console.log('Вызов метода checkEmail()');
	// 	this.order.email = orderEmail;
	// 	console.log('Установлен email заказчика: ', this.order.email);
	// 	this.validateOrderForm();
	// }

	// checkPhone(orderPhone: string): void {
	// 	console.log('Вызов метода checkPhone()');
	// 	this.order.phone = orderPhone;
	// 	console.log('Установлен телефон заказчика: ', this.order.phone);
	// 	this.validateOrderForm();
	// }

	// // validatePaymentMethod(): void {
	// // 	console.log('Вызов метода validatePaymentMethod()');
	// // 	const errors: { [key: string]: boolean } = {};

	// // 	if (!this._paymentMethod) {
	// // 	  errors['paymentMethod'] = true;
	// // 	}

	// // 	if (Object.keys(errors).length > 0) {
	// // 	  console.error('Ошибки способа оплаты:', errors);
	// // 	} else {
	// // 	  console.log('Способ оплаты прошел валидацию');
	// // 	}

	// // 	console.log('Параметры заказа при выборе способа оплаты:', this.data);
	// //   }
	// // data(arg0: string, data: any) {
	// // 	throw new Error('Method not implemented.');
	// // }

	// validatePaymentMethod() {
	// 	console.log('Вызов метода validatePaymentMethod()');
	// 	if (!this._paymentMethod) {
	// 		console.error('Ошибки способа оплаты: способ оплаты не выбран');
	// 		this.showErrorNotification('Выберите способ оплаты');
	// 	}
	// 	else {
	// 		console.log('Способ оплаты прошел валидацию');
	// 	}
	// 	console.log('Параметры заказа при выборе способа оплаты:', this.data);
	// }

	// showErrorNotification(message: string) {
	// 	// Реализация отображения уведомления пользователю
	// 	console.error(message);
	// }

	// validateOrderForm(): boolean {
	// 	console.log('Вызов метода validateOrderForm()');
	// 	console.log('Параметры заказа: ', this.order);

	// 	const errors: FormErrors = {
	// 		paymentMethod: ''
	// 	};

	// 	if (!this.order.email) {
	// 		errors.email = 'Необходимо указать email';
	// 	}

	// 	if (!this.order.phone) {
	// 		errors.phone = 'Необходимо указать телефон';
	// 	}

	// 	if (!this._paymentMethod) {
	// 		errors.paymentMethod = 'Не указан способ оплаты';
	// 	}

	// 	if (!this.checkAddress()) {
	// 		errors.shippingAddress = 'Адрес доставки не заполнен';
	// 	}

	// 	this.FormErrors = errors;
	// 	console.log('Ошибки формы контактов: ', this.FormErrors);
	// 	this.events.emit('formContactErrors:change', this.FormErrors);

	// 	return Object.keys(errors).length === 0;
	// }
}

// validatePaymentMethod(): void {
// 	console.log('Вызов метода validatePaymentMethod()');

// 	const errors: FormErrorsType = {};
// 	if (!this.order.selectPaymentMethod) {
// 	  errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	} else if (!['cash', 'card'].includes(this.order.selectPaymentMethod)) {
// 	  errors.selectPaymentMethod = 'Выбран недопустимый способ оплаты';
// 	}
// 	this.FormErrors = {
// 		...this.FormErrors,
// 		...errors
// 	  };

// 	console.log('АААААА Ошибки способа оплаты: ', errors);
// 	this.events.emit('formPaymentErrors:change', errors);
//   }

// validatePaymentMethod(): void {
// 	console.log('Вызов метода validatePaymentMethod()');

// 	const errors: FormErrorsType = {};
// 	if (!this.order.selectPaymentMethod) {
// 	  errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	} else if (!['cash', 'card'].includes(this.order.selectPaymentMethod)) {
// 	  errors.selectPaymentMethod = 'Выбран недопустимый способ оплаты';
// 	}
// 	this.FormErrors = {
// 	 ...this.FormErrors,
// 	 ...errors
// 	  };

// 	console.log('АААААА Ошибки способа оплаты: ', errors);
// 	console.log('Параметры заказа при выборе способа оплаты: ', this.order);
// 	this.events.emit('formPaymentErrors:change', errors);
//   }

// validatePaymentMethod(): void {
// 	console.log('Вызов метода validatePaymentMethod()');

// 	const errors: FormErrorsType = {};
// 	if (!this.order.selectPaymentMethod) {
// 		errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	} else if (!['cash', 'card'].includes(this.order.selectPaymentMethod)) {
// 		errors.selectPaymentMethod = 'Выбран недопустимый способ оплаты';
// 	}
// 	this.FormErrors = {
// 	 ...this.FormErrors,
// 	 ...errors
// 		};

// 	console.log('АААААА Ошибки способа оплаты: ', errors);
// 	console.log('Параметры заказа при выборе способа оплаты: ', this.order);
// 	this.events.emit('formPaymentErrors:change', errors);
//  }

// validateShippingAddress() {
// 	console.log('Вызов метода validateShippingAddress()');

// 	const errors: FormErrorsType = {};
// 	if (!this.order.shippingAddress) {
// 		errors.shippingAddress = 'Необходимо указать адрес';
// 	}
// 	this.FormErrors = {
// 		...this.FormErrors,
// 		...errors
// 	};
// 	console.log('Ошибки адреса доставки: ', errors);
// 	this.events.emit('formAddressErrors:change', errors);
// 	return Object.keys(errors).length === 0;
// }

// validateOrderForm() {
// 	console.log('Вызов метода validateOrderForm()');
// 	console.log('Параметры заказа Эй: ', this.order);

// 	const errors: FormErrors = {};
// 	if (!this.order.email) {
// 		errors.email = 'Необходимо указать email';
// 	}
// 	if (!this.order.phone) {
// 		errors.phone = 'Необходимо указать телефон';
// 	}
// 	this.FormErrors = errors;
// 	console.log('Ошибки формы контактов: ', this.FormErrors);
// 	this.events.emit('formContactErrors:change', this.FormErrors);
// 	return Object.keys(errors).length === 0;
// }

// setOrder(): void {
// 	console.log('Вызов метода setOrder()');

// 	this.order.totalAmount = this.getTotal();
// 	console.log('Установлено общее значение заказа: ', this.order.totalAmount);

// 	this.order.items = this.fullBasket().map((item) => item.id);
// 	console.log('Товары в заказе: ', this.order.items);
// }

// checkPayment(orderPayment: PaymentMethod): void {
// 	console.log('Вызов метода checkPayment()');
// 	this.order.selectPaymentMethod = orderPayment;
// 	console.log('Установлен метод оплаты: ', this.order.selectPaymentMethod);
// 	this.validateOrderPayment();
// }

// checkPayment(orderPayment: PaymentMethod): void {
//     console.log('Вызов метода checkPayment()');
//     this.order.selectPaymentMethod = orderPayment;
//     console.log('Установлен метод оплаты: ', this.order.selectPaymentMethod);
//     this.setOrder();
// }

// checkPayment(orderPayment: PaymentMethod): void {
// 	console.log('Вызов метода checkPayment()');
// 	this.order.selectPaymentMethod = orderPayment;
// 	console.log('Установлен метод оплаты: ', this.order.selectPaymentMethod);
// 	this.setOrder();
// }
// checkPayment(orderPayment: PaymentMethod): void {
// 	console.log('Вызов метода checkPayment()');
// 	if (orderPayment !== null) {
// 		this.order.selectPaymentMethod = orderPayment;
// 		console.log('Установлен метод оплаты: ', this.order.selectPaymentMethod);
// 		this.setOrder();
// 	} else {
// 		console.log('Метод оплаты не выбран');
// 	}
// }

// checkPayment(orderPayment: PaymentMethod): void {
// 	console.log('Вызов метода checkPayment()');
// 	this.order.selectPaymentMethod = orderPayment;
// 	console.log('Установлен метод оплаты: ', this.order.selectPaymentMethod);
// 	this.setOrder();
// }

// checkPayment(orderPayment: PaymentMethod): void {
//     console.log('Вызов метода checkPayment()');
//     this.order.selectPaymentMethod = orderPayment;
//     console.log('Установлен метод оплаты: ', this.order.selectPaymentMethod);
//     this.validateOrderPayment();
// }

// setPaymentMethod(paymentMethod: PaymentMethod): void {
// 	this.order.selectPaymentMethod = paymentMethod;
// 	console.log('Установлен новый метод оплаты: ', this.order.selectPaymentMethod);
// 	this.setOrder();
// }

// checkAddress(orderAddress: string): void {
// 	console.log('Вызов метода checkAddress()');
// 	this.order.shippingAddress = orderAddress;
// 	console.log('Установлен адрес заказа: ', this.order.shippingAddress);
// 	this.validateOrderPayment();
// }

// setContactField(field: keyof IOrderPersonalData, value: string): void {
// 	console.log(`Установка значения для поля ${field}`);
// 	if (this.order.hasOwnProperty(field)) {
// 		this.order[field] = value;
// 		console.log(`Установлено значение ${value} для поля ${field}`);
// 		this.validateOrderForm();
// 	} else {
// 		console.log(`Ошибка: поле ${field} не существует в объекте this.order`);
// 	}
// }

// validateOrderPayment() {
// 	console.log('Вызов метода validateOrderPayment()');

// 	const errors: FormErrorsType = {};
// 	if (!this.order.selectPaymentMethod) {
// 		errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	}
// 	if (!this.order.shippingAddress) {
// 		errors.shippingAddress = 'Необходимо указать адрес';
// 	}
// 	this.FormErrors = errors;
// 	console.log('Ошибки формы оплаты: ', this.FormErrors);
// 	this.events.emit('formAddresErrors:change', this.FormErrors);
// 	return Object.keys(errors).length === 0;
// }

// validatePaymentMethod() {
// 	console.log('Вызов метода validatePaymentMethod()');

// 	const errors: FormErrorsType = {};
// 	if (!this.order.selectPaymentMethod) {
// 		errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	}
// 	this.FormErrors = {
// 		...this.FormErrors,
// 		...errors
// 	};
// 	console.log('Ошибки способа оплаты: ', errors);
// 	this.events.emit('formPaymentErrors:change', errors);
// 	return Object.keys(errors).length === 0;
// }

// validatePaymentMethod() {
// 	console.log('Вызов метода validatePaymentMethod()');

// 	const errors: FormErrorsType = {};
// 	if (!this.order.selectPaymentMethod) {
// 		errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	} else if (!['cash', 'card'].includes(this.order.selectPaymentMethod)) {
// 		errors.selectPaymentMethod = 'Выбран недопустимый способ оплаты';
// 	}
// 	this.FormErrors = {
// 		...this.FormErrors,
// 		...errors
// 	};
// 	console.log('ЧО ТАКОЕ Ошибки способа оплаты: ', errors);
// 	this.events.emit('formPaymentErrors:change', errors);
// 	return Object.keys(errors).length === 0;
// }

// validatePaymentMethod() {
// 	console.log('Вызов метода validatePaymentMethod()');

// 	const errors: FormErrorsType = {};
// 	if (!this.order.selectPaymentMethod) {
// 	  errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	} else if (!['cash', 'card'].includes(this.order.selectPaymentMethod)) {
// 	  errors.selectPaymentMethod = 'Выбран недопустимый способ оплаты';
// 	}
// 	this.FormErrors = {
// 	  ...this.FormErrors,
// 	  ...errors
// 	};
// 	console.log('Ошибки способа оплаты: ', errors);
// 	this.events.emit('formPaymentErrors:change', errors);
// 	return Object.keys(errors).length === 0;
//   }
// export class AppStateModel extends Model<IAppState> {
//     [x: string]: any;
// 	catalog: IProductItem[] = [];
// 	// basket: IProductItem [] = [];
// 	basket: string[] = [];
// 	order: IOrder = {
// 		email: '',
// 		phone: '',
// 		items: [],
// 		selectPaymentMethod: null,
// 		shippingAddress: '',
// 		totalAmount: 0,
// 	};

// 	preview: string | null;
// FormErrors: FormErrors = {
// 	email: '',
// 	phone: '',
// };

// 	getCountProductInBasket() {
//         return this.basket.length;
//     }

// 	// setOrder(): void {
// 	// 	this.order.totalAmount = this.getTotal();
// 	// 	this.order.items = this.fullBasket().map((item) => item.id);

// 	// 	// Очистить корзину после оформления заказа
// 	// 	this.clearBasket();
// 	//   }

// 	setOrder(): void {
// 		// Получаем сумму заказа и список товаров
// 		this.order.totalAmount = this.getTotal();
// 		this.order.items = this.fullBasket().map((item) => item.id);

// 		// Далее, обновляем состояние корзины и сохраняем его в локальное хранилище
// 		this.basket = [];
// 		localStorage.setItem('basket', JSON.stringify(this.basket));
// 	  }

// addInBasket(id: string): void {
// 	this.basket.push(id);
// 	localStorage.setItem('basket', JSON.stringify(this.basket));
// 	this.emitChanges('itemsBasket:changed');
// }

// 	deleteFromBasket(id: string): void {
// 		this.basket = this.basket.filter((itemId) => itemId !== id);
// 		localStorage.setItem('basket', JSON.stringify(this.basket));
// 		this.emitChanges('itemsBasket:changed');
// 	}

// 	defaultOrder() {
// 		this.order = {
// 			email: '',
// 			phone: '',
// 			items: [],
// 			selectPaymentMethod: null,
// 			shippingAddress: '',
// 			totalAmount: 0,
// 		};
// 	}

// 	// clearBasket(): number {
// 	// 	if (this.basket.length === 0) {
// 	// 		return 0; // Возвращаем 0 если корзина пуста
// 	// 	}

// 	// 	let total = 0;

// 	// 	// Получаем цену каждого товара и суммируем
// 	// 	this.basket.forEach((itemId) => {
// 	// 		const product = this.catalog.find((item) => item.id === itemId);
// 	// 		if (product) {
// 	// 			total += product.price || 0; // Если price может быть null
// 	// 		}
// 	// 	});

// 	// 	// Очищаем корзину
// 	// 	this.basket = [];

// 	// 	// Сохраняем обновленную корзину в localStorage
// 	// 	localStorage.setItem('basket', JSON.stringify(this.basket));

// 	// 	// Уведомляем об изменениях в корзине
// 	// 	this.emitChanges('itemBasket:changed');

// 	// 	// Сбрасываем заказ по умолчанию
// 	// 	this.defaultOrder();

// 	// 	return total;
// 	// }

// 	// clearBasket(): number {
// 	// 	console.log('Начало очистки корзины.');
// 	// 	console.log('Текущая корзина:', this.basket);

// 	// 	if (this.basket.length === 0) {
// 	// 		console.log('Корзина пуста. Возвращаем 0.');
// 	// 		return 0; // Возвращаем 0 если корзина пуста
// 	// 	}

// 	// 	let total = 0;

// 	// 	// Получаем цену каждого товара и суммируем
// 	// 	this.basket.forEach((itemId) => {
// 	// 		const product = this.catalog.find((item) => item.id === itemId);
// 	// 		if (product) {
// 	// 			total += product.price || 0; // Если price может быть null
// 	// 		}
// 	// 	});

// 	// 	console.log('Сумма товаров в корзине:', total);

// 	// 	// Очищаем корзину
// 	// 	console.log('Очистка корзины...');
// 	// 	this.basket = [];
// 	// 	console.log('Корзина очищена.');

// 	// 	// Сохраняем обновленную корзину в localStorage
// 	// 	localStorage.setItem('basket', JSON.stringify(this.basket));
// 	// 	console.log('Обновленная корзина сохранена в localStorage.');

// 	// 	// Уведомляем об изменениях в корзине
// 	// 	this.emitChanges('itemBasket:changed');
// 	// 	console.log('Уведомление об изменениях в корзине отправлено.');

// 	// 	// Сбрасываем заказ по умолчанию
// 	// 	this.defaultOrder();
// 	// 	console.log('Заказ по умолчанию сброшен.');

// 	// 	console.log('Окончание очистки корзины.');
// 	// 	return total;
// 	// }

// 	//ТЕСТ

// 	// clearBasketCommon() {
// 	// 	this.itemsInBasket = [];
// 	// 	this.renderBasketItems();
// 	// 	this.updateTotal();
// 	// 	localStorage.removeItem('basketItems');
// 	// 	this.updateCounter();
// 	//   }

// 	//   clearBasket(): any {
// 	// 	this.basketlist = 0; // Обнуляем значение корзины
// 	// 	this.basketprice = 0; // Обнуляем цену корзины

// 	// 	// Общая очистка корзины
// 	// 	this.clearBasketCommon();

// 	// 	return null; // Можно вернуть null или любое другое значение, если не нужно возвращать какое-то конкретное значение
// 	//   }

// 	// clearBasket(): any {
// 	// 	this.basketlist = 0; // Обнуляем значение корзины
// 	// 	this.basketprice = 0; // Обнуляем цену корзины

// 	// 	// Общая очистка корзины
// 	// 	this.clearBasketCommon();

// 	// 	return null; // Можно вернуть null или любое другое значение, если не нужно возвращать какое-то конкретное значение
// 	//   }

// 	clearBasket(): number {
// 		console.log('Начало очистки корзины.');
// 		console.log('Текущая корзина:', this.basket);

// 		if (this.basket.length === 0) {
// 			console.log('Корзина пуста. Возвращаем 0.');
// 			return 0; // Возвращаем 0 если корзина пуста
// 		}

// 		let total = 0;

// 		// Получаем цену каждого товара и суммируем
// 		this.basket.forEach((itemId) => {
// 			const product = this.catalog.find((item) => item.id === itemId);
// 			if (product) {
// 				total += product.price || 0; // Если price может быть null
// 			}
// 		});

// 		console.log('Сумма товаров в корзине:', total);

// 		// Очищаем корзину
// 		console.log('Очистка корзины...');
// 		this.basket = [];
// 		this.basketlist = 0; // Обнуляем значение корзины
// 		this.basketprice = 0; // Обнуляем цену корзины
// 		console.log('Корзина очищена.');

// 		// Сохраняем обновленные значения в localStorage
// 		localStorage.setItem('basket', JSON.stringify(this.basket));
// 		localStorage.setItem('basketlist', this.basketlist.toString());
// 		localStorage.setItem('basketprice', this.basketprice.toString());
// 		console.log('Обновленные значения сохранены в localStorage.');

// 		// Уведомляем об изменениях в корзине
// 		this.emitChanges('itemBasket:changed');
// 		console.log('Уведомление об изменениях в корзине отправлено.');

// 		// Сбрасываем заказ по умолчанию
// 		this.defaultOrder();
// 		console.log('Заказ по умолчанию сброшен.');

// 		console.log('Окончание очистки корзины.');
// 		return total;
// 	}

// 	// Добавляем метод получения общей стоимости товаров в корзине
// 	getTotal(): number {
// 		if (this.basket.length === 0) {
// 			return 0; // Возвращаем 0, если корзина пуста
// 		}
// 		return this.basket.reduce((total, itemId) => {
// 			const product = this.catalog.find((item) => item.id === itemId);
// 			return total + (product ? product.price || 0 : 0);
// 		}, 0);
// 	}

// 	setCatalog(items: IProductItem[], events: IEvents) {
// 		this.catalog = items.map((item) => new CatalogProduct(item, events));
// 		this.emitChanges('items:changed', { catalog: this.catalog });
// 	}

// 	fullBasket(): IProductItem[] {
// 		return this.basket
// 			.map((itemId) => this.catalog.find((item) => item.id === itemId))
// 			.filter(Boolean) as IProductItem[];
// 	}

// 	checkBasket(item: IProductItem) {
// 		return this.basket.includes(item.id);
// 	}

// 	setPreview(item: CatalogProduct) {
// 		this.preview = item.id;
// 		this.emitChanges('preview:changed', item);
// 	}

// 	// setOrder(): void {
// 	// 	this.order.totalAmount = this.getTotal();
// 	// 	this.order.items = this.fullBasket().map((item) => item.id);
// 	// }
// }

// export class OrderManager {
//     static events: any;
// 	[x: string]: any;
// 	order: IOrderPersonalData & IOrderAdress;
// 	formErrors: FormErrors;

// 	constructor() {
// 		this.order = {
// 			email: '',
// 			phone: '',
// 			selectPaymentMethod: 'онлайн',
// 			shippingAddress: '',
// 		};
// 		this.formErrors = {};
// 	}

// 	// checkPayment(orderPayment: PaymentMethod): void {
// 	// 	this.order.selectPaymentMethod = orderPayment;
// 	// 	this.validateOrderPayment();
// 	// }

// 	// checkPayment(orderPayment: PaymentMethod): void {
// 	// 	this.order.selectPaymentMethod = orderPayment;
// 	// 	this.validateOrderPayment();
// 	//   }

// 	// checkPayment = (paymentMethod: PaymentMethod) => {
// 	// 	this.order.selectPaymentMethod = paymentMethod;
// 	// 	console.log(`Selected payment method: ${paymentMethod}`);
// 	// 	this.validateOrderPayment();
// 	//   }

// 	checkPayment = (paymentMethod: PaymentMethod) => {
// 		this.order.selectPaymentMethod = paymentMethod;
// 		console.log(`хэй! Selected payment method: ${paymentMethod}`);
// 		this.validateOrderPayment();
// 	  }

// 	// class OrderManager {
// 	// 	order: IOrderPersonalData & IOrderAdress;
// 	// 	formErrors: FormErrors;

// 	// 	constructor() {
// 	// 		this.order = {
// 	// 			email: '',
// 	// 			phone: '',
// 	// 			selectPaymentMethod: 'онлайн',
// 	// 			shippingAddress: '',
// 	// 		};
// 	// 		this.formErrors = {};
// 	// 	}

// 	// checkPayment(orderPayment: PaymentMethod): PaymentMethod {
// 	// 	this.order.selectPaymentMethod = orderPayment;
// 	// 	this.validateOrderPayment();
// 	// 	return this.order.selectPaymentMethod; // Возвращаем выбранный способ оплаты
// 	// }

// 	checkAddress(orderAddress: string): void {
// 		this.order.shippingAddress = orderAddress;
// 		this.validateOrderPayment();
// 	}

// 	checkEmail(orderEmail: string): void {
// 		this.setContactField('email', orderEmail);
// 	}

// 	checkPhone(orderPhone: string): void {
// 		this.setContactField('phone', orderPhone);
// 	}

// 	// validateOrderPayment(): boolean {
// 	// 	const errors: FormErrors = {};
// 	// 	if (!this.order.selectPaymentMethod) {
// 	// 		errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	// 	}
// 	// 	if (!this.order.shippingAddress) {
// 	// 		errors.shippingAddress = 'Необходимо указать адрес доставки';
// 	// 	}
// 	// 	this.formErrors = errors;
// 	// 	// Вместо this.events.emit использовать другой механизм для обработки ошибок
// 	// 	return Object.keys(errors).length === 0;
// 	// }

// 	// validateOrderForm(): boolean {
// 	// 	const errors: FormErrors = {};
// 	// 	if (!this.order.email) {
// 	// 		errors.email = 'Необходимо указать email';
// 	// 	}
// 	// 	if (!this.order.phone) {
// 	// 		errors.phone = 'Необходимо указать телефон';
// 	// 	}
// 	// 	this.formErrors = errors;
// 	// 	// Вместо this.events.emit использовать другой механизм для обработки ошибок
// 	// 	return Object.keys(errors).length === 0;
// 	// }

// 	// validateOrderPayment() {
// 	// 	const errors: FormErrors = {};
// 	// 	if (!this.order.selectPaymentMethod) {
// 	// 		errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	// 	}
// 	// 	if (!this.order.shippingAddress) {
// 	// 		errors.shippingAddress = 'Необходимо указать адрес';
// 	// 	}
// 	// 	this.formErrors = errors;
// 	// 	this.events.emit('formAddresErrors:change', this.formErrors);

// 	// 	console.log('Проверка валидации заказа по оплате');
// 	// 	console.log('Ошибки:', errors);

// 	// 	// Обновление состояния кнопки (пример)
// 	// 	const button = document.querySelector('.order__button');
// 	// 	if (Object.keys(errors).length === 0) {
// 	// 		button.classList.remove('invalid');
// 	// 		console.log('Состояние кнопки: активная');
// 	// 	} else {
// 	// 		button.classList.add('invalid');
// 	// 		console.log('Состояние кнопки: неактивная');
// 	// 	}

// 	// 	return Object.keys(errors).length === 0;
// 	// }

// 	// validateOrderForm() {
// 	// 	const errors: FormErrors = {};
// 	// 	if (!this.order.email) {
// 	// 		errors.email = 'Необходимо указать email';
// 	// 	}
// 	// 	if (!this.order.phone) {
// 	// 		errors.phone = 'Необходимо указать телефон';
// 	// 	}
// 	// 	this.formErrors = errors;
// 	// 	this.events.emit('formContactErrors:change', this.formErrors);

// 	// 	console.log('Проверка валидации заказа по контактам');
// 	// 	console.log('Ошибки:', errors);

// 	// 	// Обновление состояния кнопки (пример)
// 	// 	const button = document.querySelector('.order__button');
// 	// 	if (Object.keys(errors).length === 0) {
// 	// 		button.classList.remove('invalid');
// 	// 		console.log('Состояние кнопки: активная');
// 	// 	} else {
// 	// 		button.classList.add('invalid');
// 	// 		console.log('Состояние кнопки: неактивная');
// 	// 	}

// 	// 	return Object.keys(errors).length === 0;
// 	// }

// 	// validateOrderPayment() {
// 	// 	const errors: FormErrors = {};
// 	// 	if (!this.order.selectPaymentMethod) {
// 	// 		errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	// 	}
// 	// 	if (!this.order.shippingAddress) {
// 	// 		errors.shippingAddress = 'Необходимо указать адрес';
// 	// 	}
// 	// 	this.formErrors = errors;
// 	// 	this.events.emit('formAddresErrors:change', this.formErrors);

// 	// 	// Вызываем функцию обновления интерфейса с ошибками формы
// 	// 	updateFormErrors(errors);
// 	// 	console.log('Проверка валидации заказа по оплате');
// 	// 	console.log('Ошибки:', errors);

// 	// 	// Обновление состояния кнопки
// 	// 	const button = document.querySelector('.order__button');
// 	// 	if (Object.keys(errors).length === 0) {
// 	// 		button.classList.remove('invalid');
// 	// 		console.log('Состояние кнопки: активная');
// 	// 	} else {
// 	// 		button.classList.add('invalid');
// 	// 		console.log('Состояние кнопки: неактивная');
// 	// 	}

// 	// 	return Object.keys(errors).length === 0;
// 	// }

// 	// validateOrderForm() {
// 	// 	const errors: FormErrors = {};
// 	// 	if (!this.order.email) {
// 	// 		errors.email = 'Необходимо указать email';
// 	// 	}
// 	// 	if (!this.order.phone) {
// 	// 		errors.phone = 'Необходимо указать телефон';
// 	// 	}
// 	// 	this.formErrors = errors;
// 	// 	this.events.emit('formContactErrors:change', this.formErrors);

// 	// 	// Вызываем функцию обновления интерфейса с ошибками формы
// 	// 	updateFormErrors(errors);
// 	// 	console.log('Проверка валидации заказа по контактам');
// 	// 	console.log('Ошибки:', errors);

// 	// 	// Обновление состояния кнопки
// 	// 	const button = document.querySelector('.order__button');
// 	// 	if (Object.keys(errors).length === 0) {
// 	// 		button.classList.remove('invalid');
// 	// 		console.log('Состояние кнопки: активная');
// 	// 	} else {
// 	// 		button.classList.add('invalid');
// 	// 		console.log('Состояние кнопки: неактивная');
// 	// 	}

// 	// 	return Object.keys(errors).length === 0;
// 	// }

// 	// validateOrderPayment() {
// 	// 	const errors: FormErrors = {};
// 	// 	if (!this.order.selectPaymentMethod) {
// 	// 		errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 	// 	}
// 	// 	if (!this.order.shippingAddress) {
// 	// 		errors.shippingAddress = 'Необходимо указать адрес';
// 	// 	}
// 	// 	this.formErrors = errors;
// 	// 	this.events.emit('formAddresErrors:change', this.formErrors);

// 	// 	// Проверка наличия ошибок и обновление кнопки
// 	// 	console.log('Проверка наличия ошибок формы:', Object.keys(errors).length > 0);

// 	// 	// Вызываем функцию обновления интерфейса с ошибками формы
// 	// 	updateFormErrors(errors);
// 	// 	console.log('Проверка валидации заказа по оплате');
// 	// 	console.log('Ошибки:', errors);

// 	// 	// Обновление состояния кнопки
// 	// 	const button = document.querySelector('.order__button');
// 	// 	if (Object.keys(errors).length === 0) {
// 	// 		button.classList.remove('invalid');
// 	// 		console.log('Состояние кнопки: активная');
// 	// 	} else {
// 	// 		button.classList.add('invalid');
// 	// 		console.log('Состояние кнопки: неактивная');
// 	// 	}

// 	// 	return Object.keys(errors).length === 0;
// 	// }

// 	validateOrderPayment() {
// 		const errors: FormErrors = {};
// 		if (!this.order.selectPaymentMethod) {
// 			errors.selectPaymentMethod = 'Необходимо указать способ оплаты';
// 			console.log('Вызвана валидация способа оплаты');
// 		}
// 		if (!this.order.shippingAddress) {
// 			errors.shippingAddress = 'Необходимо указать адрес';
// 			console.log('Вызвана валидация адреса оплаты');
// 		}
// 		this.formErrors = errors;
// 		this.events.emit('formAddresErrors:change', this.formErrors);
// 		return Object.keys(errors).length === 0;
// 	}

// 	setContactField(field: keyof IOrderPersonalData, value: string): void {
// 		this.order[field] = value;
// 		this.validateOrderForm();
// 	}
// }

// const orderManager = new OrderManager();

// // function updateFormErrors(errors: FormErrors) {
// // 	throw new Error('Function not implemented.');
// // }

// // // Пример использования методов
// // orderManager.checkPayment('онлайн');
// // orderManager.checkAddress('адрес доставки');
// // orderManager.checkEmail('email@example.com');
// // orderManager.checkPhone('+1234567890');

// // import { IProductItem, IOrder } from "../types";
// // import { IEvents, EventEmitter } from "./base/events";
// // import { Model } from "./base/model";

// // export interface IAppState {
// //     list: IProductItem[];
// // }

// // export class AppState extends Model<IAppState> {
// //     catalog: IProductItem[];
// // }

// // getTotal(): number {
// //     if (this.basket.length === 0) {
// //         return 0; // Если корзина пуста, возвращаем 0
// //     }
// //     let total = 0;

// //     // Получаем цену каждого товара из корзины и суммируем
// //     this.basket.forEach((itemId) => {
// //         const product = this.catalog.find(item => item.id === itemId);
// //         if (product) {
// //             total += product.price || 0; // Если price может быть null
// //         }
// //     });

// //     return total;
// // }

// // setCatalog(items: IProductItem[]) {
// //     this.catalog = items.map(item => new CatalogProduct(item));
// //     this.emitChanges('items:changed', { catalog: this.catalog });
// // }
