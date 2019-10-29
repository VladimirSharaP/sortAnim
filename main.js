class SortAnimation {
    constructor() {
        this.i = 0; //ндекс в массиве
        this.swapped = true; //была перестановка значений
        this.sortArray = []; //сортируемый массив
        this.isPaint = false; //массив отрисован
        this.isReset = false; //произошел сброс
        this.speedAnim = 1.0; //скорость анимации
    }

    // один шаг сортировки
    sortIteration() {
        if (this.i < this.sortArray.length - 1) {
            let element = document.getElementById(this.i);
            let element2 = document.getElementById(this.i + 1);
            if (parseFloat(this.sortArray[this.i]) > parseFloat(this.sortArray[this.i + 1])) {
                let temp = this.sortArray[this.i];
                this.sortArray[this.i] = this.sortArray[this.i + 1];
                this.sortArray[this.i + 1] = temp;
                this.swapped = true;
                this.animationMoveUp(element, element2, "goLeft");
                this.animationMoveUp(element2, element, "goRight");
                element.id = this.i + 1;
                element2.id = this.i;
                this.i++;
            } else {
                this.animationMoveUp(element, element2, "goBack");
                this.i++;
            }
        } else {
            this.sortLoop();
        }
    }

    // запускает проход по массиву
    sortLoop() {
        if (this.swapped) {
            this.i = 0;
            this.swapped = false;
            this.sortIteration();
        } else {
            this.swapped = true;
            this.onBtn();
        }
    }

    startSort() {
        this.isReset = false;
        if (this.isPaint) {
            this.offBtn();
            this.sortLoop();
        } else {
            alert("Ошибка выполнения.");
        }
    }

    //отключить кнопки
    onBtn() {
        document.getElementById('start_btn').removeAttribute('disabled');
        document.getElementById('paint_btn').removeAttribute('disabled');
        document.getElementById('generate_btn').removeAttribute('disabled');
    }

    //включить кнопки
    offBtn() {
        document.getElementById('start_btn').setAttribute("disabled", "disabled");
        document.getElementById('paint_btn').setAttribute("disabled", "disabled");
        document.getElementById('generate_btn').setAttribute("disabled", "disabled");
    }

    //  непосредственно отрисовывает анимацию
    animate(self, speedAnim, draw, duration, typeAnimation, elem, elem2) {
        let start = performance.now();
        start += (500 / speedAnim);
        requestAnimationFrame(function animate(time) {
            if (self.isReset) {
                return;
            }
            // определить, сколько прошло времени с начала анимации
            let timePassed = time - start;

            //первым фреймом получается отрицательное значение, что приводит к подёргиванию движения
            if (timePassed < 0)
                timePassed = 0;

            // возможно небольшое превышение времени, в этом случае зафиксировать конец
            if (timePassed > duration) timePassed = duration;
            // нарисовать состояние анимации в момент timePassed
            draw(timePassed, speedAnim);

            // если время анимации не закончилось - запланировать ещё кадр
            if (timePassed < duration) {
                requestAnimationFrame(animate);
            } else {
                if (typeAnimation !== undefined) {
                    switch (typeAnimation) {
                        case 'goLeft':
                            self.animationMoveLeft(elem, elem2, 'goBack');
                            break;
                        case 'goRight':
                            self.animationMoveRight(elem, elem2);
                            break;
                        case 'goBack':
                            self.animationMoveDown(elem, elem2, 'selectItems');
                            break;
                        case 'selectItems':
                            elem.style.background = "#e9ecef";
                            elem2.style.background = "#e9ecef";
                            elem.style.borderColor = "#b7bbbf";
                            elem2.style.borderColor = "#b7bbbf";
                            self.sortIteration();
                            break;
                    }
                }
            }
        });
    }

    //  перемещает элемент вверх
    animationMoveUp(elem, elem2, nextAnimation) {
        elem.style.background = "#c3d4e4";
        elem.style.borderColor = "#7e9dbb";
        let rectPosition = elem.getBoundingClientRect();
        let topPosition = rectPosition.top;
        switch (nextAnimation) {
            case "goLeft":
                this.animate(this, this.speedAnim, function(timePassed, speedAnim) {
                    timePassed *= speedAnim;
                    elem.style.top = ((topPosition - timePassed / 5) + 'px');
                }, 500 / this.speedAnim, nextAnimation, elem, elem2);
                break;
            case "goRight":
                this.animate(this, this.speedAnim, function(timePassed, speedAnim) {
                    timePassed *= speedAnim;
                    elem.style.top = ((topPosition - timePassed / 5) + 'px');
                }, 500 / this.speedAnim, nextAnimation, elem, elem2);
                break;
            case "goBack":
                this.animate(this, this.speedAnim, function(timePassed, speedAnim) {
                    timePassed *= speedAnim;
                    elem.style.top = ((topPosition - timePassed / 5) + 'px');
                    elem2.style.top = ((topPosition - timePassed / 5) + 'px');
                    elem2.style.background = "#c3d4e4";
                    elem2.style.borderColor = "#7e9dbb";
                }, 500 / this.speedAnim, nextAnimation, elem, elem2);
                break;
        }
    }

    //  перемещает элемент вниз
    animationMoveDown(elem, elem2, nextAnimation) {
        let rectPosition = elem.getBoundingClientRect();
        let topPosition = rectPosition.top;
        this.animate(this, this.speedAnim, function(timePassed, speedAnim) {
            timePassed *= speedAnim;
            elem.style.top = ((topPosition + timePassed / 5) + 'px');
            elem2.style.top = ((topPosition + timePassed / 5) + 'px');
        }, 500 / this.speedAnim, nextAnimation, elem, elem2);
    }

    //  перемещает элемент вправо. перемещение элемента происходит по кривой Безье
    animationMoveRight(elem, elem2) {
        let rectPositionElem = elem.getBoundingClientRect();
        let rectPositionElem2 = elem2.getBoundingClientRect();
        this.animate(this, this.speedAnim, function(timePassed, speedAnim) {
            timePassed *= 2 * speedAnim;
            elem.style.left = (Math.pow((1 - (timePassed / 1000)), 3) * rectPositionElem.left) +
                (3 * Math.pow((1 - (timePassed / 1000)), 2) * (timePassed / 1000) * (rectPositionElem2.left + 10)) +
                (3 * (1 - (timePassed / 1000)) * Math.pow((timePassed / 1000), 2) * (rectPositionElem2.left + 18)) +
                (Math.pow((timePassed / 1000), 3) * rectPositionElem2.left) + 'px';
            elem.style.top = (Math.pow((1 - (timePassed / 1000)), 3) * rectPositionElem.top) +
                (3 * Math.pow((1 - (timePassed / 1000)), 2) * (timePassed / 1000) * (rectPositionElem.top - 23)) +
                (3 * (1 - (timePassed / 1000)) * Math.pow((timePassed / 1000), 2) * (rectPositionElem.top - 23)) +
                (Math.pow((timePassed / 1000), 3) * rectPositionElem.top) + 'px';
        }, 500 / this.speedAnim);
    }

    // перемещает элемент влево. перемещение элемента происходит  по кривой Безье
    animationMoveLeft(elem, elem2, nextAnimation) {
        let rectPositionElem = elem.getBoundingClientRect();
        let rectPositionElem2 = elem2.getBoundingClientRect();
        this.animate(this, this.speedAnim, function(timePassed, speedAnim) {
            timePassed *= 2 * speedAnim;
            elem.style.left = (Math.pow((1 - (timePassed / 1000)), 3) * rectPositionElem.left) +
                (3 * Math.pow((1 - (timePassed / 1000)), 2) * (timePassed / 1000) * (rectPositionElem2.left - 23)) +
                (3 * (1 - (timePassed / 1000)) * Math.pow((timePassed / 1000), 2) * (rectPositionElem2.left - 23)) +
                (Math.pow((timePassed / 1000), 3) * rectPositionElem2.left) + 'px';
            elem.style.top = (Math.pow((1 - (timePassed / 1000)), 3) * rectPositionElem.top) +
                (3 * Math.pow((1 - (timePassed / 1000)), 2) * (timePassed / 1000) * (rectPositionElem.top + 23)) +
                (3 * (1 - (timePassed / 1000)) * Math.pow((timePassed / 1000), 2) * (rectPositionElem.top + 23)) +
                (Math.pow((timePassed / 1000), 3) * rectPositionElem.top) + 'px';
        }, 500 / this.speedAnim, nextAnimation, elem, elem2);
    }

    // рисует массив на странице
    displayArray() {
        let fieldAnimation = document.getElementById('fieldAnimation'),
            leftPosition = 50,
            stringArray = document.getElementById("inputArray").value,
            isCorrect = true;
        stringArray = stringArray.replace(/\s+/g, '');
        this.sortArray = stringArray.split(',');
        fieldAnimation.innerHTML = '<div id="arrayContainer"></div>';
        let arrayContainer = document.getElementById('arrayContainer');

        // отбираем только те эелементы массива, которые являются целыми числами (<10000) и
        // числа с плавающей запятой (не более одного знака после запятой).
        // такое ограничение сделано в угоду красоте :) (другой вариант  уменьшать размер шрифта)
        this.sortArray = this.sortArray.filter(function(number) {
            if (/^[0-9]{1,4}$/.test(number) || /^[0-9]{1,4}[.][0-9]{1}$/.test(number))
                return number;
            else isCorrect = false;
        });

        if (isCorrect) {

            for (let i = 0; i < this.sortArray.length; i++) {
                arrayContainer.innerHTML = '<div style="left: ' + leftPosition + 'px" class="numberContainer" id=' + i + '>' + this.sortArray[i] + '</div>' + arrayContainer.innerHTML;
                arrayContainer.innerHTML = '<div style="left: ' + leftPosition + 'px; top:400px" class="numberContainer">' + this.sortArray[i] + '</div>' + arrayContainer.innerHTML;

                leftPosition += 65;
            }
            arrayContainer.innerHTML = '<div style="position: absolute;left: 50px; top:371px; width: 150px">Исходный массив:</div>' + arrayContainer.innerHTML;

            this.isPaint = true;
        } else {
            this.sortArray = "";
            alert("Ошибка ввода данных. \nВведеное число должно быть <10000 и иметь не более одного знака после запятой.")
        }
    }

    // случайно генерирует массив
    generateArray() {
        let inputArray = document.getElementById("inputArray");
        inputArray.value = "";
        this.sortArray = [];
        for (let i = 0; i < 10; i++) {
            this.sortArray.push(this.getRandomInt(0, 10000));
            inputArray.value += this.sortArray[i] + ',';
        }
        inputArray.value = inputArray.value.substr(0, inputArray.value.length - 1);
        this.displayArray();
    }

    // генерирует целое число в диапозоне
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //удаляет массив со страницы, обнуляет переменные,включает кнопки
    reset() {
        this.sortArray = [];
        let fieldAnimation = document.getElementById('fieldAnimation');
        fieldAnimation.innerHTML = '<div id="arrayContainer"></div>';
        this.swapped = true;
        this.isPaint = false;
        this.i = 0;
        this.isReset = true;
        this.onBtn();
    }


}

let sortInstance = new SortAnimation();

document.addEventListener('DOMContentLoaded', function() {
    let activities = document.getElementById("speedAnimation");
    activities.addEventListener("change", function() {
        switch (activities.selectedIndex) {
            case 0:
                sortInstance.speedAnim = 1;
                break;
            case 1:
                sortInstance.speedAnim = 1.5;
                break;
            case 2:
                sortInstance.speedAnim = 2;
                break;
            case 3:
                sortInstance.speedAnim = 3;
                break;
        }
    });
});