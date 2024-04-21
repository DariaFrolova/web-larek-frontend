//  Это основной файл, который связывает все компоненты вместе и определяет логику работы приложения.
// В нем устанавливаются обработчики событий, вызываются методы из других файлов для обновления данных и отображения информации на странице.

import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
// import { AppState } from './components/AppData';
// import { Model } from './components/base/model';

const api = new WebLarekApi (CDN_URL, API_URL);

   

