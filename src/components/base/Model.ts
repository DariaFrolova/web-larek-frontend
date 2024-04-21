// ВОЗМОЖНО НЕ НУЖНО

// // Импорт интерфейса IEvents из events
// import { IEvents } from "./events";

// // Гварда для проверки на модель
// // Функция проверки объекта на принадлежность к классу Model
// export const isModel = (obj: unknown): obj is Model<any> => {
//     // Проверка объекта на экземпляр класса Model
//     return obj instanceof Model;
// }

// // Объявление абстрактного класса Model с параметром типа T
// export abstract class Model<T> {
//     // Конструктор класса, принимающий частичные данные и объект events типа IEvents
//     constructor(data: Partial<T>, protected events: IEvents) {
//         // Присвоение данных объекту класса
//         Object.assign(this, data);
//     }

//     // Метод для инициирования изменений модели и оповещения об этом события
//     emitChanges(event: string, payload?: object) {
//         // Инициирование события с заданным именем и данными (по умолчанию передается пустой объект)
//         this.events.emit(event, payload ?? {});
//     }
// }
