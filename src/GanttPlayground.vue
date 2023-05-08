<template>
  <g-gantt-chart :chart-start="chartStart" :chart-end="chartEnd" precision="hour" grid width="100%" bar-start="beginDate"
    bar-end="endDate" :date-format="format" :lines="lines_datetime" :rowHeight="40" :verticalMove="true"
    :row-count="locations.length"
    @click-bar="onClickBar($event.bar, $event.e, $event.datetime)"
    @mousedown-bar="onMousedownBar($event.bar, $event.e, $event.datetime)"
    @dblclick-bar="onMouseupBar($event.bar, $event.e, $event.datetime)"
    @mouseenter-bar="onMouseenterBar($event.bar, $event.e)" @mouseleave-bar="onMouseleaveBar($event.bar, $event.e)"
    @dragstart-bar="onDragstartBar($event.bar, $event.e)" @drag-bar="onDragBar($event.bar, $event.e)"
    @dragend-bar="onDragendBar($event.bar, $event.e, $event.movedBars)"
    @contextmenu-bar="onContextmenuBar($event.bar, $event.e, $event.datetime)"
    @drag-timeline="mouseMoveTimeLine($event.e, $event.timeline)"
    @custom-event="handleCustomEvent($event.type, $event.payload)" >
    <g-gantt-row v-for="(location, index) of locations" :label="location.name" :bars="location.bars" :key="location.locationid"
      :locationid="location.locationid" :row-height="40" :rowid="index" >
      <template v-for="bar of location.bars" v-slot:[`simple-${bar.ganttBarConfig.id}`] :key="bar.ganttBarConfig.id">
        <div>{{ bar.ganttBarConfig.label }}</div>
      </template>
      <template v-for="bar of location.bars" v-slot:[`${bar.ganttBarConfig.id}`] :key="bar.ganttBarConfig.id">
        <div>{{ bar.ganttBarConfig.label }}</div>
        <div>{{ bar.detail }}</div>
      </template>
    </g-gantt-row>
  </g-gantt-chart>

  <button type="button" @click="addBar()">Add bar</button>
  <button type="button" @click="deleteBar()">Delete bar</button>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { GanttBarObject, GanttLineObject } from "./types.js"

const chartStart = ref("2023-04-24 13:00")//25.04.2023 12:00
const chartEnd = ref("2023-04-26 12:00")
const format = ref("YYYY-MM-DD HH:mm")

const bars1 = ref<GanttBarObject[]>([
  {
    beginDate: "2023-04-25 14:00",
    endDate: "2023-04-25 18:00",
    detail : "This is detail string",
    ganttBarConfig: {
      id: "8621987329",
      label: "I'm in a bundle",
      bundle: "bundle2",
    }
  }
])

const bars2 = ref([
  {
    beginDate: "2023-04-24 17:00",
    endDate: "2023-04-24 19:00",
    detail : "This is detail string",

    ganttBarConfig: {
      id: "1592311887",
      label: "I'm in a bundle",
      bundle: "bundle1",
      style: {
        background: "magenta"
      }
    }
  },
  {
    beginDate: "2023-04-25 12:00",
    endDate: "2023-04-25 18:00",
    detail : "This is detail string",
    ganttBarConfig: {
      id: "7716981641",
      label: "Lorem ipsum dolor",
      hasHandles: true,
      style: {
        background: "#b74b52"
      }
    }
  },
  {
    beginDate: "2023-04-25 15:00",
    endDate: "2023-04-25 19:00",
    detail : "This is detail string",
    ganttBarConfig: {
      id: "9716981641",
      label: "Oh hey",
      style: {
        background: "#69e064",
        borderRadius: "15px",
        color: "blue",
        fontSize: "10px"
      }
    }
  }
])
const locations = ref([
  {
    locationid: 0,
    name: 'first row',
    bars: bars1,
  },
  {
    locationid: 2,
    name: 'second row',
    bars: bars2
  },
])
const addBar = () => {
  if (bars1.value.some((bar) => bar.ganttBarConfig.id === "test1")) {
    return
  }
  const bar = {
    beginDate: "2023-04-26 09:00",
    endDate: "2023-04-26 16:00",
    ganttBarConfig: {
      id: "test1",
      hasHandles: true,
      label: "Hello!",
      style: {
        background: "#5484b7",
        borderRadius: "20px"
      }
    }
  }
  bars1.value.push(bar)
}

