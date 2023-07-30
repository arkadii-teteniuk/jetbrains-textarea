- [Определение требований](#определение-требований)
- [Постановка задачи](#постановка-задачи)
- [Уточнение требований, оценка](#уточнение-требований,-оценка)
- [Декомпозиция](#декомпозиция)
- [Результаты](#результаты)
- [Что бы я улучшил](#что-бы-я-улучшил)
- [Что удалось улучшить](#что-удалось-улучшить)

## Определение требований
Сперва я ознакомился с требованиями, открыл первый попавшийся браузер, внимательно посмотрел на то, как работает поиск. 
![Поиск в браузере](assets/Pasted%20image%2020230729131541.png)
Затем обозначил для себя элементы и функционал, которые необходимо реализовать:

* Основные элементы:
	* Поле поиска для ввода значения.
	* Стрелки для навигации между найденными значениями.
	* Крестик для завершения поиска.
* Функционал:
	* При каждом изменении этого значения должны подсвечиваться найденные результаты, а также обновляться счётчик количества результатов (в формате "текущий выбранный элемент / общее количество найденных вхождений").  
	* В случае, если текущий Viewport не содержит ни одного результата, страница должна скроллиться до первого найденного совпадения.
	* При нажатии на Enter должен происходить переход к следующему найденному значению. При этом оно должно подсвечиваться иначе (оранжевым цветом).  Индекс выбранного элемента должен увеличиваться на 1 в случае, если не достигнуто конечное значение.
	* При нажатии на стрелки должен происходить переход между найденными значениями.
	* При нажатии на крестик должно очиститься поле поиска, исчезнуть подсветка и закрыться сам поисковый контрол.
	* При наведении на каждый контрол должен отображаться его `title`.
	* (Accessibility) Должна быть реализована возможность перехода из поля поиска на навигационную стрелку и последующие контролы при нажатии на Tab. *Примечательно что табуляция в Хроме (Version 114.0.5735.198, Official Build, arm64) по контролам работает, но при нажатии Enter никакой реакции нет, на самом деле, выглядит как баг.
	* Встроенный поиск должен быть регистронезависимым, но в ТЗ явно указано что решение должно быть case-sensitive.

## Постановка задачи

Определив основные требования, я приступил к декомпозиции задачи:
- Реализовать поиск подстроки.
- Разработать механизм подсветки найденных значений.
- Привязать логику к интерфейсу, заложить места под оптимизацию.
- Обеспечить навигацию (нажатие на Enter, стрелки, сброс и счётчик).
- Настроить сборку и условия для разработки (Vite).
- Включить системы контроля качества кода и форматирования (ESLint + Prettier).
- Развернуть проект (GitHub, CI/CD, Deploy, GH-pages).
- Написать Unit-тесты (Jest).
- Добавить E2E-тесты (Playwright).
- Обратить внимание на edge-cases.
- Сделать ревью, определить слабые места, оптимизировать. Повторить п.11 при необходимости.

## Уточнение требований, оценка

Моя первоначальная оценка выглядела так:
- Implement the general solution – 2-4h.
- Set the project up – 1h.
- Write and run tests – 2-4h.
- Set up virtual machines and environments to test on a different GUI/OS: MacOS, Windows, Linux Gnome, etc. I know that scrollbars have various sizes on different platforms. It could affect the solution. Up to 8h.
- Clean all the code up – 2-4h.

Так сложилось, что до наступления выходных я не успел глубоко погрузиться в задачу и некоторые вопросы, которые непосредственно влияли на конечное решение, возникли у меня уже в выходной день. В частности, вопрос касался обработки поведения `<input type="text">`. Но так как я сам, по собственной инициативе, обозначил срок сдачи в понедельник, и не мог уточнить требования к задаче, я решил неоднозначность переключателем `multiline` (своеобразный feature-flag). Подробности есть в разделе [Что бы я улучшил](#Что-бы-я-улучшил).

## Декомпозиция
Прежде чем приступить к задаче, имеет смысл разделить её на какие-то конечные семантические блоки. Я разделил так:

#### Поиск подстроки

C поиском вхождений всё вроде как понятно:
```typescript
const findAll = (str: string, findStr: string): number[] => {  
  const results: number[] = [];  
  let i = 0;  
  
  if (!str.length || !findStr.length || str.length < findStr.length) {  
    return [];  
  }  
  
  while (i < str.length) {  
    if (str[i] === findStr[0]) {  
      let matched = true;  
      const startPos = i;  
  
      for (let j = 0; j < findStr.length; j++, i++) {  
        if (str[i] !== findStr[j]) {  
          matched = false;  
          break;  
        }  
      }  
  
      if (matched) {  
        results.push(startPos);  
      }  
    } else {  
      i++;  
    }  
  }  
  
  return results;  
};
```

#### Подсветка 
C подсветкой несколько сложнее:
- Мы не можем как-либо модифицировать содержимое textarea.
- Таким образом, надо сделать какой-то такой элемент, который будет полностью  совпадать с textarea при наложении.
- Важно соблюсти геометрию textarea и backdrop. Убедиться в соответствии padding, overflow, в том, что блоки совпадают при наложении друг на друга. Должны быть одинаковые шрифты (размеры, интервалы), поведение при разрыве строки (word-break);
- Блок с подсветкой должен лежать в контейнере, размеры которого регулируются textarea (input resize).
- Для достижения высокого уровня быстродействия нужно максимум вычислений переложить на CSS.
- Выключить все обработчики (pointer-events) для backdrop, чтобы при его отображении поверх textarea пользователь не лишился базового функционала.

#### Интерактивность
Основные моменты:
- Подсветка должна обновляться при изменении значений в полях `search` и `editor`.
- Изменение размеров editor должно обновлять `scrollPosition` у `backdrop`.
- При создании интерфейсов важно учесть следующие данные:
	- Средняя скорость печати 185-220 знаков в минуту (3 в секунду).
	- Для достижении плавности интерфейса нужно обновлять не реже 16,6мс.
	- Люди часто не замечают задержек до 200мс (правильнее же эту цифру получить в зависимости и назначения и позиционирования продукта, от требований к системе – от product-менеджера).
- Соответственно, все обработчики (изменение текста или строки поиска) необходимо обернуть в throttle (с `trailing`) для минимизации рендеринга промежуточных результатов. Также нужно выбрать длительность задержки (изначально я задал 200мс). 
- Есть некоторая вероятность, что в процессе ввода в строку поиска значения могут повторяться: `s - se - sea - seac - sea - sear - ...`, соответственно имеет смысл кешировать результаты поиска. Все результаты поиска кешируются и хранятся пока `editor` остается неизменным. Вероятно, это нецелесообразно (потеря памяти более существенна, чем прирост производительности), можно обсудить с product-менеджером.

#### Тестирование
Сперва весь базовый функционал необходимо покрыть Unit-тестами, позже написать e2e тесты. В данном случае, нужно сравнивать скриншоты, считать количество найденных вхождений (общее и видимое) и сравнивать с эталонными данными.

## Результаты
Ниже приведены результаты, которые я отправлял на проверку.

```
I would like to share the results ([https://github.com/arkadii-teteniuk/jetbrains-textarea](https://github.com/arkadii-teteniuk/jetbrains-textarea)).

Demo is here – [https://arkadii-teteniuk.github.io/jetbrains-textarea/](https://arkadii-teteniuk.github.io/jetbrains-textarea/).    
  
1. Created a GitHub repository.  
2. Vite used for building.  
3. Added ESLint & Prettier code quality tools.  
4. Implemented a search similar to a browser search (scroll and resize handled).  
5. Implemented unit tests (Jest).  
6. Included and integrated e2e tests (Playwright).  
7. Published via GitHub Pages.  
  
The native browser (Google Chrome) implementation has the following features:  
1. It allows \n characters.  
2. It navigates to the next found entity on Enter.  
3. It always stays one-line.  
  
Manipulation with the newline characters is a little bit tricky in the standard input. It does not allow newlines, it trims them. However, we can use a textarea instead. In this case, we can paste the newline characters without any problem and use them as a pattern for searching. But in that case, we need to handle navigation (by pressing Enter) in a different way. It's not only about the technical part; it's also about user experience and design.  
All these decisions lead to a conversation with the task-holder. And now, from my perspective, I can say that it was a mistake to state Monday as the deadline. :-)
Also, I was wrong when specifying the estimation. In general, all the points were set okay, but I missed a bunch of things like performance optimization, hosting, and a few unexpected scenarios during testing.  
As a result, I implemented basic functionality and added a control to switch between textarea and input. The textarea allows matching strings with included newlines, while the input only supports essential search functionality.  
  
Moreover, the basic functionality was enhanced by applying the following practices:  
1. Throttling event listeners (with trailing).  
2. Caching search data.  
  
I can see a few perspectives to enhance the solution:  
1. Improve navigation. Maybe add arrows like the browser (or IDE) has.  
2. Increase test coverage.

3. Rebuild CI/CD process.  
4. The existing solution has been tested on my laptop with a 135,000,000 symbol text. It's usable, but resize events make me worry about the performance. Let's consider that an A4 page contains 1,860 symbols. Then the text size is approximately 72,580 pages. It could be faster by applying virtualization for the textarea and backdrop list, depending on the task.  
  
By the way, I would really appreciate any feedback on that. Please let me know everything you will find. I'd like to use it as an experience. :-)
  
The list of tested systems:  
MacOS Ventura (v13.4, arm64):    
* Google Chrome 114.0.5735.198    
* Firefox 109.0    
* Safari 16.5 (18615.2.9.11.4)    
* Vivaldi 5.7.2921.60    
* Opera 76.0.4017.123    
   
iOS (v16.5.1)    
* Safari v16.5    
* Google Chrome 114.0.5735.124    
   
Windows 11 (v22621.1702, arm64):    
* Microsoft Edge 114.0.1823.82    
* Google Chrome 114.0.5735.198  
* Firefox 115.0.2    
* Vivaldi 6.1.3035.111
  
Ubuntu:  
* Google Chrome  
* Firefox
```
## Что бы я улучшил
Существующее решение можно улучшить, вот что мне хотелось бы отметить:
- (сделано) Убрать workaround с расчетом ширины скроллбара. Выставить у `backdrop` и `editor` в соответствие `overflow` и `padding`. Всё будет работать из коробки.
- (сделано) Безопасность. Я совершил ошибку (привычка что Реакт делает всё сам) и не экранировал вводимые пользователем данные. Таким образом, можно было ввести в инпуты нечто вроде `<script>alert(123)</script>`, что, в свою очередь, напрямую вставлялось (и парсилось) как html в `backdrop`. Более того, это ломало сам поиск. Замена `<` на `&lt;` решает проблему.
- Производительность. На мой взгляд, заниматься этим будет целесообразно только в случае, если предполагается постоянная работа над большими объёмами данных. На моём устройстве 64Кб данных в `editor` с 1156 результатами поиска работает удовлетворительно. Тем не менее, ускорить можно так:
	- Виртуализация. 
		- Сама `textarea` на больших данных работает не слишком быстро. При высоких требованиях к производительности можно написать альтерантивный контрол со встроенной виртуализацией.
		- С `backdrop` можно сделать то же самое.
	- Дробление обработчика input на составляющие и тюнинг throttling delay.
	- На ресайз уже есть throttling. Можно дополнительно исключить промежуточные рендеры:
		- Сделать ghost (добавить специальный блок, меняя его размеры в динамике; на mouseup уже обновить размер `editor`).
		- Либо на начало ресайза скрывать backdrop и не обновлять его пока ресайз не закончится. 
- (сделано функционально, не стилистически) UX. Сейчас в решении присутствует костыль в виде свитча `multiline`. Я не мог уточнить требования к задаче, поэтому решил неоднозначность переключателем (своеобразный feature-flag). Как я уже упоминал ранее, технически это решение обосновано поведением `<input type="text">` ([спецификация](https://html.spec.whatwg.org/multipage/input.html#text-(type=text)-state-and-search-state-(type=search))). ![Спецификация](assets/Pasted%20image%2020230729130250.png)При попадании в `input` убираются некоторые специальные символы, в том числе и символ переноса строки. В случае если мы вставляем текст в `editor`, копируем некоторую его часть с символами переноса строки, вставляем её в `search`, то используемый алгоритм поиска значение не найдёт: `text\ntext` при попадании в `input` превратится в `texttext`. Решить эту проблему можно следующим образом:
	 - **Способ 1**. Использовать `textarea` вместо `input`. Тогда поведение будет максимально близким к браузерному, разве что обработать нажатие Enter для перехода к следующему найденному элементу нужно будет отдельно, а ввод переноса строки сделать доступным по `Shift+Enter`, например. Или специальной кнопкой (как реализовано в том же WebStorm).
	 - **Способ 2**. На первый взгляд выглядит гораздо сложнее и потребуется получение прав на доступ к `Clipboard`. Насколько мне известно, в `<input type="text">` ввести символ переноса строки так просто не получится, только copy-paste. Тогда мы можем следить за `paste`, сохранять куда-то изначальное значение со всеми переносами строк, а изменения, которые пользователь будет производить надо блоком search транслировать атомарно в искомую последовательность.
- (сделано) UX. В изначальном решении не было представлено полноценной навигации.
- (сделано) Функционал. Я бы добавил сюда поддержку регулярных выражений (как сделано в IDE).![WebStorm](assets/Pasted%20image%2020230729130716.png)
- Тестирование. Что касается тестов, то увеличить покрытие, увеличить их количество и расширить список проверяемых браузеров и платформ. 
- Есть баг при значениях `textarea` длиной выше 65535 (связано это с максимальным размером html-node).
- Можно доработать работу с кешем. Сейчас троттлится сам обработчик, но в случае, если результат закеширован, то его можно было бы взять в обход троттлинга.

### Что удалось улучшить
Пункты 1, 2, 4, 5, 6 из предложенных самому себе доработок я взял в работу:
- исправил баг с вставкой тегов в HTML (`<script>...</script>` как пример).
- убрал workaround для получения размера scrollbar.
- убрал multiline-переключатель, сделал на основе `textarea` (способ 1).
- добавил навигацию (вперед, назад, сброс, подсветка конкретного результата). !
- добавил работу с регулярными выражениями. 

Конечный результат:

![Финальная версия](assets/Pasted%20image%2020230730151707.png)
