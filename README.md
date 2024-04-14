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

Выбран паттерн проектирования MVVM

### Слой Model – здесь мы храним состояние наших данных и методы для их обработки:

1. Класс ProductModel представляет основные методы для работы с данными карточки товара: получение, добавление, обновление и удаление продуктов

В классе ProductModel есть объявленное свойство products: Product[]. Оно является массивом объектов Product

Методы:
- getProducts(): Product[] - метод для получения списка всех продуктов.
- getProductById(productId: string): Product - метод для получения информации о продукте по ID.
- addProduct(product: Product): void - метод для добавления новый товар в массив.
- updateProduct(product: Product): void - метод, который обновляет товар в массвие.
- deleteProduct(productId: string): void - метод, который удаляет товар из массива по ID.

2. Product представляет отдельный продукт с уникальным ID, названием, категорией, изображением, ценой и описанием.

3. OrderModel содержит данные заказов, предоставляет методы для получения всех заказов или заказа по ID, добавления, обновления и удаления заказа, а также генерации уникального ID заказа.

В классе OrderModel есть объявленное свойство orders: Order[]. Оно хранит массив с данными о заказе.

- getOrders(): Order[] - метод для получения списка всех заказов.
- getOrderById(orderId: string): Order - метод для получения информации о заказе по заданному идентификатору.
- addOrder(order: Order): void - метод для добавления нового заказа в список.
- updateOrder(order: Order): void - метод для обновления информации о существующем заказе.
- deleteOrder(orderId: string): void - метод для удаления заказа из списка по идентификатору.
- generateOrderId(): string - метод для генерации уникального идентификатора заказа. Этот метод должен вызываться перед добавлением нового заказа и возвращать уникальный orderId для использования в новом заказе.

4. Класс Order - класс, который содержит информацию о заказе (идентификатор заказа, идентификатор пользователя, количество товаров, общая сумма, выбранный метод оплаты, адрес доставки, емейл и телефон для связи)

5. Modal

- open(): void - открыть модальное окно.
- close(): void - закрыть модальное окно.

6. ProductModal

- showSomeProperties(): void - показать определенные свойства продукта (например, только цену и название), которые требуются в конкретном модальном окне.

7. CartModal 

- showSomeProperties(): void - показываем определенные свойства товаров в корзине, , которые требуются в конкретном модальном окне.
- removeFromCart(): void - удалить товар из корзины.
- calculateTotalAmount(): void - рассчитать общую стомость товаров в корзине.


8. PaymentAndShippingModal.

- selectPaymentMethod(method: string): void - показываем выбор способа оплаты.
- enterShippingAddress(address: string): void - показываем поле для ввода адреса доставки.
- validatePaymentAndShipping(): boolean - проверяем и показывавем в интерфейсе валидность выбранного метода оплаты и введенного адреса доставки или ошибок


9. ContactDetails 

- inputEmail(email: string): void - установить адрес электронной почты.
- inputPhone(phone: string): void - установить телефонный номер.
- validateEmail(): boolean - проверить адрес электронной почты и показать ошибку, если что-то не так.
- validatePhone(): boolean - проверить телефонный номер и показать ошибку, если что-то не так.


### Слой View - здесь мы определяем, как отображаются данные и состояние пользовательского интерфейса


1. CartModalView
Содержит экземпляр класса Modal, и может использовать его методы для открытия и закрытия модального окна.

- updateTotalAmount(total: decimal): void - обновить общую сумму товаров в корзине.
- toggleCheckoutButton(): void - включить/выключить кнопку "Оформить" в зависимости от условий.
- renderCartItems(): void - отрисовать элементы корзины.

2. PaymentAndShippingModalView
Содержит экземпляр класса Modal, и может использовать его методы для открытия и закрытия модального окна.

- selectPaymentMethod(method: string): void - выбрать метод оплаты.
- enterShippingAddress(address: string): void - ввести адрес доставки.
- goToNextStep(): void - перейти к следующему шагу в зависимости от условий.


3. ContactDetailsView
Содержит экземпляр класса Modal, и может использовать его методы для открытия и закрытия модального окна.

- updateEmail(email: string): void - обновить адрес электронной почты.
- updatePhone(phone: string): void - обновить телефонный номер.
- toggleNextStepButton(isEnabled: boolean): void - включить/выключить кнопку "Следующий шаг" в зависимости от валидации.


### Слой ViewModel - здесь слой обрабатывает взаимодействие между View и Model, он может получать данные из Model и форматировать их для View или получать ввод от представителя и обрабатывать его, чтобы обновить Model


1. ProductModalViewModel
Наследуется от ProductModal.
- addToCart(): void - добавить продукт в корзину.

2. CartViewModel

Имеет связь с CartModal и использует его для обработки бизнес-логики, например, добавление товара в корзину (addToCart()), удаление товара из корзины (removeFromCart()) и обновление общей суммы корзины (updateTotalAmount())

- addToCart(item: Item): void - добавить товар в корзину.
- removeFromCart(item: Item): void - удалить товар из корзины.
- updateTotalAmount(): void - обновить общую сумму товаров в корзине.

3. PaymentAndShippingModalViewModel
Содержит экземпляр класса Modal, и может использовать его методы для открытия и закрытия модального окна.

