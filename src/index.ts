//  Это основной файл, который связывает все компоненты вместе и определяет логику работы приложения.
// В нем устанавливаются обработчики событий, вызываются методы из других файлов для обновления данных и отображения информации на странице.

import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppStateModel, CatalogProductChange, CatalogProduct } from './components/AppData';
import { Model } from './components/base/model';
import { Component } from './components/base/Component';

import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { IProductItem, IOrder, PaymentMethod, IOrderAdress } from './types';

import { Page } from './components/Page';
import { Card, ICard, CardPreview } from './components/Card';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { OrderAddress } from './components/Order';

import { IBasketItem } from './types';

import { OrderForm } from './components/common/OrderForm';


//контакты не забудь

const events = new EventEmitter();
const api = new WebLarekApi (CDN_URL, API_URL);
const appData = new AppStateModel({}, events);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// const countProductInBasket = appData.getCountProductInBasket();
// console.log('Количество товаров в корзине:', countProductInBasket); // считаем кол-во товаров в корзине

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardBasketModal = ensureElement<HTMLTemplateElement>('#card-basket');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');

//элементы
const modalAction = document.querySelector('.modal__actions');
const doOrderButton = modalAction.querySelector('.button');

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderAddress(cloneTemplate(orderTemplate), events);
// const contact = new Contacts(cloneTemplate(contactTemplate), events);

// const basket = new Basket('basket', cloneTemplate(basketTemplate), events);


// Связываем логику загрузки товаров в корзину событием load окна (нужно чтобы сохранить после перезагрузки)
window.addEventListener('load', () => {
	const storedItems = localStorage.getItem('basketItems');
	if (storedItems) {
		const parsedItems = JSON.parse(storedItems);
		// Обновляем состояние корзины
		parsedItems.forEach((item: CatalogProduct) => basket.addItemToBasket(item));
	}
});

//отрисовка карточек на странице
events.on<CatalogProductChange>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        // const card = new Card('card',cloneTemplate(cardCatalogTemplate), {
        //     onClick: () => events.emit('card:select', item)
        // });
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        }, item.id);
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });

    page.counter = appData.fullBasket().length; //  считает количество товара в корзине
});


// // Подписываемся на событие открытия формы для ввода контактной информации
// events.on('contact:open', () => {
// 	modal.render({
// 		content: contact.render({
// 			phone: '',
// 			email: '',
// 			valid: false,
// 			errors: [],
// 		}),
// 	});
// });


//выбираем товар - старый вариант
events.on('card:select', (item: CatalogProduct) => {
    appData.setPreview(item);
});

// Получение контейнера для отображения карточки превью
const container = document.getElementById('modal-container'); // Замените 'yourContainerId' на ID контейнера, куда вы хотите отображать превью


// // Открытие карточки превью с товаром
// events.on('preview:changed', (item: CatalogProduct) => {
//     if (item) {
//         const cardPreview = new CardPreview(container, item.id, {
//             onClick: () => {
//                 if (appData.checkBasket(item)) {
//                     events.emit('webproduct:delete', item);
//                 } else {
//                     events.emit('webproduct:added', item);
//                 }
//             }
//         });

//         modal.render({
//             content: cardPreview.render({
//                 title: item.title,
//                 image: item.image,
//                 category: item.category,
//                 description: item.description,
//                 price: item.price,
//                 button: appData.checkBasket(item) ? 'Убрать' : 'В корзину',
//             })
//         });
//     }
// });

//ОТЛАДКА

