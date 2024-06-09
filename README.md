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

## Документация к проекту Web-ларёк (Интернет-магазин)

### Описание проекта:
Web-ларёк - это интернет-магазин, построенный на архитектуре **MVC (Model-View-Controller)**, который позволяет пользователям просматривать каталог товаров, добавлять товары в корзину и оформлять заказы. Проект разделен на несколько слоев, каждый из которых отвечает за определенную функциональность.

### Структура проекта:
1. Model (Модель):
   - `AppStateModel`: Класс, отвечающий за хранение и управление данными приложения, включая каталог товаров, корзину, заказ и обработчики событий.

2. View (Представление):
   - `Page`: Класс, отвечающий за отображение главной страницы приложения, каталога товаров и счетчика товаров в корзине.
   - `Card`, `CardPreview`: Классы, отвечающие за отображение карточки товара и предварительного просмотра товара.
   - `Basket`: Класс, отвечающий за отображение корзины с добавленными товарами, общей суммы заказа и управление товарами в корзине.
   - `Modal`, `Success`: Классы, отвечающие за отображение модальных окон с информацией о заказе и успешном оформлении заказа.
   - `OrderAddress`, `ContactsOrder`: Классы, отвечающие за отображение форм для ввода адреса доставки и контактной информации при оформлении заказа.

3. Controller (Контроллер):
   - `Events`: Класс, отвечающий за обработку событий в приложении и обеспечение взаимодействия между моделью и представлением.

### Ключевые методы и свойства:
- `AppStateModel`: Класс для хранения и управления данными приложения.
Реализует интерфейс `IAppState`, который определяет структуру состояния приложения.

  - Свойства:
    - `order`: Информация о заказе (email, телефон, товары, способ оплаты, адрес, сумма).
    - `formErrors`: Уведомления об ошибках.
    - `catalog`: Список товаров в каталоге.
    - `basket`: Список идентификаторов товаров в корзине.
    - `preview`: Идентификатор товара для предпросмотра.
  - Методы:
    - `addInBasket(item)`: Добавить товар в корзину.
    - `deleteFromBasket(id)`: Удалить товар из корзины.
    - `getCountProductInBasket()`: Получить количество товаров в корзине.
    - `loadBasketFromLocalStorage(callback)`: Загрузить данные корзины из localStorage.
    - `defaultOrder()`: Установить значения заказа по умолчанию.
    - `clearBasket()`: Очистить корзину.
    - `getTotal()`: Получить общую сумму заказа.
    - `setCatalog(items)`: Установить список товаров в каталоге.
    - `getProductById(productId)`: Получить товар по идентификатору.
    - `fullBasket()`: Получить список товаров в корзине.
    - `checkBasket(item)`: Проверить наличие товара в корзине.
    - `setPreview(item)`: Установить товар для предпросмотра.
    - `setOrder()`: Установить данные заказа на основе корзины.
    - `checkPayment(orderPayment)`: Проверить и установить способ оплаты заказа.
    - `checkAddress(orderAddress)`: Проверить и установить адрес доставки заказа.
    - `checkAddressInLocalStorage()`: Проверить наличие сохраненного адреса доставки в localStorage.
    - `validateOrder()`: Проверить правильность заполнения данных заказа.
    - `setOrderField(payment, value)`: Установить значение поля заказа (способ оплаты).
    - `setContactField(field, value)`: Установить значение поля контактной информации (email, телефон, оплата).

