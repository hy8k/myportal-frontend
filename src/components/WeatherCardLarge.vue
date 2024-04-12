<script setup lang="ts">
import { ref, type Ref } from 'vue';
import {
    mdiWeatherSunny,
    mdiWeatherCloudy,
    mdiHelpCircleOutline,
    mdiArrowRightThin,
    mdiWeatherSnowyHeavy,
    mdiWeatherSnowyRainy,
    mdiWeatherRainy,
    mdiWeatherSnowy,
    mdiWeatherPouring,
} from '@mdi/js';
import { onBeforeUpdate } from 'vue';
type RegexDict = { [key: string]: RegExp };
type Dict = { [key: string]: any };

const props = defineProps<{
    date: string,
    telop: string,
    weather: string | null,
    minTemperature: string | null,
    maxTemperature: string | null,
    chanceOfRain: Dict,
    wind: string,
    wave: string | null,
    sunriseTime: string,
    sunsetTime: string,
    advisoryList: Array<string>,
    warningList: Array<string>,
    emergencyWarningList: Array<string>
}>();

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
        <h3><b>{{ formatDateToJapanese(props.date as string) }}</b></h3>
        <div class="weather-mark-wrapper">
            <div class="weather-mark-left">
                <div class="weather-mark">
                    <v-icon :icon="iconLeft" size=130 color="rgb(95, 95, 95)"></v-icon>
                    <v-icon class="icon-mid" v-if="iconMid !== undefined" :icon="iconMid" size=40
                        color="rgb(95, 95, 95)"></v-icon>
                    <v-icon v-if="iconRight !== undefined" :icon="iconRight" size=90 color="rgb(95, 95, 95)"></v-icon>
                </div>
                <p>{{ props.telop }}</p>
            </div>
            <div class="weather-mark-right">
                <h3>発令中の注意報・警報</h3>
                <table>
                    <tbody>
                        <tr>
                            <td width="80" height="50">注意報</td>
                            <td>
                                <div v-if="advisoryList.length != 0" class="jma-list">
                                    <div v-for="advisory in advisoryList"
                                        class="jma-weather-warnings-label jma-advisory">
                                        <p>{{ advisory }}</p>
                                    </div>
                                </div>
                                <div v-else>
                                    <p>発令なし</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td height="50">警報</td>
                            <td>
                                <div v-if="warningList.length != 0" class="jma-list">
                                    <div v-for="warning in warningList" class="jma-weather-warnings-label jma-warning">
                                        <p>{{ warning }}</p>
                                    </div>
                                </div>
                                <div v-else>
                                    <p>発令なし</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td height="50">特別警報</td>
                            <td>
                                <div v-if="emergencyWarningList.length != 0" class="jma-list">
                                    <div v-for="emergencyWarning in emergencyWarningList"
                                        class="jma-weather-warnings-label jma-emergency-warning">
                                        <p>{{ emergencyWarning }}</p>
                                    </div>
                                </div>
                                <div v-else>
                                    <p>発令なし</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="weather-info">
            <div class="weather-details">
                <div class="weather-details-left">
                    <h3>詳細情報</h3>
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
                                <td>風</td>
                                <td>{{ props.wind }}</td>

                            </tr>
                            <tr>
                                <td>波</td>
                                <td v-if="props.wave !== null">{{ props.wave }}</td>
                                <td v-else>---</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="weather-details-right" v-if="props.chanceOfRain">
                    <h3>降水確率</h3>
                    <table>
                        <tbody>

                            <tr>
                                <td width="130">0:00-6:00</td>
                                <td>{{ props.chanceOfRain['T00_06'] }}</td>
                            </tr>
                            <tr>
                                <td>6:00-12:00</td>
                                <td>{{ props.chanceOfRain['T06_12'] }}</td>
                            </tr>
                            <tr>
                                <td>12:00-18:00</td>
                                <td>{{ props.chanceOfRain['T12_18'] }}</td>
                            </tr>
                            <tr>
                                <td>18:00-24:00</td>
                                <td>{{ props.chanceOfRain['T18_24'] }}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.weather-card {
    height: 100%;
    display: flex;
    padding: 10px;
    border-radius: 20px;
    flex-flow: column;
}

.weather-info {
    flex: 5;
}

.weather-mark-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
}

.weather-mark-left {
    text-align: center;
    flex: 1;
}

.weather-mark-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.jma-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.jma-weather-warnings-label {
    padding: 2px 5px;
    border: 1px solid black;
    border-radius: 5px;
    margin: 0 2px;
    width: 60px;
    margin-bottom: 2px;
}

.jma-advisory {
    background-color: yellow;
}

.jma-warning {
    background-color: rgb(255, 0, 0);
    color: white;
}

.jma-emergency-warning {
    background-color: rgb(195, 0, 255);
    color: white;
}

.sun-info {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
}

.weather-text {
    margin-bottom: 10px;
    height: 40px;
}

.weather-details {
    border-radius: 10px;
    display: flex;
}

.weather-details-left {
    flex: 3;
    padding: 15px;
}

.weather-details-right {
    flex: 2;
    padding: 15px;
}

table {
    width: 100%;
}

.weather-mark {
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.icon-mid {
    margin-left: -30px;
    margin-right: -10px;
}
</style>