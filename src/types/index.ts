export interface IProductItem {
	id: string;
	category: CardCategory;
	title: string;
	description: string;
	image: string;
	// price: number | null;
	price: number;
	// error?: string;
}


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

export interface IOrder {
	// id: string;
	items: string[];
	selectPaymentMethod: PaymentMethod;
	shippingAddress: string;
	email: string;
	phone: string;
	totalAmount: number;
}

export type PaymentMethod = 'онлайн' | 'при получении'; // способы оплаты
// export type shippingAddress = string; лишнее - не нужно, можно только если вдруг будет в интерфейсе список адресов, например: export type shippingAddressOptions = 'адрес1' | 'адрес2' | 'адрес3';

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


export interface IOrderAdress {
	// Этап выбора способа оплаты и доставки
	selectPaymentMethod: PaymentMethod;
	shippingAddress: string;
	error?: string;
}

export interface IOrderPersonalData {
	// Этап ввода персональных данных
	email: string;
	phone: string;
	error?: string;
}


export interface FormErrors {
    email?: string;
    phone?: string;
    selectPaymentMethod?: string;
    shippingAddress?: string;
}


// Тип для обобщенной структуры ошибок в форме
type FormErrorsType = Partial<Record<keyof FormErrors, string>>;

// Для расширения

//   // Тип компонента страницы
// type PageData = {
// 	counter: number;
// 	catalog: HTMLElement[];
// 	locked: boolean;
//   }

//   // Тип компонента формы
//   type FormData = {
// 	valid: boolean;
// 	errors: string[];
//   }

//   // Тип компонента модального окна
//   type ModalData = {
// 	content: HTMLElement;
//   }

//   // Тип компонента успешного оформления заказа
//   type SuccessData = {
// 	totalAmount: number;
//   }

//   // Тип компонента успешного оформления заказа с действиями
//   type SuccessProps = {
// 	data: SuccessData;
// 	onClick: () => void;
//   }

// Интерфейс для работы с данными, полученными с сервера
// export interface IDataApi {
// 	getProductItem: (id: string) => Promise<IProductItem>;
// 	getProductList: () => Promise<IProductItem[]>;
// 	getOrderItems(order: IOrder): Promise<IOrderSuccess>;
// }

// Карточка
// export interface IProductItem {
// 	// это карточка товара со всей информацией
// 	id: string;
// 	description: string;
// 	image: string;
// 	title: string;
// 	category: string;
// 	price: number;
// 	error?: string;
// }

// export interface IProductItem {
// 	id: string;
// 	description: string;
// 	price: number | null;
// 	title: string;
// 	image: string;
// 	category: CardCategory;
// 	error?: string;
// 	button: string;
// }

// export interface IOrder {
// 	// все, что содержит заказ
// 	id: string;
// 	userId: string;
// 	// orderId: string; // не требуется по заданию
// 	// quantity: number; //этого нет в интерфейсе
// 	totalAmount: number;
// 	selectPaymentMethod: PaymentMethod;
// 	shippingAddress: string;
// 	email: string;
// 	phone: string;
// }

// export interface IOrderSuccess extends IOrder {
// 	// Этап "ваш заказ оформлен"
// 	totalAmount: number;
// }


//Ошибки в формах
// Интерфейс для объекта ошибок в форме
// export  interface FormErrors {
// 	email: string;
// 	phone: string;
// 	// можно добавить другие поля, если нужно
// }