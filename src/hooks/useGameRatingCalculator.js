export default function useGameRatingCalculator() {
  const multipliers = {
    tieUps: {
      home: 3,
      away: 2,
    },
    leadChanges: {
      home: 3,
      away: 2,
    },
    hasGoalsInAllPeriod: 3,
    highestLeadRecovered: 3,
    penaltyTime: 0,
    clutchGoals: {
      home: 5,
      away: 3,
    },
    emptyNetGoals: {
      home: 3,
      away: 2,
    },
    hasOverTime: 3,
    hasShotOuts: 2,
    hatTricks: {
      home: 5,
      away: 3,
    },
    multiGoalPlayers: {
      home: 3,
      away: 2,
    },
    powerPlayGoals: {
      home: 2,
      away: 1,
    },
    powerPlayChances: {
      home: 2,
      away: 1,
    },
  };

  const calulateGameRate = (scoreAnalysis) => {
    let summedPoints = 0;

    // Have goals in all periods
    summedPoints +=
      scoreAnalysis.hasGoalsInAllPeriod * multipliers.hasGoalsInAllPeriod;

    // Ties Count
    summedPoints +=
      scoreAnalysis.scoringDetails.tieUps.home * multipliers.tieUps.home;
    summedPoints +=
      scoreAnalysis.scoringDetails.tieUps.away * multipliers.tieUps.away;

    // Lead Changes
    summedPoints +=
      scoreAnalysis.scoringDetails.leadChanges.home *
      multipliers.leadChanges.home;
    summedPoints +=
      scoreAnalysis.scoringDetails.leadChanges.away *
      multipliers.leadChanges.away;

    // Big Remount
    summedPoints +=
      scoreAnalysis.highestLeadRecovered * multipliers.highestLeadRecovered;

    // // Penalty Time

    // Goals in the clutch
    summedPoints +=
      scoreAnalysis.clutchGoals.home * multipliers.clutchGoals.home;
    summedPoints +=
      scoreAnalysis.clutchGoals.away * multipliers.clutchGoals.away;

    // Overtimes
    if (scoreAnalysis.hasOverTime) summedPoints += 1 * multipliers.hasOverTime;

    // Shot Outs
    if (scoreAnalysis.hasShotOuts) summedPoints += 1 * multipliers.hasShotOuts;

    // PowerPlay Goals
    summedPoints +=
      scoreAnalysis.powerPlayGoals.home * multipliers.powerPlayGoals.home;
    summedPoints +=
      scoreAnalysis.powerPlayGoals.away * multipliers.powerPlayGoals.away;

    // PowerPlay Chances
    summedPoints +=
      scoreAnalysis.powerPlayChances.home * multipliers.powerPlayChances.home;
    summedPoints +=
      scoreAnalysis.powerPlayChances.away * multipliers.powerPlayChances.away;

    // Empty Net Goals
    summedPoints +=
      scoreAnalysis.emptyNetGoals.home * multipliers.emptyNetGoals.home;
    summedPoints +=
      scoreAnalysis.emptyNetGoals.away * multipliers.emptyNetGoals.away;

    // Hat Tricks
    summedPoints += scoreAnalysis.hatTricks.home * multipliers.hatTricks.home;
    summedPoints += scoreAnalysis.hatTricks.away * multipliers.hatTricks.away;

    // Multi Goal Players
    summedPoints +=
      scoreAnalysis.multiGoalPlayers.home * multipliers.multiGoalPlayers.home;
    summedPoints +=
      scoreAnalysis.multiGoalPlayers.away * multipliers.multiGoalPlayers.away;

    return summedPoints;
  };

  return {
    calulateGameRate,
  };
}
