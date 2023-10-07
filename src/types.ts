// 定義歷史紀錄的類型
export interface History {
  city: string;
  region: string;
  dataId: string;
}
// 大致天氣資料
export interface WeatherData {
  cityName: string;
  regionName: string;
  elements: Elements[];
}
// 重新排序後每天的天氣元素資料格式，每個天氣元素含有日與夜兩筆資料
export interface Elements {
  dayOfWeek: string;
  date: string;
  time: string[];
  pop: string[];
  t: string[];
  rh: string[];
  wx: string[];
}

// T // 平均溫度
// RH // 相對濕度
// Wx // 天氣現象
// PoP12h // 降雨機率
