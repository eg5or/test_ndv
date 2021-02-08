import {config} from './config';

export const homepage = {
    init: function (){
        this.htmlContent() //загружаем HTML страницы
        const currentCurrency = document.getElementById('current-currency').options.selectedIndex // забираем значение select
        this.loadAllCurrencies() // загружаем в таблицу позиции без курса
        if (localStorage.dateRates) { // проверяем в Local Storage дату загрузки курсов
            const currentDate = new Date().toLocaleDateString('ru') // текущая дата
            if (localStorage.dateRates !== currentDate) { // если дата не совпадает
                this.requestRates() // загружаем новые данные с API
                console.log('Дата текущая не равно данным из Local Storage')
            } else {
                console.log('Данные из Local Storage')
                this.setRates(currentCurrency) // иначе выставляем курсы из Local Storage
            }
        } else {
            console.log('Загружаем новые данные с API')
            this.requestRates() // если даты в local storage нет то загружаем данные с API
        }
        const selectedCurrency = document.getElementById('current-currency')
        selectedCurrency.addEventListener('change', (e) => { // слушатель на изменение select
            this.setRates(selectedCurrency.options.selectedIndex)
        })

        this.sortItemsInTable() // сортируем таблицу
        this.loadFavoriteInSidebar() // загружаем избранное в сайдбар
        homepage.addListenerToTableBtns() // вешаем слушатели на изменение избранного
    },
    htmlContent: function () {
        document.querySelector('#page-content').innerHTML = `
        <div class="main">
                    <div class="title">
                        <h1>Текущие курсы</h1>
                        <div class="selected-currency">
                            <div class="selected-currency__label">Выберете валюту:</div>
                            <div class="selected-currency_input">
                                <form id="select-currency">
                                    <select id="current-currency" OnChange="getSelectedCurrency()">
                                        <option value="0">USD</option>
                                        <option value="1">RUB</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="table">
                        <table class="table-currencies">
                            <tr class="header-table">
                                <th>Валюта</th>
                                <th>Наименование</th>
                                <th>Курс</th>
                                <th>Добавить в избранное</th>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="sidebar">
                    <div class="favorite">
                        <div class="favorite__title"><h2>Избранное</h2></div>
                        <div class="favorite__content">
                            <div class="favorite__items">
                                <ul>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
    `
    },
    sortItemsInTable: function () {
        let tableCurrencies = document.querySelector('.table-currencies>tbody')
        if (localStorage.getItem('favorite')) {
            config.favoriteArr = JSON.parse(localStorage.favorite)
            config.currenciesList.map(currency => {
                if (config.favoriteArr.includes(currency.symbol)) {
                    document.querySelector(`.currency__${currency.symbol} .column-add-favorite`).innerHTML =
                        `<img class="add-favorite-icon" src="assets/icons/star_added.svg" alt="remove from favorite">`
                    tableCurrencies.prepend(document.querySelector(`.currency__${currency.symbol}`))
                    tableCurrencies.prepend(document.querySelector('.header-table'))
                } else {
                    document.querySelector(`.currency__${currency.symbol} .column-add-favorite`).innerHTML =
                        `<img class="add-favorite-icon" src="assets/icons/star.svg" alt="add to favorite">`
                    tableCurrencies.append(document.querySelector(`.currency__${currency.symbol}`))
                }
            })
        } else {
            config.currenciesList.map(currency => {
                document.querySelector(`.currency__${currency.symbol} .column-add-favorite`).innerHTML =
                    `<img class="add-favorite-icon" src="assets/icons/star.svg" alt="add to favorite">`
                tableCurrencies.append(document.querySelector(`.currency__${currency.symbol}`))
            })
        }
    },
    loadAllCurrencies: function () {
        let tableCurrencies = document.querySelector('.table-currencies>tbody')
        config.currenciesList.map(item => {
            let elem = document.createElement('tr')
            elem.classList.add(`currency__${item.symbol}`)
            elem.innerHTML = `
            <td class="column-symbol">${item.symbol}</td>
            <td class="column-name">${item.name}</td>
            <td class="column-rate">0</td>
            <td class="column-add-favorite"></td>
        `
            tableCurrencies.append(elem)
        })
        this.sortItemsInTable()
    },
    loadFavoriteInSidebar: function () {
        const favoriteBlock = document.querySelector('.favorite__items ul')
        favoriteBlock.innerHTML = ''
        config.favoriteArr.map(item => {
            let elem = document.createElement('li')
            elem.classList.add('favorite__item', `currency__${item}`)
            elem.innerHTML = `
            <div class="favorite__text">${item}</div>
            <div class="favorite__delete">
                <img src="assets/icons/cancel.svg" alt="delete">
            </div>
        `
            favoriteBlock.append(elem)
        })
        config.favoriteArr.map(item => {
            document.querySelector(`.currency__${item} > .favorite__delete`).addEventListener('click', () => {
                config.favoriteArr.includes(item) ? config.favoriteArr.splice(config.favoriteArr.indexOf(item), 1) : config.favoriteArr.push(item)
                localStorage.favorite = JSON.stringify(config.favoriteArr)
                this.sortItemsInTable()
                this.loadFavoriteInSidebar()
            })
        })
    },
    addListenerToTableBtns: function () {
        config.currenciesList.map(item => {
            document.querySelector(`.currency__${item.symbol} > .column-add-favorite`).addEventListener('click', () => {
                config.favoriteArr.includes(item.symbol) ? config.favoriteArr.splice(config.favoriteArr.indexOf(item.symbol), 1) : config.favoriteArr.push(item.symbol)
                localStorage.favorite = JSON.stringify(config.favoriteArr)
                this.sortItemsInTable()
                this.loadFavoriteInSidebar()
            })
        })
    },
    requestRates: function () {
        const currentCurrency = document.getElementById('current-currency').options.selectedIndex
        const API_KEY = 'ef0dc2622eaa496c61c71598fb31a605'
        const request = new XMLHttpRequest()
        let currenciesArray = []
        config.currenciesList.map(item => currenciesArray.push(item.symbol))
        request.open('GET', `http://api.currencylayer.com/live?access_key=${API_KEY}&currencies=${[...currenciesArray]}&format=1`)
        request.send()
        request.addEventListener('readystatechange', (event) => {
            if (request.readyState === 4 && request.status === 200) {
                const data = JSON.parse(request.responseText)
                Object.entries(data.quotes).map(item => {
                    localStorage.setItem(`${item[0]}`, `${item[1]}`)
                })
                localStorage.dateRates = new Date(data.timestamp * 1000).toLocaleDateString('ru')
                this.setRates(currentCurrency)
            }
        }, false)
    },
    setRates: function (index) {
        switch (index) {
            case 0:
                config.currenciesList.map(item => {
                    let rate = 1 / Number(localStorage.getItem(`USD${item.symbol}`))
                    document.querySelector(`.currency__${item.symbol} > .column-rate`).innerHTML = `$ ${rate.toLocaleString('en-EN', {maximumFractionDigits: 2})}`
                })
                break
            case 1:
                const rateUSDRUB = localStorage.getItem('USDRUB')
                config.currenciesList.map(item => {
                    let rate = 1 / Number(localStorage.getItem(`USD${item.symbol}`)) * rateUSDRUB
                    console.log(document.querySelector(`.currency__${item.symbol} > .column-rate`))
                    document.querySelector(`.currency__${item.symbol} > .column-rate`).innerHTML = `${rate.toLocaleString('ru-RU', {maximumFractionDigits: 2})} руб.`
                })
                break
            default:
                break
        }
    }
}