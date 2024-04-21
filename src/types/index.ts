export interface IProductItem {
	// это карточка товара со всей информацией
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	error?: string;
}

export interface IProductCatalog {
	// это то, что показано из карточки в каталоге
	id: string;
	category: string;
	title: string;
	image: string;
	price: number;
}

export interface IProductBasket {
	// это то, что показано из карточки в корзине
	id: string;
	title: string;
	price: number;
    error?: string;
}

export type PaymentMethod = 'online' | 'offline'; // способы оплаты

export interface IOrder { // все, что содержит заказ
	id: string;
	userId: string;
	orderId: string;
	quantity: number;
	totalAmount: number;
	selectPaymentMethod: PaymentMethod;
	shippingAddress: string;
	email: string;
	phone: string;
}

export interface IOrderAdress { // Этап выбора способа оплаты и доставки
	selectPaymentMethod: PaymentMethod;
	shippingAddress: string;
	error?: string;
}

export interface IOrderPersonalData { // Этап ввода персональных данных
    email: string;
    phone: string;
    error?: string;
}

export interface IOrderSuccess extends IOrder { // Этап "ваш заказ оформлен"
    totalAmount: number;
}

