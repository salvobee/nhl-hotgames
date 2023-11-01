<template> 

<div class="container main mx-auto">
    
    <header>
        <div class="heading">
            <h1>NHL Hot Games</h1> 
            <h2>Lists daily games by a rating calculated on number of goals and shots on goal</h2>    
        </div>
    
        <div class="controls">

            <button v-on:click="setPreviousDay" class="day-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div class="date">
                <input class="date-select" type="date" v-model="selectedDate" v-on:change="fetchGames">
            </div>

            <button v-on:click="setNextDay" class="day-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            
        </div>

        <div class="hide">
                <input type="checkbox" id="checkbox" v-model="hiddenScores">
                <label for="checkbox">Hide Scores</label>
        </div>

        <div class="calculate">
            <button @click="performFullAnalysis" class="btn">Full Analysis</button>
        </div>

    </header>

    <main>
        <template v-if="gamesList.length > 0">
            <ul class="list">
                <li v-for="game in orderedGames" v-bind:key="game.id">
                    <MatchUp :meta="game" :hidden-scores="hiddenScores" />
                </li>
            </ul>
        </template>

        <template v-else>
            <p class="empty-state">No games on this date ...</p>
        </template>
    </main>
    </div>

</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import useNhlScheduleApi from '../hooks/useNhlScheduleApi';
import useGameScoreAnalyzer from '../hooks/useGameScoreAnalyzer';
import MatchUp from './MatchUp.vue';
import useGameRatingCalculator from '../hooks/useGameRatingCalculator';
import useGameFeatures from "../hooks/useGameFeatures";

const { getSchedule } = useNhlScheduleApi();
const { analyzeScore } = useGameScoreAnalyzer();
const { calulateGameRate } = useGameRatingCalculator()
const { extractFeatures } = useGameFeatures()


const getDefaultDate = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().slice(0,10)
}

const setNextDay = async () => {
    const nextDay = new Date(selectedDate.value)
    nextDay.setDate(nextDay.getDate() + 1)
    const dateString = nextDay.toISOString().slice(0,10)

    selectedDate.value = dateString
    await fetchGames()
}

const setPreviousDay = async () => {
    const previousDay = new Date(selectedDate.value)
    previousDay.setDate(previousDay.getDate() - 1)
    const dateString = previousDay.toISOString().slice(0,10)
    selectedDate.value = dateString
   await fetchGames()
}

const gamesList = ref([])
const hiddenScores = ref(true)
const selectedDate = ref(getDefaultDate())
const orderedGames = computed(() => gamesList.value.sort((a, b) =>
            a.points > b.points
            ? -1
            : b.points > a.points
            ? 1
            : 0
        ))

const fetchGames = async () => {
    try {
        gamesList.value = await getSchedule(selectedDate.value)
    } catch (e)
    {
        console.log(e)
    }
}

const performFullAnalysis = async () => {
    try {
        const currentList = gamesList.value
        
        currentList.map(async (item) => {
            const scoreAnalysis = await analyzeScore(item);
            const gameRating = calulateGameRate(scoreAnalysis);  
            item.points = item.points + gameRating
            item.features = extractFeatures(item, scoreAnalysis)
            item.isFullyAnalyzed = true
        });
    } catch (e) {
        console.log(e)
    }
}

onMounted(async () =>  { 
   await fetchGames()
})
</script>

<style scoped>
.main {
    @apply sm:text-xl sm:max-w-3xl
}
.heading {
    @apply my-2
}

h1 {
    @apply text-2xl text-center
}
h2 {
    @apply mt-2 text-sm text-center mx-5
}
.empty-state {
    @apply mt-5
}
/* .date-select {
    @apply text-3xl
} */

.day-btn {
    @apply bg-black text-white  rounded p-1
}

.hide {
    @apply text-center my-2
}

.hide label {
    @apply ml-2 text-sm text-gray-600
}

.controls {
    @apply mt-5 flex gap-5 justify-center items-center
}
.calculate{
    @apply w-full text-center my-5
}
.btn {
    @apply bg-black text-white px-4 py-2 text-sm
}
</style>