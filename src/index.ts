//  Это основной файл, который связывает все компоненты вместе и определяет логику работы приложения.
// В нем устанавливаются обработчики событий, вызываются методы из других файлов для обновления данных и отображения информации на странице.

import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	AppStateModel,
	CatalogProductChange,
	CatalogProduct,
} from './components/AppData';
import { Model } from './components/base/model';
import { Component } from './components/base/Component';

import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import {
	IProductItem,
	IOrder,
	PaymentMethod,
	IOrderAddress,
	FormErrors,
} from './types';

import { Page } from './components/Page';
import { Card, ICard, CardPreview } from './components/Card';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { OrderAddress } from './components/Order';
import { IOrderPersonalData } from './types';
import { IBasketItem } from './types';
import { ContactsOrder } from './components/Contacts';
import { Address } from 'cluster';
// import { FormState } from './components/common/Form';
import { FormState } from './components/common/Form';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const appData = new AppStateModel({}, events);

// events.onAll(({ eventName, data }) => {
// 	console.log(eventName, data);
// });

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
const contacts = new ContactsOrder(cloneTemplate(contactTemplate), events);

// Связываем логику загрузки товаров в корзину событием load окна (нужно чтобы сохранить после перезагрузки)
window.addEventListener('load', () => {
	const storedItems = localStorage.getItem('basketItems');
	if (storedItems) {
		const parsedItems = JSON.parse(storedItems);
		// Обновляем состояние корзины
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

	page.counter = appData.fullBasket().length; //  считает количество товара в корзине
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
			},
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
			}),
		});
	} else {
		console.log('No item provided');
	}
});

events.on('order:submit', () => {
    appData.setOrder();
    const orderData = {
        ...appData.order,
        paymentMethod: appData.order.payment // изменено с selectPaymentMethod на paymentMethod
    };
    api.getOrderItems(orderData)
        .then((result) => {
            const success = new Success(
                cloneTemplate(successTemplate),
                {
                    onClick: () => {
                        modal.close();
                        appData.clearBasket();
                        order.setButtonClass('');
                        events.emit('itemsBasket:changed');
                    },
                },
                appData.order.totalAmount
            );
            modal.render({ content: success.render({}) });
            appData.clearBasket();
        })
        .catch((err) => {
            console.error(err);
        });
});

// Добавление товара в корзину - обновлено
events.on('webproduct:added', (item: CatalogProduct) => {
	basket.addItemToBasket(item);
	appData.addInBasket(item.id);
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
});

// считает количество товаров в корзине
appData.loadBasketFromLocalStorage(() => {
	page.counter = appData.getCountProductInBasket();
	console.log('количество товара изменилось');
});

// Уведомление о том, что корзина изменилась
events.on('itemsBasket:changed', () => {
	events.emit('basket:open'); // Открываем корзину при изменениях
});

// Открытие модального окна корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Страница оплаты и адреса - обновлено //test123
events.on('order:open', () => {
	order.setButtonClass('');
	modal.render({
		content: order.render({
			// selectPaymentMethod: 'cash',
			payment: 'card',
			shippingAddress: '',
			valid: true,
			errors: [''],
		}),
	});
	console.log('Форма заказа открыта');
});

// выбрать оплату //test123
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
			selectPaymentMethod: 'cash',
			shippingAddress: '',
		}),
	});
	console.log('Форма контактов открыта');
});

