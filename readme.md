# Исходный код сайта [forwardbar.ru](https://forwardbar.ru/)

Сборка деплой и обновление раздела меню через [travis-ci](https://travis-ci.org/mput/forwardbar)

[![Build Status](https://travis-ci.org/mput/forwardbar.svg?branch=master)](https://travis-ci.org/mput/forwardbar)

## Запустить локально
```
$ make start-local
```

## Раздел "Меню"
Основное меню формируется из файла [menu.yml](./views/data/menu.yml). Картинки, указанные в свойствах `img:` должны храниться в папке [./views/img/menu](./views/img/menu)


## Раздел "Бизнес ланч"
Меню бизнес ланча автоматически парсится из последнего документа в официальной группе [VK](https://vk.com/@lonestrikerbar). Попытка получения нового меню происходит при каждой сборке на travis-ci и по расписанию раз в сутки.
> Чтобы загрузить последнее ланч меню:
```
$ make load-menu
```