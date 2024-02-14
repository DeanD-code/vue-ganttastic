<template>
    <div class="toggle-container">
        <button @click="onClickHandler" class="toggle-button">
            {{ toggleSymbol }}
        </button>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed} from 'vue'

const props = defineProps<{
    customHandle: Function,
}>()

const isOpen = ref(false)
const onClickHandler = (e: MouseEvent) => {
    isOpen.value = !isOpen.value
    props.customHandle(isOpen.value)
}

const toggleSymbol = computed(() => isOpen.value ? '-' : '+')
</script>
  
<style>
.toggle-container {
    position: absolute;
    z-index: 10;
    background: transparent;
    top: 0;
    left: 0;
}

.toggle-button {
   background: transparent;
   cursor: pointer;
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: black;
    font-size: 20px;
    font-weight: 300;
    border-radius: 5px;
    border: 0px solid gray;
}
</style>
  
  