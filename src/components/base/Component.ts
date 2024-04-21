import { IEvents } from './events';

export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	// Переключить класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Скрыть
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показать
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}

// самописка

// // Импорт класса EventEmitter и интерфейса IEvents из файла events для работы с событиями в приложении
// import { EventEmitter, IEvents } from './events';

// // Объявление абстрактного класса Component с обобщенным типом T. Содержит базовую логику и методы для компонентов
// export abstract class Component<T> {
//   // Создаем объект emitter типа EventEmitter для работы с событиями в рамках компонента
//   protected emitter: EventEmitter = new EventEmitter();
//   // Поле для хранения объекта событий
//   protected events: IEvents;

//   // Конструктор класса, принимает корневой элемент контейнера для компонента
//   protected constructor(protected readonly container: HTMLElement) {}

//   // Метод для установки объекта событий
//   setEvents(events: IEvents) {
//     this.events = events;
//   }

//   // Метод для подписки на событие с переданным именем и колбэком
//   subscribe(eventName: string, callback: (data: unknown) => void) {
//     this.emitter.on(eventName, callback);
//   }

//   // Метод для эмитирования события с переданным именем и данными
//   emitChanges(event: string, payload?: object) {
//     this.events.emit(event, payload ?? {});
//   }

//   // Метод для переключения класса у указанного DOM элемента
//   toggleClass(element: HTMLElement, className: string, force?: boolean) {
//     element.classList.toggle(className, force);
//   }

//   // Метод для установки текстового содержимого указанному DOM элементу
//   protected setText(element: HTMLElement, value: unknown) {
//     if (element) {
//       element.textContent = String(value);
//     }
//   }

//   // Метод для установки статуса блокировки указанного DOM элемента
//   setDisabled(element: HTMLElement, state: boolean) {
//     if (element) {
//       if (state) element.setAttribute('disabled', 'disabled');
//       else element.removeAttribute('disabled');
//     }
//   }

//   // Метод для скрытия указанного DOM элемента
//   protected setHidden(element: HTMLElement) {
//     element.style.display = 'none';
//   }

//   // Метод для отображения указанного DOM элемента
//   protected setVisible(element: HTMLElement) {
//     element.style.removeProperty('display');
//   }

//   // Метод для установки изображения и альтернативного текста указанному DOM элементу
//   protected setImage(element: HTMLImageElement, src: string, alt?: string) {
//     if (element) {
//       element.src = src;
//       if (alt) {
//         element.alt = alt;
//       }
//     }
//   }

//   // Метод для рендеринга компонента с возможностью передачи данных для обновления его состояния
//   render(data?: Partial<T>): HTMLElement {
//     // Обновляем свойства компонента данными из параметра data
//     Object.assign(this as object, data ?? {});
//     return this.container; // Возвращаем корневой DOM элемент компонента
//   }
// }

// // ЭТО ВАРИАНТ БЕЗ функциональности эмитирования событий в класс Component<T>

// // // Импорт класса EventEmitter и интерфейса IEvents из файла events для работы с событиями в приложении
// // import { EventEmitter, IEvents } from './events';

// // // Объявление абстрактного класса Component с обобщенным типом T. Содержит базовую логику и методы для компонентов
// // export abstract class Component<T> {
// // 	// Создаем объект emitter типа EventEmitter для работы с событиями в рамках компонента
// // 	protected emitter: EventEmitter = new EventEmitter();
// // 	// Конструктор класса, принимает корневой элемент контейнера для компонента
// // 	protected constructor(protected readonly container: HTMLElement) {}
// // 	// Метод для подписки на событие с переданным именем и колбэком
// // 	subscribe(eventName: string, callback: (data: unknown) => void) {
// // 		this.emitter.on(eventName, callback);
// // 	}
// // 	// Метод для эмиттирования события с переданным именем и данными
// // 	emit(eventName: string, data: any) {
// // 		this.emitter.emit(eventName, data);
// // 	}

// // 	// Методы для работы с DOM элементами

// // 	// Метод для переключения класса у указанного DOM элемента
// // 	toggleClass(element: HTMLElement, className: string, force?: boolean) {
// // 		element.classList.toggle(className, force);
// // 	}
// // 	// Метод для установки текстового содержимого указанному DOM элементу
// // 	protected setText(element: HTMLElement, value: unknown) {
// // 		if (element) {
// // 			element.textContent = String(value);
// // 		}
// // 	}
// // 	// Метод для установки статуса блокировки указанного DOM элемента
// // 	setDisabled(element: HTMLElement, state: boolean) {
// // 		if (element) {
// // 			if (state) element.setAttribute('disabled', 'disabled');
// // 			else element.removeAttribute('disabled');
// // 		}
// // 	}
// // 	// Метод для скрытия указанного DOM элемента
// // 	protected setHidden(element: HTMLElement) {
// // 		element.style.display = 'none';
// // 	}
// // 	// Метод для отображения указанного DOM элемента
// // 	protected setVisible(element: HTMLElement) {
// // 		element.style.removeProperty('display');
// // 	}
// // 	// Метод для установки изображения и альтернативного текста указанному DOM элементу
// // 	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
// // 		if (element) {
// // 			element.src = src;
// // 			if (alt) {
// // 				element.alt = alt;
// // 			}
// // 		}
// // 	}
// // 	// Метод для рендеринга компонента с возможностью передачи данных для обновления его состояния
// // 	render(data?: Partial<T>): HTMLElement {
// // 		// Обновляем свойства компонента данными из параметра data
// // 		Object.assign(this as object, data ?? {});
// // 		return this.container; // Возвращаем корневой DOM элемент компонента
// // 	}
// // }