events.on('preview:changed', (item: CatalogProduct) => {
    console.log('Event "preview:changed" triggered with item:', item);

    if (item) {
        console.log('Creating CardPreview instance');
        const cardPreviewContainer = cloneTemplate(cardPreviewTemplate);
        const cardPreview = new CardPreview(cardPreviewContainer, item.id, {
            onClick: () => {
                console.log('CardPreview clicked');
                if (appData.checkBasket(item)) {
                    console.log('Emitting "webproduct:delete" event');
                    events.emit('webproduct:delete', item);
                } else {
                    console.log('Emitting "webproduct:added" event');
                    events.emit('webproduct:added', item);
                }
            }
        });

        console.log('Rendering modal with CardPreview content');
        modal.render({
            content: cardPreview.render({
                title: item.title,
                image: item.image,
                category: item.category,
                description: item.description,
                price: item.price,
                button: appData.checkBasket(item) ? 'Убрать' : 'В корзину',
            })
        });
    } else {
        console.log('No item provided');
    }
});


// Добавление товара в корзину
events.on('webproduct:added', (item: CatalogProduct) => {
    basket.addItemToBasket(item);
    appData.addInBasket(item.id);
    item.selected = true;
    page.counter = appData.getCountProductInBasket(); // считает количество
    modal.close(); // закрывает модальное окно после клика на "в корзину"
    });
    
    //Удаление товара из корзины
    events.on('webproduct:delete', (item: CatalogProduct) => {
    
    basket.removeItemFromBasket(item);
    appData.deleteFromBasket(item.id);
    item.selected = false;
    basket.total = appData.getTotal();
    page.counter = appData.getCountProductInBasket();
    // нужно еще дописать обновление товавров что-то типа update includices
    modal.close();
    });

   
    // Восстановление данных корзины при загрузке страницы
   
    // Открытие модального окна корзины
    events.on('basket:open', () => {
        modal.render({
            content: basket.render(),
        });
        // alert('Модальное окно корзины cейчас откроется!'); // для теста что что-то происходит
    });


  // Уведомление о том, что корзина изменилась
events.on('itemsBasket:changed',() => {
    events.emit('basket:open'); // Открываем корзину при изменениях
});
 

// // Оформить заказ
// events.on('order:open', () => {
// 	modal.render({
// 		content: order.render({
// 			shippingAddress: appData.order.shippingAddress, // Передаем адрес доставки для заполнения формы
// 			valid: false,
// 			errors: [], // Передаем ошибки валидации
// 		}),
// 	});
// });

// Оформить заказ - Этап 1 (Ввод адреса и выбор способа оплаты)
events.on('order:step1', () => {
	modal.render({
		content: order.render({
			shippingAddress: appData.order.shippingAddress,
			valid: false,
			errors: [],
		}),
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














// // Выбор товара
// events.on('card:select', (item: CatalogProduct) => {
//     appData.setPreview(item);
// });

// // Обработка изменения превью
// events.on('preview:changed', (item: CatalogProduct) => {
//     if (item) {
//         const card = createCard(item);
//         showModalWithCard(card, item);
//     } else {
//         modal.close();
//     }
// });

// function createCard(item: CatalogProduct): Card {
//     return new Card('card', cloneTemplate(cardPreviewTemplate), {
//         onClick: () => {
//             if (appData.checkBasket(item)) {
//                 events.emit('webproduct:delete', item);
//             } else {
//                 events.emit('webproduct:added', item);
//             }
//         }
//     });
// }

// function showModalWithCard(card: Card, item: CatalogProduct): void {
//     modal.render({
//         content: card.render({
//             title: item.title,
//             image: item.image,
//             category: item.category,
//             description: item.description,
//             price: item.price,
//             button: appData.checkBasket(item) ? 'Убрать' : 'Купить'
//         })
//     });
// }


// // // переход к оформлению заказа
// // // Открыть форму заказа
// // events.on('order:open', () => {
// //    order.setButtonClass('');
// // 	modal.render({
// // 		content: order.render({
// // 			selectPaymentMethod: null,
// // 			shippingAddress: '',
// // 			valid: false,
// // 			errors: [],
// // 		}),
// // 	});
// // });




// // events.on('basket:open', () => {
// //     modal.render({
// //         content: basketComponent.render(),
// //     });
// // });


// // doOrderButton.addEventListener('click', () => {
// //     events.emit('basket:open');
// // }); 
