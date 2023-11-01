<template>
    <span class="card">
        <span class="matchup">
            <span class="teams">
                <Team 
                    :team="meta.home" 
                    :hide="hiddenScores" 
                    :wins="meta.home.goals > meta.away.goals" 
                />
                <Team 
                    :team="meta.away" 
                    :hide="hiddenScores"
                    :wins="meta.away.goals > meta.home.goals" 
                />
            </span>      
            <RatingBox :is-calculating="meta.isCalculating" :points="meta.points" />
        </span>

      <GameDetails :game-details="meta" />
        
    </span>
</template>

<script setup>
import useNhlGameMediaApi from '../hooks/useNhlGameMediaApi';
import Team from './Team.vue';
import RatingBox from './RatingBox.vue';
import GameDetails from "./GameDetails.vue";
const props = defineProps([
    'meta', 'hiddenScores'
])

const copyLink = (e, videoData) => {

    try {
        navigator.clipboard.writeText(videoData.url)
        e.target.classList.add('text-green-300')
        setTimeout(() => {
           e.target.classList.remove('text-green-300')
        }, 1000)
    } catch(e) 
    {
        console.log(e)
    }
    
}

</script>

<style scoped>
.card { 
    @apply 
    flex flex-col
        rounded-xl  border
        my-5 mx-2;
}
.matchup {
    @apply px-2 w-full flex justify-start items-center gap-1
}
.teams { 
    @apply mx-2 w-9/12 text-left leading-4
}
</style>