2. View (Представление):
 - `Page`: Класс, отвечающий за отображение и управление главной страницей приложения.
 Класс `Page` наследуется от абстрактного класса `Component`. Он представляет собой базовый класс для страниц приложения.
  - Свойства:
    - `_counter`: Элемент, отображающий количество товаров в корзине.
    - `_catalog`: Элемент, содержащий список товаров в каталоге.
    - `_wrapper`: Элемент-обертка для главной страницы.
    - `_basket`: Элемент корзины в шапке страницы.
  - Методы:
    - `constructor(container, events)`: Конструктор класса, инициализирует свойства и добавляет обработчик события клика на корзину.
    - `set counter(value)`: Устанавливает значение счетчика товаров в корзине.
    - `set catalog(items)`: Устанавливает список товаров в каталоге.
    - `set locked(value)`: Блокирует или разблокирует страницу в зависимости от значения `value`.

  - `Card`: Класс, отвечающий за отображение и управление карточкой товара.
  Класс `Card` наследуется от класса `Component`. Он отвечает за отображение и управление карточкой товара.

  - Свойства:
    - `_title`: Элемент, отображающий заголовок карточки.
    - `_image`: Элемент, отображающий изображение товара.
    - `_description`: Элемент, отображающий описание товара (опционально).
    - `_button`: Элемент кнопки на карточке (опционально).
    - `_price`: Элемент, отображающий цену товара.
    - `_category`: Элемент, отображающий категорию товара.
    - `id`: Идентификатор карточки.
  - Методы:
    - `constructor(blockName, container, events, id)`: Конструктор класса, инициализирует свойства и добавляет обработчики событий.
    - `set title(value)`: Устанавливает заголовок карточки.
    - `set image(value)`: Устанавливает изображение товара.
    - `set description(value)`: Устанавливает описание товара.
    - `set price(value)`: Устанавливает цену товара и управляет доступностью кнопки.
    - `get price()`: Возвращает цену товара в числовом формате.
    - `set category(value)`: Устанавливает категорию товара и добавляет соответствующий класс.
    - `set button(value)`: Устанавливает текст кнопки на карточке.

   - `CardPreview`: Класс, отвечающий за отображение предварительного просмотра товара.
   Класс `CardPreview` наследуется от класса `Card`. Он представляет собой специализированную версию карточки товара с дополнительными функциями предварительного просмотра.

     - Свойства:
       - `item`: Объект, представляющий товар.
     - Методы:
       - `render()`: Отображает предварительный просмотр товара.

   - `Basket`: Класс, отвечающий за отображение корзины и управление товарами в ней.
  - Свойства:
    - `itemsInBasket`: Массив товаров в корзине.
    - `_list`: Элемент списка товаров в корзине.
    - `_total`: Элемент для отображения общей суммы заказа.
    - `_button`: Кнопка корзины в шапке сайта.
    - `_orderButton`: Кнопка оформления заказа.
    - `_counter`: Элемент для отображения количества товаров в корзине.
  - Методы:
    - `addItemToBasket(item)`: Добавляет товар в корзину.
    - `removeItemFromBasket(item)`: Удаляет товар из корзины.
    - `updateTotal()`: Обновляет общую сумму заказа.
    - `renderBasketItems()`: Отображает товары в корзине.
    - `getItemsInBasket()`: Возвращает товары из корзины.
    - `getItemId()`: Возвращает идентификаторы товаров в корзине.
    - `clearBasket()`: Очищает корзину.
    - `updateCounter()`: Обновляет счетчик количества товаров в корзине.

   - `Modal`: Класс, отвечающий за отображение модальных окон.
     - Свойства:
       - `content`: Содержимое модального окна.
     - Методы:
       - `render()`: Отображает модальное окно.
       - `close()`: Закрывает модальное окно.

  - `Success`: Класс, отвечающий за отображение и управление модальным окном с сообщением об успешном оформлении заказа.
Класс `Success` наследуется от класса `Component` и использует метод `ensureElement` из модуля `utils` для получения ссылок на элементы внутри модального окна. Отвечает за отображение и управление модальным окном с сообщением об успешном оформлении заказа.

  - Свойства:
    - `_close`: Элемент кнопки закрытия модального окна.
    - `_total`: Общая сумма заказа.
  - Методы:
    - `constructor(container, actions, total)`: Конструктор класса, инициализирует свойства и добавляет обработчик события на кнопку закрытия.
    - `setTotal(total)`: Устанавливает общую сумму заказа и обновляет соответствующий элемент в модальном окне.

- `OrderAddress`: Класс, отвечающий за отображение и управление формой ввода адреса доставки при оформлении заказа.
Класс `OrderAddress` наследуется от класса `Form` и используют интерфейсы `IOrderAddress` и `IEvents` из соответствующих модулей. 

  - Свойства:
    - `_buttons`: Массив кнопок выбора способа доставки.
  - Методы:
    - `constructor(container, events)`: Конструктор класса, инициализирует свойства и добавляет обработчики событий на кнопки выбора способа доставки.
    - `setButtonClass(name)`: Устанавливает активный класс для выбранной кнопки способа доставки.
    - `set address(address)`: Устанавливает значение поля ввода адреса доставки.

- `ContactsOrder`: Класс, отвечающий за отображение и управление формой ввода контактной информации при оформлении заказа.
Класс `ContactsOrder` наследуется от класса `Form` и использует интерфейсы `IOrderPersonalData` и `IEvents` из соответствующих модулей. 
  - Свойства:
    - `_email`: Поле ввода email.
    - `_phone`: Поле ввода телефона.
    - `_valid`: Флаг, указывающий на валидность введенных данных.
    - `_errors`: Массив ошибок валидации.
  - Методы:
    - `constructor(container, events)`: Конструктор класса, инициализирует свойства и добавляет обработчики событий на поля ввода.
    - `checkSubmitButtonState()`: Проверяет валидность введенных данных (email и телефон) и обновляет состояние кнопки отправки формы.
    - `set email(email)`: Устанавливает значение поля ввода email.
    - `set phone(phone)`: Устанавливает значение поля ввода телефона.
    - `getEmail()`: Возвращает значение поля ввода email.
    - `getPhone()`: Возвращает значение поля ввода телефона.

3. Controller (Контроллер):
   - `Events`: Класс, отвечающий за обработку событий в приложении.
     - Методы:
       - `on(eventName, callback)`: Регистрирует обработчик события.
       - `emit(eventName, data)`: Генерирует событие с передачей данных.

### Дополнительная информация:
- Проект использует шаблонизацию элементов для отображения информации.
- Для получения данных о товарах и оформления заказа используется API.
- Взаимодействие между компонентами осуществляется с помощью системы событий.