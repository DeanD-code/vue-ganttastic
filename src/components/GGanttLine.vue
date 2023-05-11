<template>
  <div class="g-line-container">
    <div v-for="line in lines" :key="line.datetime" class="g-line-style" :style="{
        left: calcLeft(line.datetime, chartStartDate, chartEndDate),
        opacity: line.opacity,
        borderLeft: `${line.width} solid ${line.color}`,
      }" />
  </div>
</template>

<script setup lang="ts">
import provideConfig from "../provider/provideConfig.js"
import useTimeaxisUnits from "../composables/useTimeaxisUnits.js"
import type { GanttLineObject } from "../types.js"

defineProps<{
  highlightedUnits?: number[],
  lines: GanttLineObject[],
  chartStartDate: string | Date,
  chartEndDate: string | Date,

}>()

const { colors } = provideConfig()
const { timeaxisUnits } = useTimeaxisUnits()

const calcLeft = (curTime: string, startDateTime: string | Date, endDateTime: string | Date) => {

  const dateString = startDateTime.toString();
  const [year, month, day, hours, minutes] = dateString.split(/[- :]/);
  const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
  const dateObj = new Date(isoString);

  const dateString1 = endDateTime.toString();
  const [year1, month1, day1, hours1, minutes1] = dateString1.split(/[- :]/);
  const isoString1 = `${year1}-${month1}-${day1}T${hours1}:${minutes1}:00`;
  const dateObj1 = new Date(isoString1);

  const diffMs = dateObj1.getTime() - dateObj.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));

  let diffToCur = 0;
  let leftValue = "0";
  // console.log(diffMins, dateString, dateString1); // Output: 90

  let formatTime = curTime.replace(' ', 'T');
  formatTime = formatTime.replace(/\./g, '-');
  const curDate = new Date(`${formatTime}:00.00Z`);
  // console.log('curDate', `${formatTime}:00.00Z`);
  // console.log('changed Time', curDate, dateObj, dateObj1);

  if (curDate > dateObj && curDate < dateObj1) {
    // console.log('is in current time');
    const diffCur = curDate.getTime() - dateObj.getTime();
    diffToCur = Math.round(diffCur / (1000 * 60));
    leftValue = `${diffToCur / diffMins * 100}%`;

    return leftValue;
  }
  return '200%'
}

</script>

<style>
.g-line-container {
  position: absolute;
  /* z-index: 3; */
  top: 0;
  left: 0%;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.g-line-style {
  position: absolute;
  z-index: 3;
  left: 150px;
  width: 10px;
  height: 100%;
  color: yellow;
  border-left: 1px solid red;
}
</style>

