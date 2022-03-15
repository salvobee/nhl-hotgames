
<script setup>
    import { computed } from 'vue';

    const props = defineProps(['points', 'isCalculating'])
    const alignmentClasses = computed(() => {
    if (props.points >= 100) {
        return 'bg-gray-500 text-white';
    } else if (props.points >= 90) {
        return 'bg-gray-300 text-gray-700';
    } else if (props.points >= 80) {
        return 'bg-gray-200 text-gray-500';
    } else if (props.points >= 70) {
        return 'bg-gray-100 text-gray-400';
    } else {    
        return 'bg-gray-50 text-gray-300';
    }
});
</script>

<template>
    <span class="rating" :class="[alignmentClasses]">
        <template v-if="isCalculating">
            ...
        </template>
        <template v-else>
            {{ points }}
        </template>
    </span>
</template>

<style scoped>
.rating { 
    @apply rounded-md w-3/12 mr-2 text-center text-4xl py-5
 }
 </style>