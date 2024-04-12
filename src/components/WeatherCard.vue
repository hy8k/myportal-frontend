<script setup lang="ts">
import { ref, type Ref } from 'vue';
import {
    mdiWeatherSunny,
    mdiWeatherCloudy,
    mdiUmbrellaOutline,
    mdiWeatherRainy,
    mdiHelpCircleOutline,
    mdiArrowRightThin,
    mdiWeatherPouring,
    mdiUmbrellaClosedVariant,
    mdiWeatherSnowy,
    mdiWeatherWindy,
    mdiWeatherSnowyHeavy,
    mdiWeatherSnowyRainy
} from '@mdi/js';
import { onUpdated } from 'vue';
import { onBeforeUpdate } from 'vue';
type RegexDict = { [key: string]: RegExp };
type Dict = { [key: string]: any };

const props = defineProps<{
    date: string,
    telop: string,
    weather: string | null,
    minTemperature: string,
    maxTemperature: string,
    chanceOfRain: Dict,
}>()

const iconLeft = ref();
const iconMid = ref();
const iconRight = ref();

const iconList: Dict = {
    '晴れ': mdiWeatherSunny,
    '晴': mdiWeatherSunny,
    '曇': mdiWeatherCloudy,
    '曇り': mdiWeatherCloudy,
    '雨': mdiWeatherRainy,
    '雪': mdiWeatherSnowy,
    '雪か雨': mdiWeatherSnowyRainy,
    '雨か雪': mdiWeatherSnowyRainy,
    '暴風雨': mdiWeatherPouring,
    '暴風雪': mdiWeatherSnowyHeavy,
    '風雪強い': mdiWeatherSnowyHeavy
};

const regexList: RegexDict = {
    'type1': /^(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)$/,
    'type2': /^(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)のち(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)$/,
    'type3': /^(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)時々(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)$/,
    'type4': /^(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)一時(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)$/,
    'type5': /^(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)のち時々(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)$/,
    'type6': /^(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)のち一時(晴|晴れ|曇|曇り|雨|雪|雪か雨|雨か雪|暴風雨|暴風雪|風雪強い)$/,
    'type7': /^(雨|雪)(一時|時々)止む$/
};

const parseTelop = () => {
    let isCorrectTelop = false;
    for (const type in regexList) {
        const res = regexList[type].exec(props.telop as string);
        if (res !== null) {
            isCorrectTelop = true;

            if (type === 'type1') {
                iconMid.value = undefined;
                iconRight.value = undefined;
                if (res[1] in iconList) {
                    iconLeft.value = iconList[res[1]];
                } else {
                    iconLeft.value = mdiHelpCircleOutline;
                }
            } else if (type === 'type2' || type === 'type5' || type === 'type6') {
                if (res[1] in iconList) {
                    iconLeft.value = iconList[res[1]];
                } else {
                    iconLeft.value = mdiHelpCircleOutline;
                }

                if (res[2] in iconList) {
                    iconRight.value = iconList[res[2]];
                } else {
                    iconRight.value = mdiHelpCircleOutline;
                }

                iconMid.value = mdiArrowRightThin;
            } else if (type === 'type3' || type === 'type4') {
                iconMid.value = undefined;
                if (res[1] in iconList) {
                    iconLeft.value = iconList[res[1]];
                } else {
                    iconLeft.value = mdiHelpCircleOutline;
                }

                if (res[2] in iconList) {
                    iconRight.value = iconList[res[2]];
                } else {
                    iconRight.value = mdiHelpCircleOutline;
                }
            } else if (type === 'type7') {
                iconMid.value = undefined;
                iconRight.value = undefined;
                iconLeft.value = iconList[res[1]];
            }
        };
    }

    if (isCorrectTelop === false) {
        iconMid.value = undefined;
        iconRight.value = undefined;
        iconLeft.value = mdiHelpCircleOutline;
    }
}

const formatDateToJapanese = (inputDate: string) => {
    // 入力された日付文字列を「-」で分割して年、月、日に分ける
    const [year, month, day] = inputDate.split('-');

    // 月と日を整数に変換
    const monthInt = parseInt(month, 10);
    const dayInt = parseInt(day, 10);

    // 月と日を2桁表示に変換（1桁の場合は頭に0を追加）
    const formattedMonth = monthInt.toString();
    const formattedDay = dayInt.toString();

    // mm月dd日の形式の文字列を作成
    const formattedDate = `${formattedMonth}月${formattedDay}日`;

    return formattedDate;
}

parseTelop();

onBeforeUpdate(() => {
    parseTelop();
})

</script>

<template>
    <div class="weather-card">
        <div class="weather-card-left">
            <h3><b>{{ formatDateToJapanese(props.date as string) }}</b></h3>
            <div class="weather-mark-wrapper">
                <div class="weather-mark">
                    <v-icon :icon="iconLeft" size=80 color="rgb(95, 95, 95)"></v-icon>
                    <v-icon class="icon-mid" v-if="iconMid !== undefined" :icon="iconMid" size=30
                        color="rgb(95, 95, 95)"></v-icon>
                    <v-icon v-if="iconRight !== undefined" :icon="iconRight" size=60 color="rgb(95, 95, 95)"></v-icon>
                </div>
                <p>{{ props.telop }}</p>
            </div>
        </div>
        <div class="weather-card-right">
            <div class="weather-details">
                <table>
                    <tbody>
                        <tr>
                            <td width="90">天気(詳細)</td>
                            <td v-if="props.weather !== null">{{ props.weather }}</td>
                            <td v-else>---</td>
                        </tr>
                        <tr>
                            <td>最高気温</td>
                            <td v-if="props.maxTemperature !== null">{{ props.maxTemperature }}℃</td>
                            <td v-else>---</td>
                        </tr>
                        <tr>
                            <td>最低気温</td>
                            <td v-if="props.minTemperature !== null">{{ props.minTemperature }}℃</td>
                            <td v-else>---</td>
                        </tr>
                        <tr>
                            <td>降水確率</td>
                            <td>{{ props.chanceOfRain['T00_06'] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
h2 {
    padding: 10px;
}

.weather-card {
    padding: 20px;
    margin-bottom: 5px;
    display: flex;
    height: 20vw;
}

.weather-card-left {
    flex: 1;
}

.weather-card-right {
    flex: 2;
}

.weather-card {
    padding: 10px;
    margin-bottom: 5px;
}

.weather-text {
    min-height: 50px;
    display: flex;
    align-items: center;
}

.weather-mark-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
}

.weather-mark {
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.weather-details {
    padding: 20px;
    border-radius: 10px;
}

.icon-mid {
    margin-left: -20px;
    margin-right: -10px;
}

table {
    width: 100%;
}

.weather-card+h2 {
    border-top: 1px solid rgb(200, 200, 200);
}
</style>