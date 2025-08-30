<template>
  <Line
    v-if="chartDataReady"
    :options="chartOptions"
    :data="chartData"
    aria-label="Weekly Weather Line Chart"
  />
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
import { useWeeklyWeather } from '@/store/weeklyWeather';
import { calculateStepSize } from '@/utils/calculate';
import { Line } from 'vue-chartjs';
import i18n from '@/utils/vue-i18n';
import { format } from 'date-fns';
const { t, d } = i18n.global;
const weeklyStore = useWeeklyWeather();
const { weeklyChartData } = toRefs(weeklyStore);

// (在渲染組件前) 檢查weeklyChartData是否已定義並包含有效數據
const chartDataReady = computed(() => {
  return weeklyChartData.value.dates && weeklyChartData.value.dates.length > 0;
});

// 快取所有Y軸數據
const chartYAxisData = computed(() => [
  ...(weeklyChartData.value.tempDay ?? []),
  ...(weeklyChartData.value.tempNight ?? []),
]);

const formattedLabels = computed(() => {
  return (
    weeklyChartData.value.dates?.map((date: Date) => [
      format(date, 'MM/dd'),
      d(date, 'dayOfWeek'),
    ]) ?? []
  );
});

// Chart data of weekly weather forecast
const chartData = computed(() => ({
  labels: formattedLabels.value,
  datasets: [
    {
      label: t('dayTemp'),
      data: weeklyChartData.value.tempDay,
      backgroundColor: '#fef08a',
      borderColor: '#fef08a',
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
      label: t('nightTemp'),
      data: weeklyChartData.value.tempNight,
      backgroundColor: '#60a5fa',
      borderColor: '#60a5fa',
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
    responsive: true,
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
        suggestedMin: yAxisData.length ? Math.min(...yAxisData) : 5, // Y 軸最小值
        suggestedMax: yAxisData.length ? Math.max(...yAxisData) : 20, // Y 軸最大值
      },
    },
  };
});
</script>
