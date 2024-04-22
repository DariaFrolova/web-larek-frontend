import { Component } from './base/Component';
import { IProductItem } from '../types';
import { ensureElement, bem, createElement } from '../utils/utils';

import { ICardActions } from '../types';
import { CardCategory } from '../types';

export type ICard = IProductItem & {
	id?: string;
	description?: string;
	button?: string;
	category: CardCategory;
};

// Соответствие категории карточки и их имен
const categoryCard: Record<CardCategory, string> = {
	[CardCategory.Other]: '_other',
	[CardCategory.SoftSkill]: '_soft',
	[CardCategory.HardSkill]: '_hard',
	[CardCategory.Additional]: '_additional',
	[CardCategory.Button]: '_button',
};

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;

	constructor(blockName: string, container: HTMLElement, events: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`, container
		);
		this._description = container.querySelector(`.${blockName}__text`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._price = ensureElement<HTMLImageElement>(
			`.${blockName}__price`, container
		);
		this._category = ensureElement<HTMLImageElement>(
			`.${blockName}__category`, container
		);

		if (this._button) {
			this._button.addEventListener('click', events.onClick);
		} else {
			container.addEventListener('click', events.onClick);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number) {
		if (!value) {
			this.setText(this._price, 'Бесценно');
			if (this._button) {
				this._button.setAttribute('disabled', '');
			}
		}
	}

	get price(): number {
		return Number(this._price.textContent);
	}

	set category(value: CardCategory) {
		this.setText(this._category, value);
		this._category.classList.add('card__category' + categoryCard[value]);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}
