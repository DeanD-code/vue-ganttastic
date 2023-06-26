<template>
  <div :id="barConfig.id" class="g-gantt-bar draggable"
    ref="barContainer"
    :style="{
      ...barConfig.style,
      position: 'absolute',
      zIndex: isDragging ? 3 : 2,
      top: `${nTop}px`,
      left: `${xStart}px`,
      width: `${xEnd - xStart}px`,
      height: `${currentHeight}px`
    }"
    :key="bUpdateComponent"
    draggable="true"
    @mousedown="onMouseEvent" @click="onMouseEvent" @dblclick="onMouseEvent" @mouseenter="onMouseEvent"
    @mouseleave="onMouseEvent" @contextmenu="onMouseEvent">
    <div class="g-gantt-bar-label">
      <slot />
      <!-- <slot :bar="bar"> -->
        <!-- <div>
          {{ barConfig.label || "" }}
        </div> -->
      <!-- </slot> -->
    </div>
    <div class="g-gantt-bar-detail" v-if="expended">
      <!-- <slot /> -->
    </div>
    <template v-if="barConfig.hasHandles">
      <div class="g-gantt-bar-handle-left" />
      <div class="g-gantt-bar-handle-right" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch, onMounted, inject, onUpdated, nextTick  } from "vue"

import useBarDragManagement from "../composables/useBarDragManagement.js"
import useTimePositionMapping from "../composables/useTimePositionMapping.js"
import useBarDragLimit from "../composables/useBarDragLimit.js"
import type { GanttBarObject } from "../types"
import provideEmitBarEvent from "../provider/provideEmitBarEvent.js"
import provideConfig from "../provider/provideConfig.js"
import { BAR_CONTAINER_KEY } from "../provider/symbols"
// import { extend } from "@vue/shared"
// import { GanttEventBus } from "./EventBus"

const props = defineProps<{
  bar: GanttBarObject,
  expended : boolean,
  // rowid : number,
  customHeight: number
}>()
const emitBarEvent = provideEmitBarEvent()
const config = provideConfig()
const { rowHeight, verticalMove} = config

const { bar } = toRefs(props)
const { mapTimeToPosition, mapPositionToTime } = useTimePositionMapping()
const { initDragOfBar, initDragOfBundle } = useBarDragManagement()
const { setDragLimitsOfGanttBar } = useBarDragLimit()

const isDragging = ref(false);
const currentState = ref(true);// expanded state
const barConfig = computed(() => bar.value.ganttBarConfig)
const originHeight = ref(-1);
const bUpdateComponent = ref(1);
function firstMousemoveCallback(e: MouseEvent) {
  barConfig.value.bundle != null ? initDragOfBundle(bar.value, e) : initDragOfBar(bar.value, e)
  isDragging.value = true

  yPrev.value = e.clientY
  console.log('mouse position', yPrev.value)
  // nTop.value += (e.clientY - yPrev.value)// - barContainer.top
}

const prepareForDrag = () => {
  setDragLimitsOfGanttBar(bar.value)
  if (barConfig.value.immobile) {
    return
  }
  window.addEventListener("mousemove", firstMousemoveCallback, {
    once: true
  }) // on first mousemove event
  window.addEventListener(
    "mouseup",
    () => {
      // in case user does not move the mouse after mousedown at all
      window.removeEventListener("mousemove", firstMousemoveCallback)
      isDragging.value = false
      roundPosition(nTop.value)
    },
    { once: true }
  )
}

const barContainerEl = inject(BAR_CONTAINER_KEY)

const onMouseEvent = (e: MouseEvent) => {
  e.preventDefault()
  if (e.type === "mousedown") {
    prepareForDrag()
    console.log('bar instance', bar.value)
  }
  const barContainer = barContainerEl?.value?.getBoundingClientRect()
  if (!barContainer) {
    return
  }
  const datetime = mapPositionToTime(e.clientX - barContainer.left)

  bar.value.yClient = yPrev.value
  // console.log('barcontainer', barContainer, e.screenY, yPrev.value)
  emitBarEvent(e, bar.value, datetime)
}

const { barStart, barEnd, width, chartStart, chartEnd, chartSize } = config

const xStart = ref(0)
const xEnd = ref(0)
// const nTop = ref(rowHeight.value * 0.1)
const nTop = ref(0)
const yPrev = ref(0)
onMounted(() => {
  watch(
    [bar, width, chartStart, chartEnd, chartSize.width],
    () => {
      xStart.value = mapTimeToPosition(bar.value[barStart.value])
      xEnd.value = mapTimeToPosition(bar.value[barEnd.value])
      if(verticalMove.value){
        nTop.value = bar.value["clientY"]
      }
    },
    { deep: true, immediate: true }
  )
})
const roundPosition = (curYpos : number)=>{
  nTop.value = rowHeight.value * 0.1 - 4 ////////////// when click, 4 px down
}
const currentHeight = computed(()=>{
  // updategetOriginHeight();
  // console.log('origin height function');
  if(currentState.value !== props.expended){
    currentState.value = props.expended;
    originHeight.value = -1;
    // console.log('origin height changed', originHeight.value);
    bUpdateComponent.value = 1 - bUpdateComponent.value;
    setTimeout(() => {
      var contentElement = document.getElementById(barConfig.value.id);
      if(contentElement != undefined) {
        originHeight.value = contentElement.offsetHeight;
        console.log('Height changed from to, props', originHeight.value, contentElement.offsetHeight, props);
        bUpdateComponent.value = 1 - bUpdateComponent.value;
      }
    }, 30);
  }
  console.log('calc height', originHeight.value, props.customHeight);
  return Math.min(originHeight.value, props.customHeight * 0.98); 
  // return Math.min(getOriginHeight(), props.customHeight * 0.85); 
})
</script>

<style>
.g-gantt-bar {
  /* display: flex; */
  justify-content: center;
  align-items: center;
  background: cadetblue;
  overflow: hidden;
}

.g-gantt-bar-label {
  width: 100%;
  /* height: 100%; */
  box-sizing: border-box;
  padding: 10px 14px 10px 14px;
  /* 14px is the width of the handle */
  /* display: flex; */
  justify-content: center;
  align-items: center;
}

.g-gantt-bar-label>* {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.g-gantt-bar-handle-left,
.g-gantt-bar-handle-right {
  position: absolute;
  width: 10px;
  height: 100%;
  background: white;
  opacity: 0.7;
  border-radius: 0px;
  cursor: ew-resize;
  top: 0;
}

.g-gantt-bar-handle-left {
  left: 0;
}

.g-gantt-bar-handle-right {
  right: 0;
}

.g-gantt-bar-label img {
  pointer-events: none;
}

.g-gantt-bar-detail {
  width: 100%;
  /* height: 100%; */
  box-sizing: border-box;
  padding: 0 14px 0 14px;
  /* 14px is the width of the handle */
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  border-top: 0px solid gray;
}

</style>
