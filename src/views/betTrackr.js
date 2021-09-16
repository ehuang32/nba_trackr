// Libraries
import React from 'react';
import axios from 'axios';
import { Select, Button } from 'antd';
import { AwesomeButton } from 'react-awesome-button';

// Components
import Content from '../components/content.js';
import Subcontent from '../components/subcontent.js'
import BoxScore from '../components/boxscore.js';
import LoadingScreen from '../components/loading.js';
import Scoreboard from '../components/scoreboard.js';

// CSS
import 'antd/dist/antd.css';
import '../css/table.css';
import "../css/awesomebutton.css";
import "../css/trackr.css";

class BetTrackr extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            todaysScoreboards: null,
            todaysDate: "",
            todaysGames: null,
            todaysPlayers: null,
            todaysPbp: null,
            newPbp: null,
            trackedPlayers: [],
            inputPlayer: "",
            betPlayerName: "",
            betPlayerStat: "",
            betPlayerLine: "",
            betPlayerOU: "",
            trackedBets: [],
            betTeamName: "",
            betTeamBet: "",
            betTeamLine: "",
            betTeamOUMP: "",
            trackedTeamBets: [],
            intervalID: 0
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleTrackPlayer = this.handleTrackPlayer.bind(this);
        this.removeTrackPlayer = this.removeTrackPlayer.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.handleTrackBet = this.handleTrackBet.bind(this);
        this.removeTrackBet = this.removeTrackBet.bind(this);
        this.handleTrackTeamBet = this.handleTrackTeamBet.bind(this);
        this.removeTrackTeamBet = this.removeTrackTeamBet.bind(this);
    }

    componentDidMount() {
        axios.get(`https://data.nba.net/10s/prod/v1/today.json`)
            .then(t_response => {
                var date = t_response.data.links.anchorDate
                date = "20210528"
                axios.get(`https://data.nba.net/10s/prod/v1/${date}/scoreboard.json`)
                    .then(g_response => {
                        var all_gameIds = []
                        var all_gameBS = []
                        var all_players = []
                        var all_pbp = []
                        var promises = []
                        if (g_response.data.games.length === 0) {
                            this.setState({
                                todaysPlayers: all_players,
                                todaysGames: all_gameIds,
                                todaysScoreboards: all_gameBS,
                                todaysDate: date,
                                todaysPbp: all_pbp
                            })
                        } else {
                            g_response.data.games.forEach((game, key) => {
                                all_gameIds.push(game.gameId)
                                var teamIds = []
                                var game_pbp = []
                                game_pbp.push(game.vTeam.triCode.concat(" vs ", game.hTeam.triCode))
                                promises.push(
                                    axios.get(`https://data.nba.net/10s/prod/v1/${date}/${game.gameId}_boxscore.json`)
                                        .then(bs_response => {
                                            all_gameBS.push(bs_response.data);
                                            if ("stats" in bs_response.data) {
                                                bs_response.data.stats.activePlayers.forEach((player, key2) => {
                                                    all_players.push(player.firstName.concat(" ", player.lastName))
                                                })
                                            } else {
                                                teamIds.push(bs_response.data.basicGameData.vTeam.teamId)
                                                teamIds.push(bs_response.data.basicGameData.hTeam.teamId)
                                            }
                                        })
                                        .catch(error => { console.log(error) })
                                )
                                for (let i = 1; i < 5; i++) {
                                    promises.push(
                                        axios.get(`https://data.nba.net/10s/prod/v1/${date}/${game.gameId}_pbp_${i}.json`)
                                            .then(pbp_response => {
                                                game_pbp.push({ q_num: i, q_data: pbp_response.data });
                                            })
                                            .catch(error => { console.log(error) })
                                    )
                                }
                                Promise.all(promises).then(() => {
                                    all_pbp.push(game_pbp)
                                    let playerIds = []
                                    let promises2 = []
                                    teamIds.forEach(teamId => {
                                        promises2.push(
                                            // Get all of team's player ids
                                            axios.get(`https://data.nba.net/10s/prod/v1/${t_response.data.seasonScheduleYear}/teams/${teamId}/roster.json`)
                                                .then(team_response => {
                                                    team_response.data.league.standard.players.forEach(player => {
                                                        playerIds.push(player.personId)
                                                    })
                                                })
                                                .catch(error => { console.log(error) })
                                        )
                                    })
                                    Promise.all(promises2).then(() => {
                                        // Get all players in the NBA
                                        axios.get(`https://data.nba.net/prod/v1/${t_response.data.seasonScheduleYear}/players.json`)
                                            .then(players_response => {
                                                players_response.data.league.standard.forEach(player => {
                                                    if (playerIds.includes(player.personId)) {
                                                        all_players.push(player.firstName.concat(" ", player.lastName))
                                                    }
                                                })
                                                //var refreshInterval = setInterval(() => { this.refreshData() }, 10000);
                                                this.setState({
                                                    //intervalID: refreshInterval,
                                                    todaysPlayers: all_players,
                                                    todaysGames: all_gameIds,
                                                    todaysScoreboards: all_gameBS,
                                                    todaysDate: date,
                                                    todaysPbp: all_pbp,
                                                    newPbp: all_pbp
                                                })
                                            })
                                            .catch(error => { console.log(error) })
                                    })
                                })
                            })
                        }
                    })
                    .catch(error => { console.log(error) })
            })
            .catch(error => { console.log(error) })
    }

    // componentWillUnmount() {
    //     clearInterval(this.state.intervalID)
    // }


    handleInput(e, name) {
        let value = e;
        this.setState({
            [name]: value
        })
    }

    handleTrackPlayer() {
        if (this.state.inputPlayer !== "") {
            if (this.state.trackedPlayers.includes(this.state.inputPlayer)) {
                this.setState({
                    inputPlayer: ""
                })
            } else {
                this.setState(prevState => ({
                    trackedPlayers: [...prevState.trackedPlayers, this.state.inputPlayer],
                    inputPlayer: ""
                }))
            }
        }
    }

    removeTrackPlayer(name) {
        let newPlayers = this.state.trackedPlayers
        newPlayers.splice(newPlayers.indexOf(name), 1)
        this.setState({
            trackedPlayers: newPlayers
        })
    }

    handleTrackBet() {
        let myPlayer = this.state.betPlayerName
        let myStat = this.state.betPlayerStat
        let myLine = this.state.betPlayerLine
        let betPlayerOU = this.state.betPlayerOU
        if (myPlayer !== "" && myStat !== "" && myLine !== "" && betPlayerOU !== "") {
            if (this.state.trackedPlayers.includes(myPlayer)) {
                this.setState(prevState => ({
                    trackedBets: [...prevState.trackedBets, { player: myPlayer, stat: myStat, line: myLine, ou: betPlayerOU }],
                    betPlayerName: "",
                    betPlayerStat: "",
                    betPlayerLine: "",
                    betPlayerOU: ""
                }))
            } else {
                this.setState(prevState => ({
                    trackedBets: [...prevState.trackedBets, { player: myPlayer, stat: myStat, line: myLine, ou: betPlayerOU }],
                    trackedPlayers: [...prevState.trackedPlayers, myPlayer],
                    betPlayerName: "",
                    betPlayerStat: "",
                    betPlayerLine: "",
                    betPlayerOU: ""
                }))
            }
        }
    }

    removeTrackBet(betIndex) {
        let newBets = this.state.trackedBets
        newBets.splice(betIndex, 1)
        this.setState({
            trackedBets: newBets
        })
    }

    handleTrackTeamBet() {
        let teamName = this.state.betTeamName
        let teamBet = this.state.betTeamBet
        let teamLine = this.state.betTeamLine
        let teamOUMP = this.state.betTeamOUMP
        if (teamName !== "" && teamBet !== "" && teamLine !== "" && teamOUMP !== "") {
            this.setState(prevState => ({
                trackedTeamBets: [...prevState.trackedTeamBets, { team: teamName, bet: teamBet, line: teamLine, oump: teamOUMP }],
                betTeamName: "",
                betTeamBet: "",
                betTeamLine: "",
                betTeamOUMP: ""
            }))
        }
    }

    removeTrackTeamBet(betIndex) {
        let newBets = this.state.trackedTeamBets
        newBets.splice(betIndex, 1)
        this.setState({
            trackedTeamBets: newBets
        })
    }

    refreshData() {
        var all_gameBS = []
        var all_pbp = []
        var promises = []
        if (this.state.todaysGames !== null) {
            this.state.todaysGames.forEach((gameId, key) => {
                var game_pbp = []
                var vTeam = ""
                var hTeam = ""
                promises.push(
                    axios.get(`https://data.nba.net/10s/prod/v1/${this.state.todaysDate}/${gameId}_boxscore.json`)
                        .then(bs_response => {
                            all_gameBS.push(bs_response.data);
                            vTeam = bs_response.data.basicGameData.vTeam.triCode
                            hTeam = bs_response.data.basicGameData.hTeam.triCode
                        })
                        .catch(error => { console.log(error) })
                )
                for (let i = 1; i < 5; i++) {
                    promises.push(
                        axios.get(`https://data.nba.net/10s/prod/v1/${this.state.todaysDate}/${gameId}_pbp_${i}.json`)
                            .then(pbp_response => {
                                game_pbp.push({ q_num: i, q_data: pbp_response.data });
                            })
                            .catch(error => { console.log(error) })
                    )
                }
                Promise.all(promises).then(() => {
                    game_pbp.unshift(vTeam.concat(" vs ", hTeam))
                    all_pbp.push(game_pbp)
                    this.setState(prevState => ({
                        todaysScoreboards: all_gameBS,
                        todaysPbp: prevState.newPbp,
                        newPbp: all_pbp
                    }))
                })
            })
        }
    }

    render() {
        if (!this.state.todaysScoreboards || !this.state.todaysGames || !this.state.todaysPlayers) {
            return <LoadingScreen text={"Fetching Data.."} />
        }
        // Buttons
        const addPlayerButton = <AwesomeButton onPress={this.handleTrackPlayer} type="primary">Add Player</AwesomeButton>
        const addBetButton = <AwesomeButton onPress={this.handleTrackBet} type="primary">Add Bet</AwesomeButton>
        const addTeamBetButton = <AwesomeButton onPress={this.handleTrackTeamBet} type="primary">Add Team Bet</AwesomeButton>
        const refreshDataButton = <AwesomeButton onPress={this.refreshData} type="secondary">Refresh Data</AwesomeButton>

        // Input Dropdown Bar
        var playerList = []
        this.state.todaysPlayers.forEach((player, key) => {
            playerList.push({ value: player, label: player })
        })
        const input = <Select
            showSearch
            options={playerList}
            onChange={(e) => this.handleInput(e, "inputPlayer")}
            style={{ width: 200 }}
            className="select"
            value={this.state.inputPlayer}
        />

        // Player Props
        const playerNameInput = <Select
            showSearch
            options={playerList}
            onChange={(e) => this.handleInput(e, "betPlayerName")}
            style={{ width: 200 }}
            className="select"
            value={this.state.betPlayerName}
        />

        const stats = ["PTS", "3PM", "REB", "AST", "STL", "BLK", "TO"]
        const myStats = stats.map(stat =>
            ({ value: stat, label: stat })
        )
        const playerStatInput = <Select
            showSearch
            options={myStats}
            onChange={(e) => this.handleInput(e, "betPlayerStat")}
            style={{ width: 200 }}
            className="select"
            value={this.state.betPlayerStat}
        />

        let lines = []
        for (let j = 0; j < 55; j++) {
            let number = j + 0.5
            let string = number.toString()
            lines.push(string)
        }
        const myLines = lines.map(line =>
            ({ value: line, label: line })
        )
        const playerLineInput = <Select
            showSearch
            options={myLines}
            onChange={(e) => this.handleInput(e, "betPlayerLine")}
            style={{ width: 200 }}
            className="select"
            value={this.state.betPlayerLine}
        />

        const overUnder = [
            { value: "over", label: "Over" },
            { value: "under", label: "Under" }
        ]
        const playerOUInput = <Select
            showSearch
            options={overUnder}
            onChange={(e) => this.handleInput(e, "betPlayerOU")}
            style={{ width: 200 }}
            className="select"
            value={this.state.betPlayerOU}
        />

        var myBets = this.state.trackedBets.map((bet, betKey) => (
            <div>
                <Button type="text" onClick={() => this.removeTrackBet(betKey)}>x</Button>
                <strong> {bet.player} {bet.ou} {bet.line} {bet.stat}</strong>
            </div>
        ))

        // Team Bets
        var teamList = []
        this.state.todaysScoreboards.forEach(team => {
            teamList.push({ value: team.basicGameData.hTeam.triCode, label: team.basicGameData.hTeam.triCode })
            teamList.push({ value: team.basicGameData.vTeam.triCode, label: team.basicGameData.vTeam.triCode })
        })
        const teamNameInput = <Select
            showSearch
            options={teamList}
            onChange={(e) => this.handleInput(e, "betTeamName")}
            style={{ width: 200 }}
            className="select"
            value={this.state.betTeamName}
        />

        const teamBetTypes = ["Total Points", "Handicap"]
        const myTypes = teamBetTypes.map(bet =>
            ({ value: bet, label: bet })
        )
        const teamBetInput = <Select
            showSearch
            options={myTypes}
            onChange={(e) => this.handleInput(e, "betTeamBet")}
            style={{ width: 200 }}
            className="select"
            value={this.state.betTeamBet}
        />

        let teamLines = []
        var startNum = 0
        var endNum = 1
        if (this.state.betTeamBet === "Total Points") {
            startNum = 160
            endNum = 250
        } else if (this.state.betTeamBet === "Handicap") {
            startNum = 0
            endNum = 40
        }
        for (let j = startNum; j < endNum; j += 0.5) {
            let number = j + 0.5
            let string = number.toString()
            teamLines.push(string)
        }
        var myTeamLines = teamLines.map(line =>
            ({ value: line, label: line })
        )
        if (startNum === 0 && endNum === 1) {
            myTeamLines = [{ value: "placeholder", label: "Please select a Bet Type" }]
        }
        const teamLineInput = <Select
            showSearch
            options={myTeamLines}
            onChange={(e) => this.handleInput(e, "betTeamLine")}
            style={{ width: 200 }}
            className="select"
            value={this.state.betTeamLine}
        />

        const minusPlus = [
            { value: "-", label: "-" },
            { value: "+", label: "+" }
        ]
        const placeholderOUMP = [{ value: "placeholder", label: "Please select a Bet Type" }]
        var ouORmp = placeholderOUMP
        if (this.state.betTeamBet === "Handicap") {
            ouORmp = minusPlus
        } else if (this.state.betTeamBet === "Total Points") {
            ouORmp = overUnder
        }
        const teamOUMPInput = <Select
            showSearch
            options={ouORmp}
            onChange={(e) => this.handleInput(e, "betTeamOUMP")}
            style={{ width: 200 }}
            className="select"
            value={this.state.betTeamOUMP}
        />

        // Play by Play
        var formattedPbp = []
        if (this.state.newPbp) {
            this.state.newPbp.forEach((pbp, key) => {
                var singlePbp = []
                var gameName = pbp[0]
                for (let i = 1; i < 5; i++) {
                    pbp.forEach((q_pbp, key2) => {
                        if (key2 !== 0) {
                            if (q_pbp.q_num === i) {
                                q_pbp.q_data.plays.forEach((play, key3) => {
                                    for (let j = 0; j < this.state.trackedPlayers.length; j++) {
                                        let player = this.state.trackedPlayers[j]
                                        let isBold = ""
                                        this.state.todaysPbp[key].forEach(q_pbp => {
                                            if (q_pbp.q_num === i) {
                                                let newPlay = true
                                                q_pbp.q_data.plays.forEach(oldPlay => {
                                                    if (oldPlay.description === play.description) {
                                                        newPlay = false
                                                    }
                                                })
                                                if (newPlay) {
                                                    isBold = "bold"
                                                }
                                            }
                                        })
                                        // if (!this.state.todaysPbp[key][key2].q_data.plays.includes(play)) {
                                        //     isBold = "bold"
                                        // }

                                        let lastName = player.substring(player.indexOf(" ") + 1)
                                        if (play.description.includes(lastName)) {
                                            singlePbp.unshift(
                                                <p className={isBold}>
                                                    Q{q_pbp.q_num} {play.clock}: {play.description}
                                                </p>
                                            )
                                            break;
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
                if (singlePbp.length > 0) {
                    singlePbp.unshift(<h2>{gameName}</h2>)
                }
                formattedPbp.unshift(singlePbp)
            })
        }


        // Scoreboard View
        var scoreboard = this.state.todaysScoreboards.map(game => (
            <Scoreboard
                quarter={game.basicGameData.period.current}
                clock={game.basicGameData.clock}
                hTeamName={game.basicGameData.hTeam.triCode}
                vTeamName={game.basicGameData.vTeam.triCode}
                hTeamScore={game.stats.hTeam.totals.points}
                vTeamScore={game.stats.vTeam.totals.points}
                bets={this.state.trackedTeamBets}
                handleRemoveBet={this.removeTrackTeamBet}
                pbp={this.state.newPbp}
                trackedPlayers={this.state.trackedPlayers}
            />
        ))
        return (
            <div>
                <Subcontent heading="Add Bets">
                    {playerNameInput}
                    {playerStatInput}
                    {playerLineInput}
                    {playerOUInput}
                    {addBetButton}
                    {myBets}
                    <br />
                    <br />
                    {teamNameInput}
                    {teamBetInput}
                    {teamLineInput}
                    {teamOUMPInput}
                    {addTeamBetButton}
                </Subcontent>
                <Subcontent heading="Scoreboard">
                    {scoreboard}
                </Subcontent>
                <Content heading='Box Score' headingright2={addPlayerButton} headingright={input}>
                    {refreshDataButton}
                    <BoxScore
                        trackedPlayers={this.state.trackedPlayers}
                        todaysScoreboards={this.state.todaysScoreboards}
                        trackedBets={this.state.trackedBets}
                        removeTrackPlayer={this.removeTrackPlayer}
                    />
                </Content>
                <Subcontent heading='Play-By-Play'>
                    {formattedPbp}
                </Subcontent>
            </div>
        )
    }
}

export default BetTrackr
