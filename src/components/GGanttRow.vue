<template>
  <div class="g-gantt-row" :style="rowStyle" :locationid="`${locationid}`" @dragover.prevent="isHovering = true"
    @dragleave="isHovering = false" @drop="onDrop($event, rowid + 1)" @mouseover="isHovering = true"
    @mouseleave="isHovering = false">
    <div class="g-gantt-row-label" :style="{ background: colors.primary, color: colors.text }">
      <CToggleButton :custom-handle="toggle" />
      <div @click="$event => onLabelClick($event, rowid + 1, label)" class="labelButton" draggable="true"
        @dragstart="handleDragStart($event, rowid + 1, label)">
        <slot name="label">
          {{ label }}
        </slot>
      </div>
    </div>
    <div ref="barContainer" class="g-gantt-row-bars-container" v-bind="$attrs">
      <transition-group name="bar-transition" tag="div">
        <g-gantt-bar v-for="bar in bars" :key="bar.ganttBarConfig.id" :bar="bar" :expended="expended">
          <!-- <slot :name="`simple-${bar.ganttBarConfig.id}`" /> -->
          <slot :name="`simple-${bar.ganttBarConfig.id}`" v-if="!expended" />
          <slot :name="`${bar.ganttBarConfig.id}`" v-if="expended" />
          <!-- {{ bar.ganttBarConfig.id }} -->
        </g-gantt-bar>
      </transition-group>
    </div>
    <div class="g-gantt-row-handle-bottom" @mousedown="onMouseEvent" @mousemove="onMouseEvent" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, toRefs, computed, type StyleValue, provide, inject } from "vue"

import useTimePositionMapping from "../composables/useTimePositionMapping.js"
import provideConfig from "../provider/provideConfig.js"
import type { GanttBarObject } from "../types"
import GGanttBar from "./GGanttBar.vue"
import { BAR_CONTAINER_KEY } from "../provider/symbols"
import CToggleButton from './CToggleButton.vue';
import { GanttEventBus } from "./EventBus"


const props = defineProps<{
  label: string,
  locationid: string,
  bars: GanttBarObject[]
  highlightOnHover?: boolean,
  rowid: number
}>()

const emit = defineEmits<{
  (e: "drop", value: { e: MouseEvent; datetime: string | Date }): void
}>()

const { rowHeight, colors } = provideConfig()
const { highlightOnHover } = toRefs(props)
const isHovering = ref(false)
const customHeight = ref(rowHeight.value)
const expended = ref(false)
const clickedRowBottom = ref(false)
const rowStyle = computed(() => {
  return {
    height: `${customHeight.value}px`,
    background: highlightOnHover?.value && isHovering.value ? colors.value.hoverHighlight : null,
  } as StyleValue
})

const { mapPositionToTime } = useTimePositionMapping()
const barContainer: Ref<HTMLElement | null> = ref(null)

provide(BAR_CONTAINER_KEY, barContainer)

const containerRect = ref(barContainer.value?.getBoundingClientRect())

const onDrop = (e: any, rowIdNew: any) => {//MouseEvent
  // console.log('droped', e);
  e.preventDefault();

  const dataTransfer = e.dataTransfer.getData("text/plain")
  const { rowid, label } = JSON.parse(dataTransfer);
  if (rowid && label) {
    console.log("rowid", rowid, label)
    GanttEventBus.emit('drop-row-label', {
      locationid: rowid,
      label: label,
      inputLocationid: rowIdNew,
      inputValue: label,
    })
    return
  }

  const container = barContainer.value?.getBoundingClientRect()
  if (!container) {
    console.error("Vue-Ganttastic: failed to find bar container element for row.")
    return
  }
  const xPos = e.clientX - container.left
  const datetime = mapPositionToTime(xPos)
  emit("drop", { e, datetime })
}

