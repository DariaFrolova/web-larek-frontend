import { Component } from '../base/Component';
import { createElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { CatalogProduct } from '../AppData';
import { IBasketItem } from '../../types';

export interface IBasketView {
	total: number;
	itemsInBasket: CatalogProduct[];
	items: IBasketItem[];
	sum: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected _orderButton: HTMLButtonElement;
	protected itemsInBasket: CatalogProduct[];
	protected _counter: HTMLElement;

	private items: IBasketItem[] = [];
	private sum: number | null = 0;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.itemsInBasket = [];
		this._list = container.querySelector('.basket__list') as HTMLElement;
		this._total = container.querySelector('.basket__price') as HTMLElement;
		this._orderButton = container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;
		this._button = document.querySelector('.header__basket') as HTMLElement;
		this._counter = this._button.querySelector(
			'.header__basket-counter'
		) as HTMLElement;

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('basket:open');
			});
		}

		if (this._orderButton) {
			this._orderButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
	}

	set total(total: number) {
		this.setText(this._total, total.toString());
	}

	addItemToBasket(item: CatalogProduct) {
		console.log('addItemToBasket вызван'); // Вывод в консоль при вызове метода addItemToBasket

		this.itemsInBasket.push(item); // Добавляем товар в массив корзины
		console.log(this.itemsInBasket); // Проверка, что товар добавлен в корзину
		this.renderBasketItems();
		this.updateTotal();
		localStorage.setItem('basketItems', JSON.stringify(this.itemsInBasket));
		this.updateCounter();
	}



	removeItemFromBasket(item: CatalogProduct) {
		console.log('removeItemFromBasket вызван');
		console.log('РАБОТАЕТ Removing item from basket:', item.id);

		this.itemsInBasket = this.itemsInBasket.filter((i) => i.id !== item.id);
		this.renderBasketItems();
		this.updateTotal();
		localStorage.setItem('basketItems', JSON.stringify(this.itemsInBasket));
		this.updateCounter();

		// Генерируем событие об удалении товара из корзины
		this.events.emit('basketItemRemoved', { itemId: item.id });
	}

	updateTotal() {
		console.log('updateTotal вызван');

		let total = 0;

		// Проходим по всем товарам в корзине и суммируем их цены
		this.itemsInBasket.forEach((item) => {
			total += item.price;
		});

		this.getItemsInBasket();
		// Устанавливаем общую цену в элемент интерфейса с добавлением слова "синапсов"
		this.setText(this._total, `${total} синапсов`);
		return total;
	}

	renderBasketItems() {
		console.log('renderBasketItems вызван');

		let counter = 1;
		this._list.innerHTML = '';
		this.itemsInBasket.forEach((item) => {
			const newItem = createElement<HTMLLIElement>('li', {
				className: 'basket__item card card_compact',
			});
			newItem.innerHTML = `
				<span class="basket__item-index">${counter}</span>
                <span class="card__title">${item.title}</span>
                <span class="card__price">${item.price} синапсов</span>
                <button class="basket__item-delete card__button" aria-label="удалить"></button>
            `;
			counter += 1;
			newItem
				.querySelector('.basket__item-delete')
				?.addEventListener('click', () => {
					this.removeItemFromBasket(item);
				});
			this._list.appendChild(newItem);
		});
	}
	getItemsInBasket(): CatalogProduct[] {
		console.log('getItemsInBasket вызван');

		if (this.itemsInBasket.length === 0) {
			this._list.innerHTML = '<p>Корзина пуста</p>';
			this.setDisabled(this._orderButton, true);
		} else {
			this.setDisabled(this._orderButton, false);
		}

		return this.itemsInBasket;
	}

	getItemId() {
		console.log('getItemId вызван');

		return this.itemsInBasket.map((item) => item.id);
	}

	clearBasket() {
		console.log('clearBasket вызван');

		// Очистка массива товаров в корзине
		this.itemsInBasket = [];
		// Обновление отображения корзины
		this.renderBasketItems();
		// Обновление общей суммы
		this.updateTotal();
		// Очистка localstorage
		localStorage.removeItem('basketItems');
		// Обновление счетчика
		this.updateCounter();
	}

	// Метод для обновления счетчика
	private updateCounter() {
		console.log('updateCounter вызван');

		this._counter.textContent = this.itemsInBasket.length.toString();
	}
}
