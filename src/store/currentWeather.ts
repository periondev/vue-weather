import { defineStore } from 'pinia';
import type { CurrentChartData, CurrentElements } from '@/types';
import axios from 'axios';

export const useCurrentWeather = defineStore('currentWeather', {
  state: () => ({
    currentData: {} as CurrentElements, // 即時天氣預報面板
    currentChartData: {} as CurrentChartData, // 72小時預報折線圖數據 72 hour Chart data
  }),
  actions: {
    async fetchWeather(city: string, region: string, dataId: string[]) {
      try {
        // 串接臺灣各縣市鄉鎮未來3天天氣預報API
        const response = await axios.get(
          `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${dataId[0]}?`,
          {
            params: {
              Authorization: import.meta.env.VITE_API_CWA,
              LocationName: region,
              ElementName:
                '溫度,相對濕度,體感溫度,舒適度指數,風速,3小時降雨機率,天氣現象',
            },
          }
        );

        // 由API獲取的指定天氣因子資料存進 weatherElements
        const weatherElements =
          response.data.records.Locations[0].Location[0].WeatherElement;

        if (weatherElements) {
          // 通用函數，用來提取即時天氣元素數值
          const extractData = (source: any, index: number, key: string) => {
            return source[index].Time[0].ElementValue[0][key];
          };

          this.currentData = {
            cityName: city,
            regionName: region,
            pop: extractData(weatherElements, 5, 'ProbabilityOfPrecipitation'), // 3小時降雨機率
            temp: extractData(weatherElements, 0, 'Temperature'), //溫度
            rh: extractData(weatherElements, 1, 'RelativeHumidity'), // 相對濕度
            wx: extractData(weatherElements, 6, 'Weather'), // 天氣現象
            ci: extractData(weatherElements, 3, 'ComfortIndexDescription'), // 舒適度指數, 舒適度文字描述
            ws: extractData(weatherElements, 4, 'WindSpeed'), // 風速 (公尺/秒)
          };

          // 72小時預報折線圖數據 (前36小時區間，由原逐3小時預報調整為逐時預報)
          // 即時取得資料集:溫度、體感溫度各48筆
          // 從溫度資料集提取對應資料時間
          const tempForecasts = weatherElements[0].Time.slice(0, 47);
          const apparentTempForecasts = weatherElements[2].Time.slice(0, 47);
          const dataTime = tempForecasts.map((el: any) => el.DataTime);

          this.currentChartData = {
            date: dataTime,
            temp: tempForecasts.map(
              (el: any) => el.ElementValue[0].Temperature
            ),
            apparentTemp: apparentTempForecasts.map(
              (el: any) => el.ElementValue[0].ApparentTemperature
            ),
          };
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
