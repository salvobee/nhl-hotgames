<template>
    <span class="team">
        <span class="name">{{ team.name }}</span> 
    
        <span class="scoring">
            <span class="goals scoring-stat" :class="[scoreClass]">{{ hide ? '-' : team.goals }}</span>
            <span class="sog scoring-stat"  :class="[scoreClass]">{{ hide ? '-' : team.sog }}</span>
        </span>
    </span>
</template>

<script setup>
    import { computed } from 'vue';
const props = defineProps([
    'team', 'hide', 'wins'
])

const scoreClass = computed(() => props.wins && !props.hide ? 'text-yellow-500' : 'text-white')
</script>

<style scoped>

.team {
    @apply flex my-6 items-center
}

.name {
    @apply w-4/6 
}

.scoring {
     @apply w-2/6
}

.scoring-stat {
    @apply mx-2
}

.goals {
    @apply max-w-max font-bold bg-black py-2 px-3 border-4 border-white
}

.sog {
    @apply text-gray-400 text-xs align-middle mx-1
}
</style>