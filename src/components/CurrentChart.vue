<template>
  <Line
    v-if="chartDataReady"
    :options="chartOptions"
    :data="chartData"
    aria-label="Current Weather Line Chart"
    width="1500"
  />
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
import { useCurrentWeather } from '@/store/currentWeather';
import { calculateStepSize } from '@/utils/calculate';
import { Line } from 'vue-chartjs';
import { format } from 'date-fns';
import i18n from '@/utils/vue-i18n';
const { t, d } = i18n.global;
const currentStore = useCurrentWeather();
const { currentChartData } = toRefs(currentStore);

// (在渲染組件前) 檢查currentChartData是否已定義並包含有效數據
const chartDataReady = computed(() => {
  return currentChartData.value.date && currentChartData.value.date.length > 0;
});

// 快取所有Y軸數據
const chartYAxisData = computed(() => [
  ...(currentChartData.value.temp ?? []),
  ...(currentChartData.value.apparentTemp ?? []),
]);

/**
 * 格式化圖表的 X 軸標籤。
 *
 * 此函式負責將從 Pinia store 獲取的原始日期時間字串陣列 (ISO 8601 格式)
 * 轉換為符合顯示需求的標籤格式。
 *
 * 格式化邏輯如下：
 * 1. 對於第一筆資料以及每個午夜 (00:00) 的資料點，標籤會以多行陣列呈現：
 *    [小時, 月/日, 本地化的星期幾] (例如: ['00', '08/25', '週一'])。
 *    這樣可以在新的一天開始時提供完整的日期上下文。
 * 2. 對於其餘的資料點，僅顯示兩位數的小時 (例如: '15', '16')，以保持圖表簡潔。
 * 3. 使用 date-fns 的 format() 函式來格式化日期和時間。
 * 4. 使用 vue-i18n 的 d() 函式來確保星期幾的顯示會隨著語言切換而更新。
 */
const formattedLabels = computed(() => {
  return (
    currentChartData.value.date?.map(
      (dateTimeString: string, index: number) => {
        const date = new Date(dateTimeString);
        const hour = format(date, 'HH');

        if (index === 0 || date.getHours() === 0) {
          return [hour, format(date, 'MM/dd'), d(date, 'dayOfWeek')];
        }
        return hour;
      }
    ) ?? []
  );
});

// Chart data of current weather forecast
const chartData = computed(() => ({
  labels: formattedLabels.value,
  datasets: [
    {
      label: t('temp'),
      data: currentChartData.value.temp ?? [],
      backgroundColor: '#a5f3fc',
      borderColor: '#a5f3fc',
      hoverRadius: 6,
      cubicInterpolationMode: 'monotone' as const,
      tension: 0.4,
      datalabels: {
        color: '#fff',
        align: 'end' as const,
        anchor: 'start' as const,
        font: {
          weight: 'bold' as const,
        },
      },
    },
    {
      label: t('apparentTemp'),
      data: currentChartData.value.apparentTemp ?? [],
      backgroundColor: '#fb923c',
      borderColor: '#fb923c',
      hoverRadius: 6,
      cubicInterpolationMode: 'monotone' as const,
      tension: 0.4,
      datalabels: {
        color: '#fff',
        align: 'end' as const,
        anchor: 'start' as const,
        font: {
          weight: 'bold' as const,
        },
      },
    },
  ],
}));
// Chart options
const chartOptions = computed(() => {
  const yAxisData = chartYAxisData.value;
  const stepSize = calculateStepSize(yAxisData); // 動態計算 Y 軸 stepSize

  return {
    responsive: false, // set false to enable overflow canvas with scrollbar
    maintainAspectRatio: false,
    plugins: {
      legend: {
        align: 'start' as const,
        labels: {
          boxWidth: 24,
          boxHeight: 10,
          color: '#fff',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#3f3f46',
        },
        ticks: {
          color: '#d4d4d4',
          autoSkip: false, // Disable automatic skipping
          maxRotation: 0, // Disable rotation
        },
      },
      y: {
        grid: {
          color: '#3f3f46',
        },
        ticks: {
          color: '#d4d4d4',
          stepSize: stepSize, // 動態設定 stepSize
        },
        suggestedMin: yAxisData.length ? Math.min(...yAxisData) - 1 : 5, // Y 軸預設最小值
        suggestedMax: yAxisData.length ? Math.max(...yAxisData) + 1 : 20, // Y 軸預設最大值
      },
    },
  };
});
</script>
