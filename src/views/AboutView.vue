<template>
  <article
    class="prose prose-invert max-w-none prose-h1:text-2xl prose-h2:text-xl my-6 p-6 md:p-10 rounded-lg bg-black/20"
  >
    <h1>{{ $t('AboutTitle') }}</h1>
    <p>
      {{ $t('AboutInfo') }}
    </p>
    <h2>{{ $t('referenceLink') }}</h2>
    <ul>
      <li>
        <a
          href="https://www.cwa.gov.tw/V8/C/"
          target="_blank"
          class="text-weather-secondary"
          >{{ $t('CWALink') }}</a
        >
      </li>
      <li>
        <a
          href="https://opendata.cwa.gov.tw/index"
          target="_blank"
          class="text-weather-secondary"
          >{{ $t('openWeatherDataLink') }}</a
        >
      </li>
      <li>
        <a
          href="https://www.cwa.gov.tw/Data/data_catalog/1-1-1.pdf"
          target="_blank"
          class="text-weather-secondary"
          >{{ $t('CWAProductSpecificationLink') }}</a
        >
      </li>
    </ul>
  </article>
</template>
