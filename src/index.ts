//  Это основной файл, который связывает все компоненты вместе и определяет логику работы приложения.
// В нем устанавливаются обработчики событий, вызываются методы из других файлов для обновления данных и отображения информации на странице.

import './scss/styles.scss';

import { API_URL, CDN_URL, settings } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Model } from './components/base/Model';
import { Component } from './components/base/Component';

