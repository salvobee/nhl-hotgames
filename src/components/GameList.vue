<template> 

<h1>NHL Games listed by number of goals plus shots</h1>

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
.empty-state {
    margin-top: 5em
}
.day-btn, .date-select {
    font-size: 2em;
}

.day-btn {
    background: transparent;
    border: none;
    cursor: pointer;
}

.date-select {
    font-family: Arial, Helvetica, sans-serif;
    padding: 5px
}

.controls {
    display:flex;
    gap: 2em;
    justify-content: center;
    align-items: center;
    margin: 2em 0;
}

.list {
    list-style: none;
    font-size: 1.5em
}
.matchup {
     border-top: 1px solid gray
}
</style>