import { defineStore } from 'pinia';
import type { WeeklyChartData, WeeklyElements } from '@/types';
import { format } from 'date-fns';
import axios from 'axios';

export const useWeeklyWeather = defineStore('weeklyWeather', {
  state: () => ({
    elements: <WeeklyElements[]>[], // 一週天氣元素按照日期排序集合儲存於陣列中
    weeklyChartData: {} as WeeklyChartData, // 一週折線圖數據 Chart data
  }),
  actions: {
    async fetchWeather(city: string, region: string, dataId: string[]) {
      try {
        // 串接臺灣各縣市鄉鎮未來1週天氣預報API
        const response = await axios.get(
          `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${dataId[1]}?`,
          {
            params: {
              Authorization: import.meta.env.VITE_API_CWA,
              LocationName: region,
              ElementName:
                '平均溫度,最高溫度,最低溫度,平均相對濕度,12小時降雨機率,天氣現象',
            },
          }
        );

        // 由API獲取的指定天氣因子資料存進data
        const data =
          response.data.records.Locations[0].Location[0].WeatherElement;

        if (data) {
          // 通用函數，用來提取氣象元素數值
          const extractData = (source: any, index: number, key: string) => {
            return source[index].Time.map(
              (item: any) => item.ElementValue[0][key]
            );
          };
          // 注意: 天氣元素的順序必須與API回傳的順序一致
          const tempArr = extractData(data, 0, 'Temperature'); // 平均溫度
          const maxTempArr = extractData(data, 1, 'MaxTemperature'); // 最高溫度
          const minTempArr = extractData(data, 2, 'MinTemperature'); // 最低溫度
          const rhArr = extractData(data, 3, 'RelativeHumidity'); // 平均相對濕度
          const popArr = extractData(data, 4, 'ProbabilityOfPrecipitation'); // 12小時降雨機率
          const wxArr = extractData(data, 5, 'Weather'); // 天氣現象

          // 從溫度資料集提取每天開始時間陣列:
          const dateStrings = data[0].Time.map((el: any) => el.StartTime);

          // 將日期字串轉換為 Date 物件
          const dateObjects = dateStrings.map((d: string) => new Date(d));

          // 一週預報天氣元素
          for (let i = 0; i < 7; i++) {
            this.elements[i] = {
              dayOfWeek: dateObjects[i * 2],
              date: format(dateObjects[i * 2], 'MM/dd'),
              pop: [popArr[i * 2], popArr[i * 2 + 1]],
              temp: [tempArr[i * 2], tempArr[i * 2 + 1]],
              rh: [rhArr[i * 2], rhArr[i * 2 + 1]],
              wx: [wxArr[i * 2], wxArr[i * 2 + 1]],
            };
          }

          // 一週預報折線圖資料
          this.weeklyChartData = {
            // 傳遞 Date 物件陣列，將格式化邏輯移至組件層
            dates: dateObjects.filter((_: any, i: number) => i % 2 === 0),
            tempDay: maxTempArr
              .filter((_: any, i: number) => i % 2 === 0)
              .map((str: string) => parseInt(str, 10)),
            tempNight: minTempArr
              .filter((_: any, i: number) => i % 2 === 1)
              .map((str: string) => parseInt(str, 10)),
          };
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
