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
        
        <span class="morebox">
            <span class="watchbox" :class="watchBoxDisplayClass">
                <span class="watchlinkbox">
                    <button @click="openLink(meta.watchLink)" class="watchlink">
                            <svg xmlns="http://www.w3.org/2000/svg" class="watchicon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Watch
                    </button>
                </span>

                <span class="watchlinkbox">
                    <button  @click="openLink(highlightsVideoData.link)" class="watchlink">
                        <svg xmlns="http://www.w3.org/2000/svg" class="watchicon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Highlights
                    </button>

                    <button class="copylink" @click="copyLink($event, highlightsVideoData)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>             
                </span>

                <span class="watchlinkbox">
                    <button  @click="openLink(condensedVideoData.link)" class="watchlink">
                        <svg xmlns="http://www.w3.org/2000/svg" class="watchicon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Condensed
                    </button>

                    <button class="copylink" @click="copyLink($event, condensedVideoData)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                </span>
            </span>

            <button @click="showDetails" class="more">
                <template v-if="displayDetail">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                    </svg>
                </template>

                <template v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                    </svg>
                </template>
            </button>
        </span>
        
    </span>
</template>

<script setup>
import useNhlGameMediaApi from '../hooks/useNhlGameMediaApi';
import Team from './Team.vue';
import RatingBox from './RatingBox.vue';
import { computed, ref } from 'vue';
const props = defineProps([
    'meta', 'hiddenScores'
])

const { getGameDetails } = useNhlGameMediaApi()

const highlightsVideoData = ref('#');
const condensedVideoData = ref('#');
const displayDetail = ref(false);

const openLink = (videoLink) => { 
    window.open(videoLink, 'NHL Hot Game', 'width=1280, height=720') 
}

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

const showDetails = async () => {
    try {
        if (!displayDetail.value) {
            const gameData = await getGameDetails(props.meta.id);
            highlightsVideoData.value = gameData.videos.highlights
            condensedVideoData.value = gameData.videos.condensed
            displayDetail.value = true
        } else {
            displayDetail.value = false
        }
        
    } catch (e) 
    {
        console.log(e)
    }
}

const watchBoxDisplayClass = computed(() => 
    displayDetail.value ?
        'grid' : 'hidden'
)
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
.morebox {
    @apply  border-t transition-all ease-in-out duration-150
}
.more {
    @apply 
    flex justify-center items-center 
    w-full py-2 text-center
    text-gray-400
    cursor-pointer
}
.watchbox {
    @apply px-5 py-2 
    justify-center
    grid-cols-3 divide-x
     text-sm uppercase text-gray-400
}
.watchicon {
    @apply mr-1 w-6 h-6 text-center w-full
}
.watchlink {
    @apply w-full flex-row items-center justify-center uppercase
}

.watchlinkbox {
    @apply flex justify-center w-full align-middle text-center
}
.copylink {
    @apply hidden sm:block text-gray-100 float-right m-1.5 transition-all ease-in-out duration-150
}
</style>