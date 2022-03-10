<template>
    <span class="team">
        <span class="name">{{ team.name }}</span> 
    
        <span class="scoring" :class="{ 'hidden': hide }">
            <span class="goals scoring-stat">{{ team.goals }}</span>
            <span class="sog scoring-stat">{{ team.sog }}</span>
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
    display: block; text-align: left
}


.hidden {
    color: white;
}
.scoring,  .scoring-stat {
    margin-left: 0.5em;
}

.goals {
    font-size: 2em;
}

.sog {
    opacity: 0.5;
}
</style>