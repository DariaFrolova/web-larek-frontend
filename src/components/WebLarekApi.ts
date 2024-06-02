// // Здесь определить класс `WebLarekApi`, который отвечает за работу с API и получение данных о продуктах и заказах.
// // Здесь же реализовать методы для получения списка продуктов, конкретного продукта и оформления заказа через API.

import { ApiListResponse, Api } from './base/api';
import { IProductItem, IOrder, IOrderSuccess } from '../types';
import { ContactsOrder } from './Contacts';

export interface IDataApi {
    getProductList: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    getOrderItems: (order: IOrder) => Promise<IOrderSuccess>;
}

export class WebLarekApi extends Api implements IDataApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProductItem> {
		return this.get(`/product/${id}`).then((item: IProductItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getOrderItems(order: IOrder): Promise<IOrderSuccess> {
		return this.post('/order', order).then((data: IOrderSuccess) => data);
	}


    // 
    // getProductItem(id: string): Promise<IProductItem> {
    //     console.log('Запрос детальных данных продукта с ID:', id);
    //     return this.get(`/product/${id}`).then((item: IProductItem) => {
    //         console.log('Получены детальные данные продукта:', item);
    //         return {
    //             ...item,
    //             image: this.cdn + item.image,
    //         };
    //     }).catch((error) => {
    //         console.error('Ошибка при получении элемента продукта:', error);
    //         throw error;
    //     });
    // }

    // getProductList(): Promise<IProductItem[]> {
    //     console.log('Запрос списка продуктов');
    //     return this.get('/product').then((data: { items: IProductItem[] }) => {
    //         return data.items.map((item) => ({
    //             ...item,
    //             image: this.cdn + item.image,
    //         }));
    //     }).catch((error) => {
    //         console.error('Ошибка при получении списка товаров:', error);
    //         throw error;
    //     });
    // }

    // getOrderItems(order: IOrder): Promise<IOrderSuccess> {
    //     console.log('Запрос на получение информации о заказе:', order);
    //     return this.post('/order', order).then((result: IOrderSuccess) => {
    //         console.log('Получена информация о заказе:', result);
    //         return result;
    //     }).catch((error) => {
    //         console.error('Ошибка при получении информации о заказе:', error);
    //         throw error;
    //     });
    // }
}

