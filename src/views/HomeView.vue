<script lang="ts">
import { ref } from 'vue'
import { store } from '@/store';
import WeatherCard from '@/components/WeatherCard.vue';
import WeatherCardLarge from '@/components/WeatherCardLarge.vue';
import { mdiReload, mdiStoreAlert, mdiLoading } from '@mdi/js';
import SunCalc from 'suncalc';
type Dict = { [key: string]: any };

const loading = ref(false);
const weatherData = ref();
const forecasts = ref();
const weatherWarningsData = ref();
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
const areaId: Dict = {
    'Sendai': '040000',
    'Chiba': '120000',
    'Wakkanai': '011000',
    'Kumagaya': '110000',
    'Naha': '471000',
    'Niigata': '150000',
    'Kyoto': '260000',
    'Tokyo': '130000',
    'Yonaguni': '474000',
    'Hachijojima': '130000',
    'Nagoya': '230000',
    'Fukuoka': '400000',
    'Sapporo': '016000'
}
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

const weatherWarnings: Dict = {
    "02": "暴風雪警報",
    "03": "大雨警報",
    "04": "洪水警報",
    "05": "暴風警報",
    "06": "大雪警報",
    "07": "波浪警報",
    "08": "高潮警報",
    "10": "大雨注意報",
    "12": "大雪注意報",
    "13": "風雪注意報",
    "14": "雷注意報",
    "15": "強風注意報",
    "16": "波浪注意報",
    "17": "融雪注意報",
    "18": "洪水注意報",
    "19": "高潮注意報",
    "20": "濃霧注意報",
    "21": "乾燥注意報",
    "22": "なだれ注意報",
    "23": "低温注意報",
    "24": "霜注意報",
    "25": "着氷注意報",
    "26": "着雪注意報",
    "27": "その他の注意報",
    "32": "暴風雪特別警報",
    "33": "大雨特別警報",
    "35": "暴風特別警報",
    "36": "大雪特別警報",
    "37": "波浪特別警報",
    "38": "高潮特別警報"
};

const sunCalcList = ref(SunCalc.getTimes(new Date(), locationLatitude[location.value], locationLongitude[location.value]));
const sunriseTime = ref(sunCalcList.value.sunrise.getHours().toString() + ':' + ('0' + sunCalcList.value.sunrise.getMinutes().toString()).slice(-2));
const sunsetTime = ref(sunCalcList.value.sunset.getHours().toString() + ':' + ('0' + sunCalcList.value.sunset.getMinutes().toString()).slice(-2));

const advisoryList = ref<Array<string>>([]);
const warningList = ref<Array<string>>([]);
const emergencyWarningList = ref<Array<string>>([]);

const fetchWeatherData = async () => {
    try {
        const data = (await fetch('https://weather.tsukumijima.net/api/forecast/city/' + locationId[location.value])).json();
        return {
            'success': true,
            'body': await data
        }

    } catch {
        return {
            'success': false
        }
    }
}

const fetchWeatherWarningsData = async () => {
    try {
        const data = (await fetch('https://www.jma.go.jp/bosai/warning/data/warning/' + areaId[location.value] + '.json')).json();
        return {
            'success': true,
            'body': await data
        }
    } catch {
        return {
            'success': false
        }
    }
}

const setWeatherData = (latestWeatherData: Dict) => {
    weatherData.value = latestWeatherData;
    if (weatherData.value['success'] === true) {
        forecasts.value = weatherData.value['body']['forecasts'];
    }
}

const setWeatherWarningsData = (latestWeatherWarningsData: Dict) => {
    weatherWarningsData.value = latestWeatherWarningsData
    if (weatherWarningsData.value['success'] === true) {
        advisoryList.value = []
        warningList.value = []
        emergencyWarningList.value = []
        const areas = weatherWarningsData.value['body']['areaTypes'][0]['areas']
        for (const area of areas) {
            if (area['code'] == locationId[location.value]) {
                for (const warning of area['warnings']) {
                    if (warning['status'] == '発表' || warning['status'] == '継続') {
                        const warningStr: string = weatherWarnings[warning['code']]
                        if (warningStr.includes("特別警報")) {
                            emergencyWarningList.value.push(warningStr)
                        } else if (warningStr.includes("警報")) {
                            warningList.value.push(warningStr)
                        } else if (warningStr.includes("注意報")) {
                            advisoryList.value.push(warningStr)

                        }
                    }
                }
            }
        }
    }
}


const setSunData = () => {
    sunCalcList.value = SunCalc.getTimes(new Date(), locationLatitude[location.value], locationLongitude[location.value]);
    sunriseTime.value = sunCalcList.value.sunrise.getHours().toString() + ':' + ('0' + sunCalcList.value.sunrise.getMinutes().toString()).slice(-2);
    sunsetTime.value = sunCalcList.value.sunset.getHours().toString() + ':' + ('0' + sunCalcList.value.sunset.getMinutes().toString()).slice(-2);
}

const setAllData = async () => {
    loading.value = true;
    const weather = await fetchWeatherData();
    const weatherWarnings = await fetchWeatherWarningsData();
    setWeatherData(weather);
    setWeatherWarningsData(weatherWarnings);
    setSunData();
    loading.value = false;
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
            mdiLoading,
            sunCalcList,
            sunriseTime,
            sunsetTime,
            location,
            advisoryList,
            warningList,
            emergencyWarningList,
            loading,
            setWeatherData,
            setAllData
        }
    },

    async beforeRouteEnter() {
        store.loading = 'pending';
        setTimeout(() => {
            if (store.loading === 'pending') {
                store.loading = 'true';
            }
        }, 1000);
        await setAllData();
        store.loading = 'false';
    },

    // beforeRouteLeave() {
    //     store.loading = 'pending';
    //     setTimeout(() => {
    //         if (store.loading === 'pending') {
    //             store.loading = 'true';
    //         }
    //     }, 1000);
    // },

    watch: {
        location() {
            setAllData()
        }
    }
}
</script>


<template>
    <div class="content">
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
            <button class="btn-default btn-small" @click="setAllData">
                <v-icon :icon="mdiReload" size=20 color="rgb(95, 95, 95)"></v-icon>
                Reload
            </button>
            <v-icon v-if="loading === true" :icon="mdiLoading" size=30 class="loading-spinner"></v-icon>

        </div>
        <div v-if="weatherData['success'] === false">
            <p>データ取得に失敗しました。</p>
        </div>
        <div v-else>
            <div class="weather">
                <div class="weather-left">
                    <WeatherCardLarge :date="forecasts[0]['date']" :telop="forecasts[0]['telop']"
                        :weather="forecasts[0]['detail']['weather']"
                        :min-temperature="forecasts[0]['temperature']['min']['celsius']"
                        :max-temperature="forecasts[0]['temperature']['max']['celsius']"
                        :wind="forecasts[0]['detail']['wind']" :wave="forecasts[0]['detail']['wave']"
                        :sunrise-time="sunriseTime" :sunset-time="sunsetTime"
                        :chance-of-rain="forecasts[0]['chanceOfRain']" :advisory-list="advisoryList"
                        :warning-list="warningList" :emergency-warning-list="emergencyWarningList" />
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

.loading-spinner {
    animation: rotate linear 0.4s infinite;
    margin-left: 10px;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
