<script setup lang="ts">
import {
    mdiWeatherSunsetUp,
    mdiWeatherSunsetDown,
    mdiCurrencyUsd,
    mdiCurrencyEur,
    mdiMoonNew,
    mdiMoonWaxingCrescent,
    mdiMoonFirstQuarter,
    mdiMoonWaxingGibbous,
    mdiMoonFull,
    mdiMoonLastQuarter,
    mdiMoonWaningGibbous,
    mdiMoonWaningCrescent
} from '@mdi/js';
import { ref } from 'vue';
import SunCalc from 'suncalc';
type Dict = { [key: string]: any };

const today = new Date();
const sunCalcList = SunCalc.getTimes(today, 38.2682, 140.8693);
const moonPhase = Math.floor(SunCalc.getMoonIllumination(today).phase * Math.pow(10, 2)) / Math.pow(10, 2);
const sunriseTime = sunCalcList.sunrise;
const sunsetTime = sunCalcList.sunset;

const cursor = ref(0)
const iconAndMessageList = ref([] as Array<Dict>);
const isWidgetInit = ref(false);

const setWidgetContent = () => {
    iconAndMessageList.value = [];

    if (sunriseTime.getTime() - (new Date().getTime()) > 0) {
        iconAndMessageList.value.push({
            'icon': mdiWeatherSunsetUp,
            'message': sunriseTime.getHours().toString() + ':' + ('0' + sunriseTime.getMinutes().toString()).slice(-2) + '(仙台)'
        })
    }

    if (sunsetTime.getTime() - (new Date().getTime()) > 0) {
        iconAndMessageList.value.push({
            'icon': mdiWeatherSunsetDown,
            'message': sunsetTime.getHours().toString() + ':' + ('0' + sunsetTime.getMinutes().toString()).slice(-2) + '(仙台)'
        })
    }

    if (moonPhase === 0) {
        iconAndMessageList.value.push({
            'icon': mdiMoonNew,
            'message': '新月'
        })
    } else if (moonPhase < 0.25) {
        iconAndMessageList.value.push({
            'icon': mdiMoonWaxingCrescent,
            'message': '新月 - 上弦'
        })
    } else if (moonPhase === 0.25) {
        iconAndMessageList.value.push({
            'icon': mdiMoonFirstQuarter,
            'message': '上弦の月'
        })
    } else if (moonPhase < 0.5) {
        iconAndMessageList.value.push({
            'icon': mdiMoonWaxingGibbous,
            'message': '上弦 - 満月'
        })
    } else if (moonPhase === 0.5) {
        iconAndMessageList.value.push({
            'icon': mdiMoonFull,
            'message': '満月'
        })
    } else if (moonPhase < 0.75) {
        iconAndMessageList.value.push({
            'icon': mdiMoonWaningGibbous,
            'message': '満月 - 下弦'
        })
    } else if (moonPhase === 0.75) {
        iconAndMessageList.value.push({
            'icon': mdiMoonLastQuarter,
            'message': '下弦の月'
        })
    } else {
        iconAndMessageList.value.push({
            'icon': mdiMoonWaningCrescent,
            'message': '下弦 - 新月'
        })
    }


    fetch('https://api.coingecko.com/api/v3/exchange_rates')
        .then(data => data.json())
        .then(rateData => {
            const USDToJPYRate = Number(rateData['rates']['jpy']['value']) / Number(rateData['rates']['usd']['value']);
            const EURToJPYRate = Number(rateData['rates']['jpy']['value']) / Number(rateData['rates']['eur']['value']);
            iconAndMessageList.value.push({
                'icon': mdiCurrencyUsd,
                'message': '¥' + USDToJPYRate.toString().substring(0, 6)
            });
            iconAndMessageList.value.push({
                'icon': mdiCurrencyEur,
                'message': '¥' + EURToJPYRate.toString().substring(0, 6)
            });
        })
        .catch()
}

setWidgetContent();

setInterval(() => {
    setWidgetContent();
    isWidgetInit.value = true;
}, 300000);

setInterval(() => {
    const widgetWrapper = document.getElementsByClassName('widget-wrapper')[0];

    widgetWrapper.classList.add('disappear');
    setTimeout(() => {
        widgetWrapper.classList.remove('disappear');
        widgetWrapper.classList.remove('appear');
        if (isWidgetInit.value === true) {
            cursor.value = 0;
            isWidgetInit.value = false;
        } else {
            cursor.value = (cursor.value + 1) % iconAndMessageList.value.length;
        }
        widgetWrapper.classList.add('appear');
    }, 2000);
}, 20000);
</script>

<template>
    <div class="widget-wrapper appear">
        <v-icon class="widget-icon" :icon="iconAndMessageList[cursor]['icon']" size=25 color="rgb(95, 95, 95)"></v-icon>
        <p class="widget-string">{{ iconAndMessageList[cursor]['message'] }}</p>
    </div>
</template>

<style scoped>
.widget-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.widget-wrapper p {
    font-size: 12px;
}

.widget-string {
    padding-left: 3px;
}

.appear {
    animation: 2s fadeIn;
}

.disappear {
    animation: 3s ease fadeOut;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>