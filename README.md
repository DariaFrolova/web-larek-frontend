# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

### Слои архитектуры:

#### Слой View:

 1. Класс Modal: 
 * Предоставляет общий функционал для управления модальными окнами в приложении. Является базовым классом для других модальных окон (ProductModal, CartModal, PaymentAndShippingModal и т.д.), унаследованных от него.

2. Класс ProductModal:
 * Отображает информацию о продукте пользователю (category, title, image, description, price).
 * Предоставляет методы `open()`, `close()`, `addToCart()` для взаимодействия пользователя с информацией о продукте (добавить в корзину, закрыть окно, открыть карточку товара).
	    
3. CartModal:
  * Отображение содержимого корзины и общей суммы (TotalAmount).
  * Предоставляет методы `open()`, `close()`, `removeFromCart()`, `updateTotalAmount()` для работы с корзиной.
  * Отображает элемены в корзине и обновляет общую сумму товаров.

4. PaymentAndShippingModal:
  * Отображение опций оплаты и ввода адреса доставки.
  * Предоставляет методы `open()`, `close()`, `selectPaymentMethod()`, `enterShippingAddress()`, `validatePaymentAndShipping()`, `goToNextStep()` для выбора оплаты и ввода адреса.

5. ContactDetailsModal:
   * Отображение и валидация контактных данных пользователя.
   * Предоставляет методы `open()`, `close()`, `validateEmail()`, `validatePhone()`, `goToNextStep()` для ввода и проверки email и номера телефона.

6. OrderConfirmationModal:
   * Отображение подтверждения заказа.
   * Предоставляет методы `showOrderConfirmation()` и `resetCart()` для показа информации о заказе и сброса данных корзины.

#### Слой Presenter:

1. API:
  * Слой коммуникации с сервером.
  * Предоставляет методы для взаимодействия с сервером: `getProductList()` для получения списка продуктов, `getProductItem(id)` для получения информации о товаре, `orderProduct(order)` для оформления заказа.
	 

#### Слой  Model:

1. Класс Product: 
* содержит основную информацию о продукте, которая понадобится для его отображения и обработки в приложении.
 - id (идентификационный номер товара): string (идентификаторы товаров могут быть представлены в различных форматах, поэтому string – )
 - title (название): string
 - category (категория): string;
 - image (изображение): string (ссылка на изображение)
 - price (цена): decimal (для работы с финансовыми данными);
 - description (описание): string;
   
2. Order:
   * Класс, представляющий информацию о заказе.
   * Содержит данные о заказе: id, id пользователя, id продукта, количество единиц товара, общая сумма, выбранный способ оплаты и адрес доставки - все, что пригодится магазину для обработки и идентификации заказа. 

###  Описание типов данных

|            *Product*                   |
|--------------------------------------|
| - id: string                         |
| - title: string                      |
| - category: string                   |
| - image: string                      |
| - price: decimal                     |
| - description: string                |



|              *Modal*                   |
|--------------------------------------|
| + open(): void                       |
| + close(): void                      |                



|           *ProductModal*               |
|--------------------------------------|
| - category: string                   |
| - title: string                      |
| - image: string                      |
| - description: string                |
| - price: decimal                     |
| + open(): void                       |
| + close(): void                      |
| + addToCart(): void                  |



|            *CartModal*                 |
| --------------------------------------| 
| - cartItems: array                   |
| - totalAmount: decimal               |
| + open(): void                       |
| + close(): void                      |
| + removeFromCart(): void             |
| + updateTotalAmount(): void          |



|    *PaymentAndShippingModal*           |  
| --------------------------------------| 
| - selectedPaymentMethod: string      |  
| - shippingAddress: string            |  
| + open(): void                       |
| + close(): void                      |  
| + selectPaymentMethod(method: string): void |
| + enterShippingAddress(address: string):void |  
| + validatePaymentAndShipping(): boolean |
| + goToNextStep(): void               |



|           *ContactDetailsModal*          |
| --------------------------------------| 
| - email: string                      |
| - phone: string                      |
| + open(): void                       |
| + close(): void                      |
| + validateEmail(email: string): boolean |
| + validatePhone(phone: string): boolean |
| + goToNextStep(): void                |



|          * OrderConfirmationModal*     |
| --------------------------------------| 
| + showOrderConfirmation(totalAmount: number): void |
| + resetCart(): void                  |


|             *API*                      |
| --------------------------------------| 
| + getProductList(): void              |
| + getProductItem(id: string): void   |
| + orderProduct(order: IOrder): void  |


|           *Order*                      |
| --------------------------------------| 
| - id: string                         |
| - userId: string                     |
| - productId: string                  |
| - quantity: number                   |
| - totalAmount: decimal               |
| - selectedPaymentMethod: string      |  
| - shippingAddress: string            | 
