<template>
    <span class="team">
        <span class="name">{{ team.name }}</span> 
    
        <span class="scoring">
            <span class="goals scoring-stat">{{ hide ? '-' : team.goals }}</span>
            <span class="sog scoring-stat">{{ hide ? '-' : team.sog }}</span>
        </span>
    </span>
</template>

<script setup>
defineProps([
    'team', 'hide'
])
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
    @apply font-bold text-white bg-black py-2 px-3
}

.sog {
    @apply text-gray-400 text-xs align-middle
}
</style>