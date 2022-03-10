<template>
    <span class="container">
        <span class="teams">
            <Team :team="meta.home" :hide="hiddenScores" />
            <Team :team="meta.away" :hide="hiddenScores" />
        </span>
        
        <RatingBox :points="meta.total.gamePoints" />
    </span>
</template>

<script setup>
import Team from './Team.vue';
import RatingBox from './RatingBox.vue';
defineProps([
    'meta', 'hiddenScores'
])
</script>

<style scoped>
.container { 
    @apply flex justify-start items-center gap-1
}
.teams { 
    @apply ml-2 w-8/12 text-left leading-4
}
</style>