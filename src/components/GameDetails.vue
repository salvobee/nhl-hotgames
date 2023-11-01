<template>
  <span class="morebox">
      <span class="features" :class="detailsDisplayClass">
        <p v-if="!gameDetails.isFullyAnalyzed">
          Perform full analysis to list game features
        </p>

        <ul v-if="gameDetails.isFullyAnalyzed">
          <li v-for="feature in gameDetails.features">
            <span>🏒</span> <span>{{ feature }}</span>
          </li>
        </ul>
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
</template>

<script setup>
import {computed, ref} from "vue";

const props = defineProps(['gameDetails'])

const displayDetail = ref(false);

const detailsDisplayClass = computed(() =>
    displayDetail.value ?
        'grid' : 'hidden'
)


const showDetails = async () => {
  try {
    if (!displayDetail.value) {
      //const gameData = await getGameDetails(props.meta.id);
      //highlightsVideoData.value = gameData.videos.highlights
      //condensedVideoData.value = gameData.videos.condensed
      displayDetail.value = true
    } else {
      displayDetail.value = false
    }

  } catch (e)
  {
    console.log(e)
  }
}
</script>

<style scoped>
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
.features {
  @apply p-5
    w-full
  justify-center
  text-sm uppercase text-gray-400
}
.features ul li {
  @apply py-1
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