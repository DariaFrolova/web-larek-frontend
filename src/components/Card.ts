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
	protected id: string;

	constructor(blockName: string, container: HTMLElement, events: ICardActions, id: string) {
		super(container);
		this.id = id;
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

	// set price(value: number) {
	// 	if (!value) {
	// 		this.setText(this._price, 'Бесценно');
	// 		if (this._button) {
	// 			this._button.setAttribute('disabled', '');
	// 		}
	// 	}
	// }

	// set price(value: number) {
	// 	if (!value || this.id !== this.id) {
	// 		this.setText(this._price, 'Бесценно');
	// 		if (this._button) {
	// 			this._button.setAttribute('disabled', '');
	// 		}
	// 	} else {
	// 		this.setText(this._price, value.toString());
	// 		if (this._button) {
	// 			this._button.removeAttribute('disabled');
	// 		}
	// 	}
	// }
	

	set price(value: number) {
		if (!value || this.id !== this.id) {
			this.setText(this._price, 'Бесценно');
			if (this._button) {
				this._button.setAttribute('disabled', '');
			}
		} else {
			this.setText(this._price, `${value} синапсов`);
			if (this._button) {
				this._button.removeAttribute('disabled');
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


// // старый код 
// export class CardPreview extends Card {
//     protected _description: HTMLElement;
//     protected blockName: string = 'card'; // Добавляем свойство blockName

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('card', container, actions);
//         this._description = container.querySelector(`.${this.blockName}__text`);
//     }

//     set description(value: string) {
//         this.setText(this._description, value);
//     }
// }

// export class CardPreview extends Card {
//     protected _description: HTMLElement;
//     protected blockName: string = 'card'; // Добавляем свойство blockName
//     protected id: string; // Добавляем свойство id 

//     constructor(container: HTMLElement, actions?: ICardActions, id: string) {
//         super('card', container, actions, id);
//         this._description = container.querySelector(`.${this.blockName}__text`);
//     }

//     set description(value: string) {
//         this.setText(this._description, value);
//     }
// }

// export class CardPreview extends Card {
//     protected _description: HTMLElement;
//     protected blockName: string = 'card'; // Добавляем свойство blockName
//     protected id: string; // Добавляем свойство id 

//     constructor(container: HTMLElement, id: string, actions: ICardActions, ) {
//         super('card', container, actions, id);
//         this._description = container.querySelector(`.${this.blockName}__text`);
//     }

//     set description(value: string) {
//         this.setText(this._description, value);
//     }
// }


// С ОТЛАДКОЙ
export class CardPreview extends Card {
    [x: string]: any;
    protected _description: HTMLElement;
    protected blockName: string = 'card';
    protected id: string;

    constructor(container: HTMLElement, id: string, actions: ICardActions) {
        super('card', container, actions, id);
        console.log('CardPreview constructor called');
        this._description = container.querySelector(`.${this.blockName}__text`);
    }

    set description(value: string) {
        console.log('Setting CardPreview description:', value);
        this.setText(this._description, value);
    }
}
