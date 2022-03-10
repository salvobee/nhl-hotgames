<template>
<span class="container">
<span class="teams">
    
    <Team :team="meta.home" :hide="hiddenScores" />
    <Team :team="meta.away" :hide="hiddenScores" />
    </span>
    <span class="rating">
        {{ meta.total.gamePoints }}
    </span>
    </span>

</template>

<script setup>
import Team from './Team.vue';
defineProps([
    'meta', 'hiddenScores'
])
</script>

<style scoped>
.container { 
    display: block;
    clear: both;
    margin: 1em
}
.teams { float: left }
.rating { float: right; font-size: 5em }
</style>