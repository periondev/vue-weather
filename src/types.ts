// 歷史紀錄項目
export interface History {
  city: string;
  region: string;
  dataId: string[];
}
// 即時天氣資料儀表板元素
export interface CurrentElements {
  cityName: string;
  regionName: string;
  pop: string; // 3小時降雨機率
  temp: string; // 溫度
  rh: string; // 相對濕度
  wx: string; // 天氣現象
  ci: string; // 舒適度指數
  ws: string; // 風速 (公尺/秒)
}

// 即時天氣資料折線圖
export interface CurrentChartData {
  date: string[];
  temp: number[]; // 溫度
  apparentTemp: number[]; // 體感溫度
}

// 一週天氣預報元素，每個天氣元素皆有白天(06:00~18:00)、晚上(18:00~隔天06:00)2筆資料
export interface WeeklyElements {
  dayOfWeek: Date;
  date: string;
  pop: string[]; // 12小時降雨機率
  temp: string[]; // 平均溫度
  rh: string[]; // 平均相對濕度
  wx: string[]; // 天氣現象
}

// 一週天氣預報折線圖
export interface WeeklyChartData {
  date: string[];
  dayOfWeek: string[];
  tempDay: number[]; // 早平均溫度
  tempNight: number[]; // 晚平均溫度
}
