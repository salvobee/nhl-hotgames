export default function useGameFeatures() {
    const extractFeatures = (gameInfo, scoreAnalysis) => {
        const features = [];

        // Verifica se la partita ha goal in tutti i periodi
        if (scoreAnalysis.hasGoalsInAllPeriod) {
            features.push("Has goals in all periods");
        }

        // Verifica se ci sono più di 3 goal in powerplay
        const powerPlayGoals = scoreAnalysis.powerPlayGoals.home + scoreAnalysis.powerPlayGoals.away;
        if (powerPlayGoals > 3) {
            features.push("More than 3 powerplay goals");
        }

        // Verifica se ci sono goal di pareggio o vittoria negli ultimi minuti di gioco
        if (scoreAnalysis.clutchGoals.home > 0 || scoreAnalysis.clutchGoals.away > 0) {
            features.push("Tie/win goals in last minutes of the game");
        }

        // Verifica se c'è stata una rimonta da parte di una delle squadre
        if (scoreAnalysis.highestLeadRecovered > 0) {
            features.push("Comeback win by one of the teams");
        }

        // Verifica se ci sono overtime
        if (scoreAnalysis.hasOverTime) {
            features.push("Has Overtime");
        }

        // Verifica se ci sono shootout
        if (scoreAnalysis.hasShotOuts) {
            features.push("Has Shootout");
        }

        // Verifica se ci sono Hat Tricks o giocatori con più di 2 goal
        if (scoreAnalysis.hatTricks.home > 0 || scoreAnalysis.hatTricks.away > 0 || scoreAnalysis.multiGoalPlayers.home > 0 || scoreAnalysis.multiGoalPlayers.away > 0) {
            features.push("Hat Tricks or multi-goal players");
        }

        // Verifica se il portiere ha effettuato più di 35 parate con pochi goal subiti
        const homeSaves = gameInfo.home.sog - gameInfo.home.goals;
        const awaySaves = gameInfo.away.sog - gameInfo.away.goals;
        if (homeSaves > 35 || awaySaves > 35) {
            features.push("Great goalie performance");
        }

        return features;
    }

    return { extractFeatures }
}