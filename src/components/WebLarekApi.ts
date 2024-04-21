// // Здесь определить класс `WebLarekApi`, который отвечает за работу с API и получение данных о продуктах и заказах.
// // Здесь же реализовать методы для получения списка продуктов, конкретного продукта и оформления заказа через API.


























// import { Api, ApiListResponse } from "./base/api";
// import { IProductItem } from "../types";
// // import { IOrder } from "../types";
// // import { IOrderSuccess } from "../types";

// export interface WebLarekApi {
//     getProductList: () => Promise<IProductItem[]>;
//     getProductItem: (id: string) => Promise<IProductItem>;
//     // orderProduct: (order: IOrder) => Promise<IOrderSuccess>
// }

// export class LarekApi extends Api implements WebLarekApi {
//     readonly cdn: string;
//     constructor(cdn: string, baseUrl: string, options?: RequestInit) {
//         super(baseUrl, options);
//         this.cdn = cdn;
//     }
//     getProductList(): Promise<IProductItem[]> { 
//         return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
//     data.items.map((item) => ({
//         ...item,
//         image: this.cdn + item.image
//     }))
// );};
//     getProductItem(id: string): Promise<IProductItem> { return this.get(`/product/${id}`).then(
//         (item: IProductItem) => ({
//             ...item,
//             image: this.cdn + item.image,
//         })
//     );};
//     // orderProduct(order: IOrder): Promise<IOrderSuccess> {
//     //     return this.post('/order', order).then(
//     //         (data: IOrderSuccess) => data
//     //     );
//     // }
// }