const toggle = (isOpen: boolean) => {
  // console.log('isOpen', isOpen.value)
  if (isOpen) {
    // customHeight.value = 90
    customHeight.value = rowHeight.value * 3
    expended.value = true

  } else {
    // console.log('closed')
    customHeight.value = rowHeight.value
    expended.value = false
  }

}
const onLabelClick = (e: Event, rowid: any, label: any) => {
  e.preventDefault()
  console.log('label event', e, rowid, label)
  GanttEventBus.emit('click-row-label', { rowid, label })
}

const handleDragStart = (e: any, rowid: any, label: any) => {
  let jsonstring = JSON.stringify({ rowid, label });
  e.dataTransfer.setData("text/plain", jsonstring);
  // console.log('drop started');
}
const handleEventBus = (event: any, payload: boolean) => {
  if (event == "custom-expend-rows") {
    console.log('custom-expend-rows', payload)
    toggle(payload)
  }
}

GanttEventBus.on(handleEventBus);

function firstMousemoveCallback(e: MouseEvent) {
  if (!clickedRowBottom.value) {
    // console.log('clickedRowBottom', clickedRowBottom.value)
    return
  }
  // console.log('bar Container')
  const container = containerRect.value
  if (!container) {
    console.error("Vue-Ganttastic: failed to find bar container element for row.")
    return
  }
  customHeight.value = Math.max(e.clientY - container.top, rowHeight.value)
  // console.log('custom height', customHeight, containerRect)
  console.log('custom height', customHeight.value)
}

const prepareForDrag = () => {
  clickedRowBottom.value = true
  containerRect.value = barContainer.value?.getBoundingClientRect()
  if (!containerRect.value) {
    console.error("Vue-Ganttastic: failed to find bar container element for row.")
    return
  }
  console.log('custom height', customHeight, containerRect.value)

  window.addEventListener("mousemove", firstMousemoveCallback, {
    once: false
  }) // on first mousemove event
  window.addEventListener(
    "mouseup",
    () => {
      window.removeEventListener("mousemove", firstMousemoveCallback)
      clickedRowBottom.value = false;
      console.log('canceled bottom click')
    },
    { once: true }
  )
}
const onMouseEvent = (e: MouseEvent) => {
  e.preventDefault()
  // console.log('mouse event', e.type)
  if (e.type === "mousedown") {
    prepareForDrag()
    return
  }
  // if(e.type === "mousemove") {
  //   if(!clickedRowBottom.value){
  //     // console.log('clickedRowBottom', clickedRowBottom.value)
  //     return
  //   }
  //   console.log('bar Container')
  //   const container = containerRect.value
  //   if (!container) {
  //     console.error("Vue-Ganttastic: failed to find bar container element for row.")
  //     return
  //   }
  //   customHeight.value = Math.max(e.clientY - container.top, rowHeight.value)
  //   // console.log('custom height', customHeight, containerRect)

  //   return
  // }
}
</script>

<style>
.g-gantt-row {
  width: 100%;
  transition: background 0.4s;
  position: relative;
  /* overflow: hidden; */
  padding-bottom: 10px;
}

.g-gantt-row>.g-gantt-row-bars-container {
  position: relative;
  border-top: 1px solid #eaeaea;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
}

.g-gantt-row-label {
  position: absolute;
  top: 0;
  left: 0px;
  padding: 0px 10px 0px 30px;
  display: flex;
  align-items: center;
  height: 60%;
  min-height: 20px;
  font-size: 0.8em;
  font-weight: bold;
  border-bottom-right-radius: 6px;
  background: #f2f2f2;
  z-index: 3;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.6);
}

.bar-transition-leave-active,
.bar-transition-enter-active {
  transition: all 0.2s;
}

.bar-transition-enter-from,
.bar-transition-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.labelButton {
  cursor: pointer;
}

.g-gantt-row-handle-bottom {
  position: absolute;
  width: 100%;
  height: 10px;
  background: white;
  opacity: 0.7;
  border-radius: 0px;
  cursor: ns-resize;
  bottom: 0px;
  padding-bottom: 5px;
}
</style>
