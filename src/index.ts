import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	AppStateModel,
	CatalogProductChange,
	CatalogProduct,
} from './components/AppData';

import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { PaymentMethod } from './types';

import { Page } from './components/Page';
import { Card, CardPreview } from './components/Card';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { OrderAddress } from './components/Order';
import { IOrderPersonalData } from './types';
import { ContactsOrder } from './components/Contacts';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const appData = new AppStateModel({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardBasketModal = ensureElement<HTMLTemplateElement>('#card-basket');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const modalAction = document.querySelector('.modal__actions');
const doOrderButton = modalAction.querySelector('.button');

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderAddress(cloneTemplate(orderTemplate), events);
const contacts = new ContactsOrder(cloneTemplate(contactTemplate), events);

// Загружаем сохраненные элементы корзины из localstorage при перезагрузке страницы
window.addEventListener('load', () => {
	const storedItems = localStorage.getItem('basketItems');
	if (storedItems) {
		const parsedItems = JSON.parse(storedItems);
		parsedItems.forEach((item: CatalogProduct) => basket.addItemToBasket(item));
	}
});

//Изменились элементы каталога
events.on<CatalogProductChange>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(
			'card',
			cloneTemplate(cardCatalogTemplate),
			{
				onClick: () => events.emit('card:select', item),
			},
			item.id
		);
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});

	page.counter = appData.fullBasket().length;
});

//выбираем товар - старый вариант
events.on('card:select', (item: CatalogProduct) => {
	appData.setPreview(item);
});

// Получение контейнера для отображения карточки превью
const container = document.getElementById('modal-container');

events.on('item:updated', (item: CatalogProduct) => {
	const cardElement = document.getElementById(`card-${item.id}`);
	if (cardElement) {
		const addButton = cardElement.querySelector(
			'.add-to-cart-button'
		) as HTMLButtonElement;
		if (addButton) {
			addButton.textContent = appData.checkBasket(item)
				? 'Убрать'
				: 'Добавить в корзину';
		}
	}
});

// открытие карточки превью - это ОК
events.on('preview:changed', (item: CatalogProduct) => {
	console.log('Событие "preview:changed" вызвано с элементом:', item);

	if (item) {
		console.log('Создание экземпляра CardPreview');
		const cardPreviewContainer = cloneTemplate(cardPreviewTemplate);
		const cardPreview = new CardPreview(cardPreviewContainer, item.id, {
			onClick: () => {
				console.log('onClick на CardPreview');
				if (appData.checkBasket(item)) {
					console.log('Генерация события "webproduct:delete"');
					events.emit('webproduct:delete', item);
				} else {
					console.log('Генерация события "webproduct:added"');
					events.emit('webproduct:added', item);
				}
			},
		});

		console.log('рендеринг модального окна с содержимым CardPreview');
		modal.render({
			content: cardPreview.render({
				title: item.title,
				image: item.image,
				category: item.category,
				description: item.description,
				price: item.price,
				button: appData.checkBasket(item) ? 'Убрать' : 'В корзину',
			}),
		});
	} else {
		console.log('item отсутствует');
	}
});

// Добавление товара в корзину - обновлено
events.on('webproduct:added', (item: CatalogProduct) => {
	basket.addItemToBasket(item);
	appData.addInBasket(item);

	page.counter = appData.getCountProductInBasket();
	modal.close();
});

// Удаление товара из корзины - обновлено
events.on('webproduct:delete', (item: CatalogProduct) => {
	basket.removeItemFromBasket(item);
	appData.deleteFromBasket(item.id);

	basket.total = appData.getTotal();
	page.counter = appData.getCountProductInBasket();
	modal.close();

	basket.updateTotal();
});

// считает количество товаров в корзине
appData.loadBasketFromLocalStorage(() => {
	page.counter = appData.getCountProductInBasket();
	console.log('количество товара изменилось');
});

// Уведомление о том, что корзина изменилась
events.on('itemsBasket:changed', () => {
	events.emit('basket:open');
});

// Открытие модального окна корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
	basket.getItemsInBasket();
});

events.on('order:open', () => {
	//этого не было в задании. но можно сделать опыт пользователя лучше - сохранять уже заполненные данные, если он закрыл модальное окно с формой
	const savedAddress = localStorage.getItem('deliveryAddress');
	modal.render({
		content: order.render({
			payment: 'card',
			address: savedAddress || '',
			valid: false,
			errors: [''],
		}),
	});
	console.log('Форма заказа открыта');
});

// выбрать оплату
events.on('payment:changed', (data: { target: PaymentMethod }) => {
	console.log('Изменен метод оплаты на:', data.target);
	appData.checkPayment(data.target);
});

// Показать страницу емейла и телефона - изменен
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [''],
			payment: null,
		}),
	});
	console.log('Форма контактов открыта');
});

// Обработка изменения данных платежа или адреса доставки в заказе
events.on(
	/^order\.(payment|address):change/,
	(data: { field: keyof IOrderPersonalData; value: 'cash' | 'card' }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Обновление ошибок в форме заказа
events.on('formErrors:change', (errors: Partial<IOrderPersonalData>) => {
	const { email, phone, address } = errors;
	order.valid = !email && !phone && !address;
	order.errors = Object.values({ phone, email, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменился адрес
events.on('order.address:change', (data: { value: string }) => {
	localStorage.setItem('deliveryAddress', data.value);
	appData.checkAddress(data.value);
});

// Изменился email
events.on('contacts.email:change', (data: { value: string }) => {
	appData.setContactField('email', data.value);
	appData.validateOrder();
});

// Изменился телефон
events.on('contacts.phone:change', (data: { value: string }) => {
	appData.setContactField('phone', data.value);
	appData.validateOrder();
});

// отправляем заказ
events.on('contacts:submit', () => {
	const email = contacts.getEmail(); // Получаем емейл
	const phone = contacts.getPhone(); // Получаем номер телефона
	const total = basket.updateTotal(); // Получаем сумму заказа
	const productsId = basket.getItemId(); // Получаем заказанные товары

	appData.order.email = email;
	appData.order.phone = phone;
	appData.order.total = total;
	appData.order.items = productsId;

	api
		.getOrderItems(appData.order)
		.then((result) => {
			// Очищаем localStorage, корзину товаров и адрес доставки
			localStorage.clear();
			appData.clearBasket();
			basket.clearBasket();
			appData.order.items = [];

			const success = new Success(
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
					},
				},
				total
			);
			success.setTotal(total);

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
