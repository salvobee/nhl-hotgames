import axios from "axios";

export default function useNhlGameDetailsApi() {
  const HD_LINK_KEY = "HTTP_CLOUD_WIRED_60";

  const getVideoLink = (allMedias, videoTitleKey) => {
    let highlightVideoId = "#not-available";
    let highlightVideoUrl = "#not-available";
    let highlightVideoHDlink = "#not-available";

    const filteredHighlights = allMedias.filter(
      (media) => media.title === videoTitleKey
    );

    if (filteredHighlights.length > 0) {
      const highlightsItem = filteredHighlights[0];
      const firstItem = highlightsItem.items[0];
      if (highlightsItem.items.length > 0) {
        highlightVideoId = firstItem.id;
        highlightVideoUrl = `https://www.nhl.com/video/c-${firstItem.id}`;
      }

      const playbacks = firstItem.playbacks;

      const filteredPlaybacks = playbacks.filter(
        (playback) => playback.name === HD_LINK_KEY
      );
      if (filteredPlaybacks.length > 0) {
        const firstItem = filteredPlaybacks[0];
        highlightVideoHDlink = firstItem.url;
      }

      return {
        id: highlightVideoId,
        link: highlightVideoUrl,
        url: highlightVideoHDlink,
      };
    }
  };

  const getApiUrl = (id) =>
    `https://statsapi.web.nhl.com/api/v1/game/${id}/content`;
  const getGameDetails = async (id) => {
    let condensedVideoUrl = "#not-available";

    const responseData = await (await axios.get(getApiUrl(id))).data;
    const allMedias = responseData.media.epg;

    return {
      videos: {
        highlights: getVideoLink(allMedias, "Recap"),
        condensed: getVideoLink(allMedias, "Extended Highlights"),
      },
    };
  };

  return {
    getGameDetails,
  };
}