const deleteBar = () => {
  const idx = bars1.value.findIndex((b) => b.ganttBarConfig.id === "test1")
  if (idx !== -1) {
    bars1.value.splice(idx, 1)
  }
}

const onClickBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  console.log("click-bar", bar, e, datetime)
}

const onMousedownBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  console.log("mousedown-bar", bar, e, datetime)
}

const onMouseupBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  console.log("mouseup-bar", bar, e, datetime)
}

const onMouseenterBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("mouseenter-bar", bar, e)
}

const onMouseleaveBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("mouseleave-bar", bar, e)
}

const onDragstartBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("dragstart-bar", bar, e)
}

const onDragBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("drag-bar", bar, e)
}

const onDragendBar = (
  bar: GanttBarObject,
  e: MouseEvent,
  movedBars?: Map<GanttBarObject, { oldStart: string; oldEnd: string }>
) => {
  console.log("dragend-bar", bar, e, movedBars)

  locations.value = [...locations.value]
}

const onContextmenuBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  console.log("contextmenu-bar", bar, e, datetime)
}
const lines_datetime = ref<GanttLineObject[]>([
  {
    datetime: "2023-04-25 23:00",
    color: "red",
    width: '3px',
    opacity: '0.9',
  },
  {
    datetime: "2023-04-26 13:00",
    color: "yellow",
    width: '2px',
    opacity: '0.9',
  }
])
const mouseMoveTimeLine = (e: MouseEvent, timeline?: string) => {
  console.log("mouseMoveTimeLine", e, timeline)
  let diffTime = "0";

  if (timeline !== undefined)
    diffTime = timeline

  if (isNaN(parseInt(diffTime, 10)))
    return;

  let startDate = convertStringToDate(chartStart.value),
    endDate = convertStringToDate(chartEnd.value);

  console.log('difftime', parseInt(diffTime, 10), timeline, diffTime + 'mins');
  console.log(startDate.getTime(), endDate.getTime());
  console.log(startDate.toISOString(), endDate.toISOString());

  const sDate = new Date();//startDate.getTime() parseInt(diffTime)*60000
  const eDate = new Date();//endDate.getTime()parseInt(diffTime)*60000

  sDate.setTime(startDate.getTime() - parseInt(diffTime) * 60000);
  eDate.setTime(endDate.getTime() - parseInt(diffTime) * 60000);

  chartStart.value = convertDate2FormatString(sDate);
  chartEnd.value = convertDate2FormatString(eDate);
}
const handleCustomEvent = (type: string, payload: any) => {
  console.log('type and payload', type, payload)
  switch(type){
    case 'update-row':
      console.log('before change', locations.value)
      locations.value[payload.locationid - 1].name = payload.inputValue
      // locations.value.filter(location=>location.locationid == payload.locationid)[0].name = payload.inputValue;
      // locations.value.map(location => {
      //     if(location.locationid == payload.locationid){
      //         location.name = payload.inputValue
      //         location.locationid = payload.inputLocationid
      //     }
      // })
    break
  }
}
const convertStringToDate = (timestring: string) => {

  console.log("input time string", timestring);
  let result = timestring.split(/[- ]/);
  let formatTime = result[0] + '-' + result[1] + '-' + result[2] + 'T' + result[3];
  const resultDate = new Date(formatTime);
  return resultDate;
}
const convertDate2FormatString = (datetime: Date) => {
  // console.log("input date", datetime, datetime.toISOString());//.slice(0,10)
  let formatDate = "2023-04-25 12:00";
  formatDate = datetime.getFullYear() + '-'
    + ('0' + (datetime.getMonth() + 1)).slice(-2)
    + '-' + ('0' + datetime.getDate()).slice(-2)
    + ' ' + ('0' + datetime.getHours()).slice(-2)
    + ':' + ('0' + datetime.getMinutes()).slice(-2);
  console.log("output date", formatDate);
  return formatDate
}
</script>
