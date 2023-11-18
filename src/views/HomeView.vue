<script lang="ts">
import { ref } from 'vue'
import { store } from '@/store';
import WeatherCard from '@/components/WeatherCard.vue';
import WeatherCardLarge from '@/components/WeatherCardLarge.vue';
import { mdiReload } from '@mdi/js';
import SunCalc from 'suncalc';
type Dict = { [key: string]: any };

const weatherData = ref();
const forecasts = ref();
const location = ref('Sendai');
const locationId: Dict = {
    'Sendai': '040010',
    'Chiba': '120010',
    'Wakkanai': '011000',
    'Kumagaya': '110020',
    'Naha': '471010',
    'Niigata': '150010',
    'Kyoto': '260010',
    'Tokyo': '130010',
    'Yonaguni': '474020',
    'Hachijojima': '130030',
    'Nagoya': '230010',
    'Fukuoka': '400010',
    'Sapporo': '016010'
};
const locationLatitude: Dict = {
    'Sendai': 38.2682,
    'Chiba': 35.60472,
    'Wakkanai': 45.4156,
    'Kumagaya': 36.1473,
    'Naha': 26.2123,
    'Niigata': 37.9161,
    'Kyoto': 35.0116,
    'Tokyo': 35.68944,
    'Yonaguni': 24.4616,
    'Hachijojima': 33.103,
    'Nagoya': 35.1814,
    'Fukuoka': 33.5903,
    'Sapporo': 43.062
};
const locationLongitude: Dict = {
    'Sendai': 140.8693,
    'Chiba': 140.12333,
    'Wakkanai': 141.673,
    'Kumagaya': 139.3886,
    'Naha': 127.6791,
    'Niigata': 139.0364,
    'Kyoto': 135.768,
    'Tokyo': 139.69167,
    'Yonaguni': 123.0085,
    'Hachijojima': 139.8035,
    'Nagoya': 136.9063,
    'Fukuoka': 130.4017,
    'Sapporo': 141.3543
};

const sunCalcList = ref(SunCalc.getTimes(new Date(), locationLatitude[location.value], locationLongitude[location.value]));
const sunriseTime = ref(sunCalcList.value.sunrise.getHours().toString() + ':' + ('0' + sunCalcList.value.sunrise.getMinutes().toString()).slice(-2));
const sunsetTime = ref(sunCalcList.value.sunset.getHours().toString() + ':' + ('0' + sunCalcList.value.sunset.getMinutes().toString()).slice(-2));

const fetchWeatherData = async () => {
    try {
        const data = (await fetch('https://weather.tsukumijima.net/api/forecast/city/' + locationId[location.value])).json();
        return {
            'success': 'true',
            'body': await data
        }

    } catch {
        return {
            'success': 'false'
        }
    }
}

const setWeatherData = async () => {
    weatherData.value = await fetchWeatherData();
    if (weatherData.value['success'] === 'true') {
        forecasts.value = weatherData.value['body']['forecasts'];
    }
}

const setSunData = () => {
    sunCalcList.value = SunCalc.getTimes(new Date(), locationLatitude[location.value], locationLongitude[location.value]);
    sunriseTime.value = sunCalcList.value.sunrise.getHours().toString() + ':' + ('0' + sunCalcList.value.sunrise.getMinutes().toString()).slice(-2);
    sunsetTime.value = sunCalcList.value.sunset.getHours().toString() + ':' + ('0' + sunCalcList.value.sunset.getMinutes().toString()).slice(-2);
}

export default {
    components: {
        WeatherCard,
        WeatherCardLarge
    },

    setup() {
        return {
            weatherData,
            forecasts,
            mdiReload,
            sunCalcList,
            sunriseTime,
            sunsetTime,
            location,
            setWeatherData,
        }
    },

    async beforeRouteEnter() {
        await setWeatherData();
        store.loading = 'false';
    },

    beforeRouteLeave() {
        store.loading = 'pending';
        setTimeout(() => {
            if (store.loading === 'pending') {
                store.loading = 'true';
            }
        }, 1000);
    },

    watch: {
        location() {
            setWeatherData();
            setSunData();
        }
    }
}
</script>


<template>
    <div class="content">
        <div v-if="weatherData['success'] === 'false'">
            <p>データ取得に失敗しました。</p>
            <button class="btn-default btn-small" @click="setWeatherData">
                <v-icon :icon="mdiReload" size=20 color="rgb(95, 95, 95)"></v-icon>
                Reload
            </button>
        </div>
        <div v-else>
            <div class="weather-header">
                <h2>3日間天気予報</h2>
                <div class="selectbox">
                    <select v-model="location">
                        <option value="Sapporo">札幌</option>
                        <option value="Wakkanai">稚内</option>
                        <option value="Sendai">仙台</option>
                        <option value="Niigata">新潟</option>
                        <option value="Kumagaya">熊谷</option>
                        <option value="Tokyo">東京</option>
                        <option value="Hachijojima">八丈島</option>
                        <option value="Chiba">千葉</option>
                        <option value="Nagoya">名古屋</option>
                        <option value="Kyoto">京都</option>
                        <option value="Fukuoka">福岡</option>
                        <option value="Naha">那覇</option>
                        <option value="Yonaguni">与那国島</option>
                    </select>
                </div>
                <button class="btn-default btn-small" @click="setWeatherData">
                    <v-icon :icon="mdiReload" size=20 color="rgb(95, 95, 95)"></v-icon>
                    Reload
                </button>
            </div>
            <div class="weather">
                <div class="weather-left">
                    <WeatherCardLarge :date="forecasts[0]['date']" :telop="forecasts[0]['telop']"
                        :weather="forecasts[0]['detail']['weather']"
                        :min-temperature="forecasts[0]['temperature']['min']['celsius']"
                        :max-temperature="forecasts[0]['temperature']['max']['celsius']"
                        :wind="forecasts[0]['detail']['wind']" :wave="forecasts[0]['detail']['wave']"
                        :sunrise-time="sunriseTime" :sunset-time="sunsetTime"
                        :chance-of-rain="forecasts[0]['chanceOfRain']" />
                </div>
                <div class="weather-right">
                    <WeatherCard v-for="n in 2" :date="forecasts[n]['date']" :telop="forecasts[n]['telop']"
                        :weather="forecasts[n]['detail']['weather']"
                        :min-temperature="forecasts[n]['temperature']['min']['celsius']"
                        :max-temperature="forecasts[n]['temperature']['max']['celsius']"
                        :chance-of-rain="forecasts[n]['chanceOfRain']" />
                </div>
            </div>
            <div class="description">
                <p>{{ weatherData['body']['description']['bodyText'] }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
h2 {
    margin-right: 15px;
}

.content {
    height: calc(100vh - 35px);
    overflow-y: scroll;
    padding: 20px;
}

.weather-header {
    display: flex;
    align-items: center;
}

.weather-header button {
    margin-left: 20px;
}

.weather {
    display: flex;
    margin: 10px 0;
}

.weather-left {
    flex: 1;
    margin-right: 5px;
    margin-bottom: 5px;
    border-right: 1px solid rgb(200, 200, 200);
}

.weather-right {
    flex: 1;
    display: flex;
    flex-flow: column;
}

.description {
    padding: 20px 0;
}

.description p {
    padding: 10px;
}
</style>
