import {config} from './config';

export const converterPage = {
    init: function (){
        this.htmlContent()
        const selectFirst = document.querySelector('#select-value-first')
        const selectSecond = document.querySelector('#select-value-second')
        this.loadAllCurrenciesToSelect(selectFirst)
        this.loadAllCurrenciesToSelect(selectSecond)
        this.insertNameInTitleFromSelect(selectFirst, 'first-value')
        this.insertNameInTitleFromSelect(selectSecond, 'second-value')
        this.addEventListenerToChangeSelect()
        const inputFirst = document.querySelector('#first-input>input')
        const inputSecond = document.querySelector('#second-input>input')
        this.convertCurrencies(selectFirst, selectSecond, inputFirst, inputSecond, 'lr')
        selectFirst.addEventListener('change', () => this.convertCurrencies(selectFirst, selectSecond, inputFirst, inputSecond, 'lr'))
        selectSecond.addEventListener('change', () => this.convertCurrencies(selectFirst, selectSecond, inputFirst, inputSecond, 'lr'))
        inputFirst.addEventListener('input', () => this.convertCurrencies(selectFirst, selectSecond, inputFirst, inputSecond, 'lr'))
        inputSecond.addEventListener('input', () => this.convertCurrencies(selectFirst, selectSecond, inputFirst, inputSecond, 'rl'))
    },
    htmlContent: function () {
        document.querySelector('#page-content').innerHTML = `
        <div class="main">
                    <div class="title">
                        <h1>Конвертация валют</h1>
                    </div>
                    <div class="converter">
                        <div class="converter__title">Конвертируем</div>
                        <form class="form-converter">
                            <div class="form-converter__block first-value">
                                <div class="form-converter__title"></div>
                                <div class="form-converter__container">
                                    <div class="form-converter__select"><select  name="select-value-first" id="select-value-first">
                                        <option value="0">USD</option>
                                        <option value="1">RUB</option>
                                        <option value="2">EUR</option>
                                        <option value="3">GBP</option>
                                        <option value="4">BTC</option>
                                    </select></div>
                                    <div class="form-converter__input" id="first-input"><input type="text" name="input-value-first" value="1"></div>
                                </div>
                            </div>
                            <div class="form-converter__block separator">
                                <div class="icon-separator"></div>
                            </div>
                            <div class="form-converter__block second-value">
                                <div class="form-converter__title"></div>
                                <div class="form-converter__container">
                                    <div class="form-converter__select"><select name="select-value-second" id="select-value-second">
                                        <option value="0">USD</option>
                                        <option value="1">RUB</option>
                                        <option value="2">EUR</option>
                                        <option value="3">GBP</option>
                                        <option value="4">BTC</option>
                                    </select></div>
                                    <div class="form-converter__input" id="second-input"><input type="text" name="input-value-second"></div>
                                </div>
                            </div>
                            
                            
                           
                           
                        </form>
                    </div>
                </div>
  
    `
    },
    addEventListenerToChangeSelect: function (){
        const selectFirst = document.querySelector('#select-value-first')
        const selectSecond = document.querySelector('#select-value-second')
        selectFirst.addEventListener('change', () => {
            this.insertNameInTitleFromSelect(selectFirst, 'first-value')
        })
        selectSecond.addEventListener('change', () => {
            this.insertNameInTitleFromSelect(selectSecond, 'second-value')
        })
    },
    insertNameInTitleFromSelect: function (element, whatClass){
        config.currenciesList.map(item => {
            if(item.symbol === element.options[element.options.selectedIndex].text) {
                document.querySelector(`.${whatClass}>.form-converter__title`).innerHTML = `${item.name}`
            }
        })
    },
    loadAllCurrenciesToSelect: function (element){
        let counter = 0
        config.currenciesList.map(item => {
            counter++
            let newElem = document.createElement('option')
            newElem.setAttribute('value', `${counter}`)
            newElem.innerHTML = `${item.symbol}`
            element.append(newElem)
        })
    },
    convertCurrencies: function (selectFirst, selectSecond, inputFirst, inputSecond, direction){
        const firstCurrency = selectFirst.options[selectFirst.options.selectedIndex].text
        const secondCurrency = selectSecond.options[selectSecond.options.selectedIndex].text
        let firstValue = +inputFirst.value.replace(/,/, '.')
        let secondValue = +inputSecond.value.replace(/,/, '.')
        const firstCurrencyRateToUSD = +localStorage.getItem(`USD${firstCurrency}`)
        const secondCurrencyRateToUSD = +localStorage.getItem(`USD${secondCurrency}`)
        switch (direction){
            case 'lr':
                let secondValueResult = (secondCurrencyRateToUSD / firstCurrencyRateToUSD) * firstValue
                inputSecond.value = secondValueResult.toLocaleString('ru-RU', {maximumFractionDigits: 8})
                break
            case 'rl':
                let firstValueResult = (secondCurrencyRateToUSD / firstCurrencyRateToUSD) * secondValue
                inputFirst.value = firstValueResult.toLocaleString('ru-RU', {maximumFractionDigits: 8})
                console.log('kkk')
                break
            default:
                break
        }
    }
}