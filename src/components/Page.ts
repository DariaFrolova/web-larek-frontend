// Класс Page отвечает за отображение данных на странице товара
// Здесь у нас установлен счетчик корзины, каталога товаров и блокировки страницы при открытии модального окна

// попробовать сделать по аналогии с html.ts на проекте project afisha






















// import { ensureElement } from '../utils/utils';
// import { Component } from './base/Component';
// import { IEvents, EventEmitter } from './base/events';

// interface IPage {
// 	counter: number;
// 	catalog: HTMLElement[];
// 	locked: boolean;
// }

// export class Page extends Component<IPage> {
// 	protected _counter: HTMLElement;
// 	protected _catalog: HTMLElement;
// 	protected _wrapper: HTMLElement;
// 	protected _basket: HTMLElement;

// 	constructor(container: HTMLElement, protected events: IEvents) {
// 		super(container);

// 		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
// 		this._catalog = ensureElement<HTMLElement>('.gallery');
// 		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
// 		this._basket = ensureElement<HTMLElement>('.header__basket');

// 		this._basket.addEventListener('click', () => {
// 			this.events.emit('bids:open');
// 		});
// 	}

// 	set counter(value: number) {
// 		this.setText(this._counter, String(value));
// 	}

// 	set catalog(items: HTMLElement[]) {
// 		this._catalog.replaceChildren(...items);
// 	}

// 	set locked(value: boolean) {
// 		if (value) {
// 			this._wrapper.classList.add('page__wrapper_locked');
// 		} else {
// 			this._wrapper.classList.remove('page__wrapper_locked');
// 		}
// 	}
// }