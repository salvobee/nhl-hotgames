import axios from "axios";

export default function useNhlGameFeedApi() {
  const getApiUrl = (id) =>
    `https://statsapi.web.nhl.com/api/v1/game/${id}/feed/live`;

  const getGameData = async (id) => {
    return await (
      await axios.get(getApiUrl(id))
    ).data;
  };

  return {
    getGameData,
  };
}
