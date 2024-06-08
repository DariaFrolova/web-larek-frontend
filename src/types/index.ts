//карточка товара
export interface IProductItem {
	id: string;
	category?: CardCategory;
	title: string;
	description: string;
	image: string;
	price: number;
}

// категории товаров
export enum CardCategory {
	SoftSkill = 'софт-скил',
	Other = 'другое',
	Additional = 'дополнительное',
	HardSkill = 'хард-скил',
	Button = 'кнопка',
}

// способы оплаты
export type PaymentMethod = 'cash' | 'card';
export interface IOrder {
	items: string[];
	address: string;
	payment: PaymentMethod;
	email: string;
	phone: string;
	total: number;
}

export interface IAppState {
	catalog: IProductItem[];
	basket: string[];
	order: IOrder | null;
}

export interface IOrderSuccess {
	id: string;
	total: number;
}

// список товаров в корзине
export interface IBasketItem {
	quantity: number;
	title: string;
	price: number;
	// error?: string;
}

export interface IOrderAddress {
	// shippingAddress: string;
	address: string;
	payment: PaymentMethod;
}

export interface IOrderPersonalData {
	email: string;
	phone: string;
	payment: PaymentMethod | null;
	address: string;
}

export interface FormErrors {
	email: string;
	phone: string;
	payment: PaymentMethod;
	address: string;
}

// Тип для обобщенной структуры ошибок в форме
export type FormErrorsType = Partial<Record<keyof FormErrors, string>>;

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
