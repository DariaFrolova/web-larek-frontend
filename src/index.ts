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
import { Basket } from './components/common/Basket';
import { ProductBasket } from './components/common/ProductBasket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';

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
const basketComponent = new Basket(cloneTemplate(basketTemplate), events);
// const orderComponent = new Order(cloneTemplate(orderTemplate), events);
// const contactComponent = new Contacts(cloneTemplate(contactTemplate), events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// // Переиспользуемые компоненты
const basket = new Basket(cloneTemplate(basketTemplate), events); // Ошибка: переменная уже объявлена
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


// //выбираем товар
// events.on('card:select', (item: CatalogProduct) => {
//     appData.setPreview(item);
// });

// //Открытие карточки превью
// events.on('preview:changed', (item: CatalogProduct) => {
//   if(item) {
//    const card = new Card('card',cloneTemplate(cardPreviewTemplate), {
//    onClick: () => {
//        if (appData.checkBasket(item)) {
//            events.emit('webproduct:delete', item)
//        } else {
//            events.emit('webproduct:added', item)
//        }
//    }            
// });
//        modal.render({
//                content: card.render({
//                title: item.title,
//                image: item.image,
//                category: item.category,
//                description: item.description,
//                price: item.price,
//                button: appData.checkBasket(item) ? 'Убрать' : 'Купить',    
                  
//                })
//            })
//        } else {
//            modal.close();
//        }

//    });

// Выбор товара
events.on('card:select', (item: CatalogProduct) => {
    appData.setPreview(item);
});

// Обработка изменения превью
events.on('preview:changed', (item: CatalogProduct) => {
    if (item) {
        const card = createCard(item);
        showModalWithCard(card, item);
    } else {
        modal.close();
    }
});

function createCard(item: CatalogProduct): Card {
    return new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (appData.checkBasket(item)) {
                events.emit('webproduct:delete', item);
            } else {
                events.emit('webproduct:added', item);
            }
        }
    });
}

function showModalWithCard(card: Card, item: CatalogProduct): void {
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            description: item.description,
            price: item.price,
            button: appData.checkBasket(item) ? 'Убрать' : 'Купить'
        })
    });
}

// Обработка добавления и удаления товара из корзины
events.on('webproduct:added', (item: CatalogProduct) => {
    handleProductAction(item, () => appData.addInBasket(item.id));
});

events.on('webproduct:delete', (item: CatalogProduct) => {
    handleProductAction(item, () => appData.deleteFromBasket(item.id));
});

function handleProductAction(item: CatalogProduct, action: () => void): void {
    action(); // Выполнить действие с товаром
    closeModal(); // Закрыть модальное окно
}

function closeModal(): void {
    modal.close();
}


// //открытие корзины
// events.on('basket:open', () => {
// 	modal.render({
// 		content: basket.render(),
// 	});
// });

// Прослушивание события 'basket:open' и открытие модального окна с содержимым корзины
events.on('basket:open', () => {
    modal.render({
        content: basketComponent.render(), // Возможно, заменить basket на basketComponent
    });
});

// Пример инициирования события 'basket:open'
doOrderButton.addEventListener('click', () => {
    events.emit('basket:open');
});


