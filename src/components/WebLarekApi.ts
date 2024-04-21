// // Здесь определить класс `WebLarekApi`, который отвечает за работу с API и получение данных о продуктах и заказах.
// // Здесь же реализовать методы для получения списка продуктов, конкретного продукта и оформления заказа через API.

import { ApiListResponse, Api } from './base/api';
import { IProductItem, IOrder, IOrderSuccess } from '../types';

export interface IDataApi {
	getProductItem: (id: string) => Promise<IProductItem>;
	getProductList: () => Promise<IProductItem[]>;
	getOrderItems(order: IOrder): Promise<IOrderSuccess>;
}

export class WebLarekApi extends Api implements IDataApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	async getProductItem(id: string): Promise<IProductItem> {
		try {
			const item = (await this.get(`/product/${id}`)) as IProductItem;
			return {
				...item,
				image: this.cdn + item.image,
			};
		} catch (error) {
			console.error('Ошибка при получении элемента продукта:', error);
			throw error;
		}
	}

	async getProductList(): Promise<IProductItem[]> {
		try {
			const data = (await this.get(`/product`)) as { items: IProductItem[] };
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		} catch (error) {
			console.error('Ошибка при получении списка товаров:', error);
			throw error;
		}
	}

	async getOrderItems(order: IOrder): Promise<IOrderSuccess> {
		try {
			const data = (await this.post('/order', order)) as IOrderSuccess;
			return data;
		} catch (error) {
			console.error('Ошибка при получении элементов заказа:', error);
			throw error;
		}
	}
}

// getProductItem(id: string): Promise<IProductItem> {
// 	return this.get(`/product/${id}`).then((item: IProductItem) => ({
// 		...item,
// 		image: this.cdn + item.image,
// 	}));
// }

// getProductList(): Promise<IProductItem[]> {
// 	return this.get(`/product`).then((data: ApiListResponse<IProductItem>) =>
// 		data.items.map((item) => ({
// 			...item,
// 			image: this.cdn + item.image,
// 		}))
// 	);
// }

// getOrderItems(order: IOrder): Promise<IOrderSuccess> {
// 	return this.post(`/order`, order).then((data: IOrderSuccess) => data);
// }
