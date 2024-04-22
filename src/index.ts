//  Это основной файл, который связывает все компоненты вместе и определяет логику работы приложения.
// В нем устанавливаются обработчики событий, вызываются методы из других файлов для обновления данных и отображения информации на странице.

import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppStateModel, CatalogProductChange, CatalogProduct } from './components/AppData';


import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { IProductItem, IOrder, PaymentMethod, IOrderAdress } from './types';

import { Page } from './components/Page';
import { Card } from './components/Card';

const events = new EventEmitter();
const api = new WebLarekApi (CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const appData = new AppStateModel({}, events);


// // Элементы
const modalAction = document.querySelector('.modal__actions');
const doOrderButton = modalAction.querySelector('.button');

// // Переиспользуемые части интерфейса
// const basketComponent = new Basket(cloneTemplate(basketTemplate), events);
// const orderComponent = new Order(cloneTemplate(orderTemplate), events);
// const contactComponent = new Contacts(cloneTemplate(contactTemplate), events);

const page = new Page(document.body, events);
// const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// // Переиспользуемые компоненты
// const basket = new Basket(cloneTemplate(basketTemplate), events); // Ошибка: переменная уже объявлена
// const order = new OrderAddress(cloneTemplate(orderTemplate), events); // Исправлено на orderComponent
// const contacts = new ContactsOrder(cloneTemplate(contactsTemplate), events); // Исправлено на contactComponent


events.on<CatalogProductChange>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card',cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
            
        });
    });

    page.counter = appData.fullBasket().length;
});
   
// Получаем карточки с сервера
api.getProductList()
	.then(appData.setCatalog.bind(appData))  
       .catch(err => {	
	console.error(err);
})
