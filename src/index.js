import './styles/main.css'
import cancel from './assets/icons/cancel.svg'
import converter from './assets/icons/converter.svg'
import home from './assets/icons/home.svg'
import star from './assets/icons/star.svg'
import star_added from './assets/icons/star_added.svg'
import logo from './assets/img/logo.png'
import {Favorite} from './favorite';
import {homepage} from './homepage'
import {converterPage} from './converter'

homepage.init()
const locationResolver = (location) => {
    switch (location) {
        case '#/':
            homepage.init()
            break
        case '#/converter':
            converterPage.init()
            break
        default:
            break
    }
}

window.addEventListener('load', function (){
    const location = window.location.hash
    console.log(location)
    if (location) {
        locationResolver(location)
    }
})

const linkHomepage = document.querySelector('#link-homepage')
const linkConverter = document.querySelector('#link-converter')
linkHomepage.addEventListener('click', () => {
    locationResolver('#/')
})
linkConverter.addEventListener('click', () => {
    locationResolver('#/converter')
})











