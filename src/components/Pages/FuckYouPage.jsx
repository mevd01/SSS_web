import React from "react";
import classes from '../../css/faq.css'

import FaQItem from "../Parts/StackItems/FaQItem";

function FuckQPage(){
    return(
        <div className="faq_part">
            <h1>FAQ</h1>
            <FaQItem id={'it1'} img1={'faq_0_0.jpg'} img2={'faq_0_1.jpg'} name={'Как подобрать размер?'}>
                Проще всего измерить свою стопу от пятки до самой длинной точки носка в сантиметрах, а дальше сверить с таблицей размеров для компании обуви.
            </FaQItem>
            <FaQItem id={'it2'} img1={'faq_1_0.jpg'} img2={'faq_1_1.jpg'} name={'Можно ли вернуть товар если я передумал или не подошел размер?'}>
                Нет, возврат не применим к данным случаям. Ответственность за выбор размера лежит на клиенте, а наш менеджер с радостью поможет вам его подобрать. Возврат можно совершить, если товар пришел бракованный или неоригинальный.
            </FaQItem>
            <FaQItem id={'it3'} img1={'faq_2_0.jpg'} img2={'faq_2_1.jpg'} name={'Какой курс?'}>
                Курс вы можете узнать по кнопке «Актуальный курс» в главном меню нашего бота.
            </FaQItem>
            <FaQItem id={'it4'} img1={'faq_3_0.jpg'} img2={'faq_3_1.jpg'} name={'Дешевле ли заказать несколько вещей сразу?'}>
                Да, на каждую следующую вещь скидка 10% на наши услуги при заказе тарифом «Полная предоплата». (От большей к меньшей стоимости)
            </FaQItem>
            <FaQItem id={'it5'} img1={'faq_4_0.jpg'} img2={'faq_4_1.jpg'} name={'Деньги за реферальную систему – это баллы?'}>
                <p>
                Нет, это реальные деньги, мы просто переведем 500 рублей на ваш счет💵
                </p>
                <p>
                Как болучить бонус?
                Посоветуйте наш магазин другу. Когда ваш друг сделает заказ, вы получите на свою карту целых 500 рублей 💰, в качестве благодарности от нас за вашу рекомендацию!
                </p>
                <p>
                ❗️Важно, чтобы ваш друг сам написал нам, что делает заказ по вашей рекомендации❗️
                </p>
            </FaQItem>
            <FaQItem id={'it6'} img1={'faq_5_0.jpg'} img2={'faq_5_1.jpg'} name={'Сколько стоит доставка и ваша комиссия?'}>
                Вы можете воспользоваться калькулятором, при помощи нашего бота в Телеграмм.
            </FaQItem>
            <FaQItem id={'it7'} img1={'faq_6_0.jpg'} img2={'faq_6_1.jpg'} name={'Включена ли доставка до региона в конечную стоимость?'}>
                Нет, стоимость доставки рассчитана до Москвы, в регионы пересылка оплачивается отдельно.
            </FaQItem>
        </div>
    )
}

export default FuckQPage;