- selectPaymentMethod(method: string): void - выбрать метод оплаты.
- enterShippingAddress(address: string): void - ввести адрес доставки.
- goToNextStep(): void - перейти к следующему шагу.

4. ContactDetailsViewModel 
Управляет коммуникацией и обработкой данных между ContactDetails и ContactDetailsView

- enterEmail(email: string): void - ввести адрес электронной почты.
- enterPhone(phone: string): void - ввести телефонный номер.
- goToNextStep(): void - перейти к следующему шагу.

5. OrderConfirmationViewModel
Содержит экземпляр класса Modal, и может использовать его методы для открытия и закрытия модального окна.

- displayNewOrderConfirmation(): void - отображать подтверждение нового заказа.
- goToCatalog(): void - перейти к каталогу.





|            ProductModel              |
|--------------------------------------|
| - products: Product[]                |
|--------------------------------------|
| + getProducts(): Product[]           |
| + getProductById(productId: string): Product |
| + addProduct(product: Product): void |
| + updateProduct(product: Product): void |
| + deleteProduct(productId: string): void |


|              Product                 |
|--------------------------------------|
| - id: string                         |
| - title: string                      |
| - category: string                   |
| - image: string                      |
| - price: decimal                     |
| - description: string                |


|            OrderModel                |
|--------------------------------------|
| - orders: Order[]                    |
|--------------------------------------|
| + getOrders(): Order[]               |
| + getOrderById(orderId: string): Order |
| + addOrder(order: Order): void       |
| + updateOrder(order: Order): void    |
| + deleteOrder(orderId: string): void |
| - generateOrderId(): string          |


|           Order                      |
|--------------------------------------|
| - id: string                         |
| - userId: string                     |
| - orderId: string                    |
| - quantity: number                   |
| - totalAmount: decimal               |
| - selectedPaymentMethod: string      |
| - shippingAddress: string            | 
| - email: string                      |
| - phone: string                      |


#### Модальное окно с карточкой товара

|              Modal                   |
|--------------------------------------|
| + open(): void                       |
| + close(): void                      |  

|           ProductModal               |
|--------------------------------------|
|+ showSomeProperties(): void          |

|         ProductModalViewModel        |
|--------------------------------------|
| + addToCart(): void                  |


#### Этап корзины с перечнем товаров

|            CartModal                 |
| -------------------------------------| 
| - cartItems: array                   |
| - totalAmount: decimal               |
| + showSomeProperties(): void         |
| + removeFromCart(): void             |
| + calculateTotalAmount(): void       |


|    CartModalView                     |
| -------------------------------------| 
| - modal: Modal                       |
|--------------------------------------|
| + updateTotalAmount(total: decimal): void |
| + toggleCheckoutButton(): void |
| + renderCartItems(): void |


|            CartViewModel             |
| -------------------------------------| 
| - cartModal: CartModal               |
|--------------------------------------|
| + addToCart(item: Item): void        |
| + removeFromCart(item: Item): void   |
| + updateTotalAmount(): void          |


#### Этап "выбор способа оплаты и способа доставки" 

|    PaymentAndShippingModal   |
| ---------------------------- |
| - selectedPaymentMethod: string |
| - shippingAddress: string |
| + selectPaymentMethod(method: string): void |
| + enterShippingAddress(address: string): void |
| + validatePaymentAndShipping(): boolean |

|      PaymentAndShippingModalViewModel      |
| ------------------------------------------ |
| - modal: Modal     |
| - paymentAndShippingModal: PaymentAndShippingModal |
| + selectPaymentMethod(method: string): void |
| + enterShippingAddress(address: string): void |
| + goToNextStep(): void |

|       PaymentAndShippingModalView       |
| --------------------------------------- |
| - modal: Modal     |
|--------------------------------------|
| + updatePaymentMethod(method: string): void |
| + updateShippingAddress(address: string): void |
| + toggleNextStepButton(isEnabled: boolean): void |


#### Этап "введите email / телефон" 

|           ContactDetails            |
| ----------------------------------- |
| - email: string                     |
| - phone: string                     |
| + inputEmail(email: string): void     |
| + inputPhone(phone: string): void     |
| + validateEmail(): boolean          |
| + validatePhone(): boolean          |

|       ContactDetailsViewModel       |
| ------------------------------------|
| - contactDetails: ContactDetails    |
| + enterEmail(email: string): void   |
| + enterPhone(phone: string): void   |
| + goToNextStep(): void              |

|           ContactDetailsView            |
| ----------------------------------------|
| - modal: Modal     |
|--------------------------------------|
| + updateEmail(email: string): void      |
| + updatePhone(phone: string): void      |
| + toggleNextStepButton(isEnabled: boolean): void |


#### Этап "ваш заказ оформлен" 

|     OrderConfirmationViewModel       |
|--------------------------------------|
| - orderModel: OrderModel             |
| - modal: Modal                       |
|--------------------------------------|
| + displayNewOrderConfirmation(): void|
| + goToCatalog(): void                |


|   OrderConfirmationModal         |
| ---------------------------------|
| + showOrderConfirmation(totalAmount: number): void |
|  + resetCart(): void              | 
