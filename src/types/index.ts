export interface IProductItem {
	id: string;
	category: CardCategory;
	title: string;
	description: string;
	image: string;
	price: number;
}

// export interface ISuccess {
// 	totalAmount: number;
// 	selectPaymentMethod: PaymentMethod;
// }

export enum CardCategory {
	SoftSkill = 'софт-скил',
	Other = 'другое',
	Additional = 'дополнительное',
	HardSkill = 'хард-скил',
	Button = 'кнопка',
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICardList {
	total: number;
	items: IProductItem[];
}

// это то, что показано из карточки в каталоге
export interface IProductCatalog {
	id: string;
	category: string;
	title: string;
	image: string;
	price: number;
}

// это то, что показано из карточки в корзине
export interface IProductBasket {
	id: string;
	title: string;
	price: number;
	error?: string;
}

// корзина
export interface IBasket {
	items: IProductBasket[];
	sum: number | null;
}

export interface IOrderSuccess {
	id: string;
	totalAmount: number;
}

export type PaymentMethod = 'cash' | 'card';

export interface IOrder {
    // paymentMethod: any;
	// selectPaymentMethod: PaymentMethod | null;
	payment: PaymentMethod | null;
	email: string;
	phone: string;
	shippingAddress: string;
	totalAmount: number;
	items: string[];
}

export interface IAppState {
	catalog: IProductItem[];
	basket: string[];
	order: IOrder | null;
}

export interface IBasketItem {
	// список товаров в корзине
	title: string;
	price: number;
	error?: string;
}

export interface IOrderAddress {
	shippingAddress: string;
	payment: PaymentMethod;
}

export interface IOrderPersonalData {
	email: string;
	phone: string;
	payment: PaymentMethod | null;
}

export interface FormErrors {
	// paymentMethod: string;
	email?: string;
	phone?: string;
	payment?: string;
	shippingAddress?: string;
}

// Тип для обобщенной структуры ошибок в форме
export type FormErrorsType = Partial<Record<keyof FormErrors, string>>;
