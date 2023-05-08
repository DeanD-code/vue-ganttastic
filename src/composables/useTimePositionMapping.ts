import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import { computed } from "vue"

import useDayjsHelper from "./useDayjsHelper.js"
import provideConfig from "../provider/provideConfig.js"

export default function useTimePositionMapping(config: GGanttChartConfig = provideConfig()) {
  const { dateFormat, chartSize } = config
  const { chartStartDayjs, chartEndDayjs, toDayjs, format } = useDayjsHelper(config)

  const totalNumOfMinutes = computed(() => {
    return chartEndDayjs.value.diff(chartStartDayjs.value, "minutes")
  })

  const mapTimeToPosition = (time: string) => {
    const width = chartSize.width.value || 0
    const diffFromStart = toDayjs(time).diff(chartStartDayjs.value, "minutes", true)
    return Math.ceil((diffFromStart / totalNumOfMinutes.value) * width)
  }

  const mapPositionToTime = (xPos: number) => {
    const width = chartSize.width.value || 0
    const diffFromStart = (xPos / width) * totalNumOfMinutes.value
    return format(chartStartDayjs.value.add(diffFromStart, "minutes"), dateFormat.value)
  }
  const mapPositionToTimeDiff = (xPos: number) => {
    const width = chartSize.width.value;
    // console.log('xPos and width', xPos, width, totalNumOfMinutes.value);

    const diffFromStart = Math.ceil((xPos / width) * totalNumOfMinutes.value)
    return diffFromStart.toString()
  }
  const mapPositionToRow = (yPos: number) => {
    const timeaxisContainer = document.querySelector(".g-timeaxis")!;
    let TotalHeight = (timeaxisContainer as HTMLElement).offsetHeight;
    let locationid = "-1";
    let fixedTop = 0;
    const rowsContainer = document.querySelector(".g-gantt-rows-container")!;
    Array.from(
      rowsContainer.children
    ).forEach((ganttRow) => {
      // console.log((ganttRow as HTMLElement).offsetHeight)
      const rect = ganttRow.getBoundingClientRect();
      if (yPos >= rect.top && yPos < rect.bottom) {
        locationid = ganttRow.getAttribute('locationid')!;
        fixedTop = rect.top;
      }
    })

    console.log('yPos->rowID', yPos, locationid);
    return locationid
  }
  return {
    mapTimeToPosition,
    mapPositionToTime,
    mapPositionToTimeDiff,
    mapPositionToRow
  }
}
