import axios from "axios";

export default function useNhlScheduleApi() {
  const API_URL =
    "https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.linescore";
  const GOAL_POINTS_MULTIPLIER = 5;
  const SOG_POINTS_MULTIPLIER = 0.75;

  const getSchedule = async (date) => {
    // const dateString = `${date.getFullYear()}-${
    //   date.getMonth() + 1
    // }-${date.getDate()}`;
    const responseData = await (
      await axios.get(`${API_URL}&date=${date}`)
    ).data;

    const games = responseData.dates[0].games;

    const calculateIdleTime = (period) => {
      const start = new Date(period.startTime);
      const end = new Date(period.endTime);
      console.log("start", start);
      console.log("end", end);
      const diff = start.getTime() - end.getTime();

      return diff / 1000;
    };

    return games
      .filter((gameData) => gameData.status.codedGameState !== "1")
      .map((gameData) => {
        return {
          id: gameData.gamePk,
          watchLink: `https://www.nhl.com/tv/${gameData.gamePk}`,
          away: {
            name: gameData.teams.away.team.name,
            goals: gameData.linescore.teams.away.goals,
            sog: gameData.linescore.teams.away.shotsOnGoal,
          },
          home: {
            name: gameData.teams.home.team.name,
            goals: gameData.linescore.teams.home.goals,
            sog: gameData.linescore.teams.home.shotsOnGoal,
          },
          total: {
            goals: gameData.teams.away.score + gameData.teams.home.score,
            shotsOnGoal:
              gameData.linescore.teams.away.shotsOnGoal +
              gameData.linescore.teams.home.shotsOnGoal,
            gamePoints: Math.ceil(
              gameData.teams.away.score * GOAL_POINTS_MULTIPLIER +
                gameData.teams.home.score * GOAL_POINTS_MULTIPLIER +
                gameData.linescore.teams.away.shotsOnGoal *
                  SOG_POINTS_MULTIPLIER +
                gameData.linescore.teams.home.shotsOnGoal *
                  SOG_POINTS_MULTIPLIER
            ),
          },
          periods: {
            first: {
              goals:
                gameData.linescore.periods[0].away.goals +
                gameData.linescore.periods[0].home.goals,
              sog:
                gameData.linescore.periods[0].away.shotsOnGoal +
                gameData.linescore.periods[0].home.shotsOnGoal,
              //   idle_time: calculateIdleTime(gameData.linescore.periods[0]),
            },
            second: {
              goals:
                gameData.linescore.periods[1].away.goals +
                gameData.linescore.periods[1].home.goals,
              sog:
                gameData.linescore.periods[1].away.shotsOnGoal +
                gameData.linescore.periods[1].home.shotsOnGoal,
              //   idle_time: calculateIdleTime(gameData.linescore.periods[0]),
            },
            third: {
              goals:
                gameData.linescore.periods[2].away.goals +
                gameData.linescore.periods[2].home.goals,
              sog:
                gameData.linescore.periods[2].away.shotsOnGoal +
                gameData.linescore.periods[2].home.shotsOnGoal,
              //   idle_time: calculateIdleTime(gameData.linescore.periods[0]),
            },
          },
        };
      })
      .sort((a, b) =>
        a.total.gamePoints > b.total.gamePoints
          ? -1
          : b.total.gamePoints > a.total.gamePoints
          ? 1
          : 0
      );
  };

  return {
    getSchedule,
  };
}