// test123
events.on('formAddressErrors:change', (errors: Partial<IOrderAddress>) => {
	const { shippingAddress, payment } = errors;
	order.valid = !shippingAddress && !payment;
	order.errors = Object.values({ shippingAddress, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно поле формы с контактами
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderPersonalData; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('formContactErrors:change', (errors: Partial<IOrderPersonalData>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменился адрес доставки //test123
events.on('order.address:change', (data: { value: string }) => {
	appData.checkAddress(data.value);
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

// //  ОТПРАВКА ЗАКАЗА
// events.on('order:submit', () => {
// 	//обновлено
// 	appData.setOrder();
// 	api
// 		.getOrderItems(appData.order)
// 		.then((result) => {
// 			const success = new Success(
// 				cloneTemplate(successTemplate),
// 				{
// 					onClick: () => {
// 						modal.close();
// 						appData.clearBasket();
// 						order.setButtonClass('');
// 						events.emit('itemsBasket:changed');
// 					},
// 				},
// 				appData.order.totalAmount
// 			);
// 			modal.render({ content: success.render({}) });
// 			appData.clearBasket();
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		});
// });



// events.on('order:submit', () => {
//     appData.setOrder();
//     const orderData = {
//         email: appData.order.email,
//         phone: appData.order.phone,
//         items: appData.order.items,
//         payment: appData.order.payment,
//         shippingAddress: appData.order.shippingAddress,
//         totalAmount: appData.order.totalAmount
//     };
//     api.getOrderItems(orderData)
//         .then((result) => {
//             const success = new Success(
//                 cloneTemplate(successTemplate),
//                 {
//                     onClick: () => {
//                         modal.close();
//                         appData.clearBasket();
//                         order.setButtonClass('');
//                         events.emit('itemsBasket:changed');
//                     },
//                 },
//                 appData.order.totalAmount
//             );
//             modal.render({ content: success.render({}) });
//             appData.clearBasket();
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// });


// events.on('contacts:submit', () => {
// 	api
// 		.getOrderItems(appData.order)
// 		.then((result) => {
// 			appData.clearCart();
// 			const success = new Success(
// 				cloneTemplate(successTemplate),
// 				{ onClick: () => modal.close() },
// 				result.totalAmount
// 			);
// 			modal.render({ content: success.render({ total: result.totalAmount }) });
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		});
// });

// events.on('order:submit', () => {
//     api.getOrderItems(appData.order)
//         .then((result) => {
//             const success = new Success(cloneTemplate(successTemplate), {
//                 onClick: () => {
//                     modal.close();
//                     appData.clearBasket();
//                     events.emit('auction:changed');
//                 }
//             });

//             modal.render({
//                 content: success.render({})
//             });
//         })
//         .catch(err => {
//             console.error(err);
//         });
// });

// //  ОТПРАВКА ЗАКАЗА
// events.on('order:submit', () => {
// 	//обновлено
//     api.getOrderItems(appData.order)
//     .then((result) => {

//     })
// };
// 	appData.setOrder();
// 	api
// 		.getOrderItems(appData.order)
// 		.then((result) => {
// 			const success = new Success(
// 				cloneTemplate(successTemplate),
// 				{
// 					onClick: () => {
// 						modal.close();
// 						appData.clearBasket();
// 						order.setButtonClass('');
// 						events.emit('itemsBasket:changed');
// 					},
// 				},
// 				appData.order.totalAmount
// 			);
// 			modal.render({ content: success.render({}) });
// 			appData.clearBasket();
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		});
// });

// // ИМИТАЦИЯ ОТПРАВКИ НА СЕРВЕР
// events.on('contacts:submit', () => {
//     appData.setOrder();

//     // Имитация успешного ответа от сервера
//     const mockResponse = {
//       status: 'success',
//       message: 'Заказ успешно оформлен',
//       // Другие данные, которые могут быть получены от сервера
//     };

//     // Проверка успешного ответа
//     if (mockResponse.status === 'success') {
//       const success = new Success(
//         cloneTemplate(successTemplate),
//         {
//           onClick: () => {
//             modal.close();
//             appData.clearBasket();
//             order.setButtonClass('');
//             events.emit('itemsBasket:changed');
//           },
//         },
//         appData.order.totalAmount
//       );
//       modal.render({ content: success.render({}) });
//       appData.clearBasket();
//     } else {
//       // Обработка ошибки, если статус ответа не 'success'
//       console.error('Ошибка при оформлении заказа');
//     }
//   });

// // Добавление товара в корзину
// events.on('webproduct:added', (item: CatalogProduct) => {
// 	basket.addItemToBasket(item);
// 	appData.addInBasket(item.id);
// 	item.selected = true;
// 	page.counter = appData.getCountProductInBasket();
// 	modal.close();
// });

// // Удаление товара из корзины
// events.on('webproduct:delete', (item: CatalogProduct) => {
// 	basket.removeItemFromBasket(item);
// 	appData.deleteFromBasket(item.id);
// 	item.selected = false;
// 	basket.total = appData.getTotal();
// 	page.counter = appData.getCountProductInBasket();
// 	// Дополнительно обновляем товар, чтобы изменения отразились при открытии карточки
// 	events.emit('item:updated', item);
// 	modal.close();
// });
