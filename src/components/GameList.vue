<template> 

<div class="container main mx-auto">
    
    <header>
        <div class="heading">
            <h1>NHL Hot Games</h1> 
            <h2>Lists games by a rating calculated on number of goals and shots on goal</h2>    
        </div>
    
        <div class="controls">

            <button v-on:click="setPreviousDay" class="day-btn">«</button>

            <div class="date">
                <input class="date-select" type="date" v-model="selectedDate" v-on:change="fetchGames">
            </div>

            <button v-on:click="setNextDay" class="day-btn">»</button>
            
        </div>

        <div class="hide">
                <input type="checkbox" id="checkbox" v-model="hiddenScores">
                <label for="checkbox">Hide Scores</label>
        </div>

    </header>

    <main>
        <template v-if="gamesList.length > 0">
            <ul class="list">
                <li class="matchup" v-for="game in gamesList">
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
import { onMounted, ref } from 'vue';
import useNhlScheduleApi from '../hooks/useNhlScheduleApi';
import MatchUp from './MatchUp.vue';

const { getSchedule } = useNhlScheduleApi();

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

const fetchGames = async () => {
    try {
        gamesList.value = await getSchedule(selectedDate.value)
    } catch (e)
    {
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
.day-btn, .date-select {
    @apply text-3xl
}

.day-btn {
    @apply bg-black text-white p-3 rounded
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

.matchup {
     @apply border-b-2
}
</style>