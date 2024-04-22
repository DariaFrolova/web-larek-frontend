import { Component } from '../base/Component';
import { createElement, cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement('.basket__list', this.container);
		this._total = ensureElement('.basket__price', this.container);
		this._button = ensureElement('.basket__button', this.container);

		this._button.addEventListener(
			'click',
			this.handleClickOrderOpen.bind(this)
		);

		this.items = [];
	}

	private handleClickOrderOpen() {
		this.events.emit('order:open');
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}
