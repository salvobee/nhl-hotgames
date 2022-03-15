import useNhlGameFeedApi from "./useNhlGameFeedApi";

export default function useGameScoreAnalyzer() {
  const { getGameData } = useNhlGameFeedApi();

  const analyzeScore = async (gameInfo) => {
    try {
      const gameData = await getGameData(gameInfo.id);
      const goalDetails = getGoalDetails(gameData);
      const scoringProgress = countLeadChanges(goalDetails);

      const analysis = {
        goalDetails,
        tieUps: scoringProgress.tieUps.home + scoringProgress.tieUps.away,
        leadChanges:
          scoringProgress.leadChanges.home + scoringProgress.leadChanges.away,
        scoringDetails: scoringProgress,
        hasGoalsInAllPeriod: checkIfHasGoalsInAllPeriod(goalDetails),
        highestLeadRecovered: measureHighestLeadRecovery(goalDetails),
        penaltyTime: countPenaltyTime(gameData),
        clutchGoals: countClutchGoals(goalDetails),
        emptyNetGoals: countEmptyNetGoals(goalDetails),
        hasOverTime: checkOvertime(gameData),
        hasShotOuts: checkShootOut(gameData),
        hatTricks: countMultiGoalPlayers(goalDetails, 3),
        multiGoalPlayers: countMultiGoalPlayers(goalDetails, 2, 2),
        powerPlayGoals: countPowerPlayGoals(gameData),
        powerPlayChances: countPowerPlayChances(gameData),
      };

      gameInfo.isCalculating = false;
      // console.log(analysis);
      return analysis;
    } catch (e) {
      console.log(e);
    }
  };

  const measureHighestLeadRecovery = (goalDetails) => {
    let highestLeadRecovered = 0;
    let isTiedUp = true;
    let currentLeading = null;
    let currentDown = null;
    let previousLeading = null;
    let previousDown = null;
    let recovered = {
      away: 0,
      home: 0,
    };

    goalDetails.forEach((event) => {
      isTiedUp = event.score.home === event.score.away;

      currentLeading = event.score.home > event.score.away ? "home" : "away";
      currentDown = currentLeading === "home" ? "away" : "home";

      previousLeading = currentLeading;
      previousDown = currentDown;

      const scoringTeam = event.team;
      const otherTeam = scoringTeam === "home" ? "away" : "home";

      const scoringTeamLeadOffset =
        event.score[scoringTeam] - event.score[otherTeam];

      // if the scoring team is loosing or has tied the game means that has recovered a goal
      if (scoringTeamLeadOffset <= 0) {
        recovered[scoringTeam]++;
      }

      // if the game is tied up
      if (event.score.home === event.score.away) {
        if (recovered[scoringTeam] > highestLeadRecovered) {
          highestLeadRecovered = recovered[scoringTeam];
        }
        recovered = {
          home: 0,
          away: 0,
        };
      }
    });

    return highestLeadRecovered;
  };
  const checkOvertime = (gameData) => {
    return gameData.liveData.linescore.periods.length > 3;
  };
  const countPowerPlayGoals = (gameData) => {
    return {
      home: gameData.liveData.boxscore.teams.home.teamStats.teamSkaterStats
        .powerPlayGoals,
      away: gameData.liveData.boxscore.teams.away.teamStats.teamSkaterStats
        .powerPlayGoals,
    };
  };
  const countPowerPlayChances = (gameData) => {
    return {
      home: gameData.liveData.boxscore.teams.home.teamStats.teamSkaterStats
        .powerPlayOpportunities,
      away: gameData.liveData.boxscore.teams.away.teamStats.teamSkaterStats
        .powerPlayOpportunities,
    };
  };
  const checkShootOut = (gameData) => {
    return gameData.liveData.linescore.hasShootout;
  };
  const checkIfHasGoalsInAllPeriod = (goalDetails) => {
    const periods = new Set(goalDetails.map((item) => item.period));
    return periods.has(1) && periods.has(2) && periods.has(3);
  };
  const countLeadChanges = (goalDetails) => {
    let leadChanges = { away: 0, home: 0 };
    let tieUps = { away: 0, home: 0 };
    let lastLead = null;
    let currentLead = null;
    let isTiedUp = true;

    goalDetails.forEach((event) => {
      if (event.period !== 5) {
        const scoringTeam = event.team;
        isTiedUp = event.score.home === event.score.away;

        if (isTiedUp) {
          currentLead = null;
          tieUps[scoringTeam]++;
        } else {
          currentLead = event.score.home > event.score.away ? "home" : "away";

          if (
            currentLead !== lastLead &&
            event.score.home + event.score.away > 1
          ) {
            leadChanges[currentLead]++;
          }
        }

        lastLead = currentLead;
      }
    });

    return { tieUps, leadChanges };
  };
  const countEmptyNetGoals = (goalDetails) => {
    let emptyNetGoals = {
      home: 0,
      away: 0,
    };

    const filteredGoals = goalDetails.filter(
      (event) => event.emptyNet === true
    );

    filteredGoals.forEach((goalData) => {
      emptyNetGoals[goalData.team]++;
    });

    return emptyNetGoals;
  };
  const countClutchGoals = (goalDetails) => {
    let clutchGoals = {
      home: 0,
      away: 0,
    };

    const filteredGoals = goalDetails.filter((event) => {
      const scoringTeam = event.team;
      const otherTeam = scoringTeam === "home" ? "away" : "home";
      const scoreOffset = event.score[scoringTeam] - event.score[otherTeam];
      const isClutchTime =
        event.periodTimeRemaining <= 300 && event.period === 3;
      const itTiesGame = event.score.home == event.score.away;
      const itBreaksTies = scoreOffset === 1;

      // console.log({
      //   periodTimeStampRemaining: event.periodTimeRemaining,
      //   isClutchTime,
      //   itTiesGame,
      //   itBreaksTies,
      // });

      return isClutchTime && (itTiesGame || itBreaksTies);
    });

    filteredGoals.forEach((goalData) => {
      clutchGoals[goalData.team]++;
    });

    return clutchGoals;
  };
  const countPenaltyTime = (gameData) => {
    return {
      home: gameData.liveData.boxscore.teams.home.teamStats.teamSkaterStats.pim,
      away: gameData.liveData.boxscore.teams.away.teamStats.teamSkaterStats.pim,
    };
  };

  const countMultiGoalPlayers = (goalDetails, minGoals, maxGoals = null) => {
    let hatTrickCounts = {
      home: 0,
      away: 0,
    };

    const scorers = new Map();

    goalDetails.forEach((goalDetail) => {
      const scorerKey = `${goalDetail.team}|${goalDetail.player}`;
      if (scorers.has(scorerKey)) {
        let currentGoals = scorers.get(scorerKey);
        currentGoals++;
        scorers.set(scorerKey, currentGoals);
      } else {
        scorers.set(scorerKey, 1);
      }
    });

    scorers.forEach((golCount, scorerKey) => {
      const checkMaxGoals = maxGoals ? golCount <= maxGoals : true;
      if (golCount >= minGoals && checkMaxGoals) {
        hatTrickCounts[scorerKey.split("|")[0]]++;
      }
    });

    return hatTrickCounts;
  };
  const getGoalDetails = (responseData) => {
    const gameData = responseData.gameData;
    const liveData = responseData.liveData;

    const homeTeamId = gameData.teams.home.id;
    const awayTeamId = gameData.teams.away.id;

    const allGoals = liveData.plays.allPlays.filter(
      (event) => event.result.event === "Goal"
    );

    return allGoals.map((event) => {
      const playerName = getScorerName(event);

      return {
        id: event.about.eventIdx,
        period: event.about.period,
        periodTime: getSecondsFromTimestamp(event.about.periodTime),
        periodTimeStamp: event.about.periodTime,
        periodTimeRemaining: getSecondsFromTimestamp(
          event.about.periodTimeRemaining
        ),
        periodTimeStampRemaining: event.about.periodTimeRemaining,
        strenght: event.result.strength?.code,
        team: event.team.id === homeTeamId ? "home" : "away",
        player: playerName,
        score: event.about.goals,
        emptyNet: event.result.emptyNet,
      };
    });
  };
  const getScorerName = (event) => {
    const filteredPlayers = event.players.filter(
      (item) => item.playerType === "Scorer"
    );
    return filteredPlayers[0].player.fullName;
  };
  const getSecondsFromTimestamp = (timestamp) => {
    const [minutes, seconds] = timestamp.split(":");
    return parseInt(seconds) + parseInt(minutes) * 60;
  };

  return {
    analyzeScore,
  };
}
