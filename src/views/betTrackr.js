// Libraries
import React from 'react';
import axios from 'axios';
import { Select } from 'antd';
import { AwesomeButton } from 'react-awesome-button';

// Components
import Content from '../components/content.js';
import Subcontent from '../components/subcontent.js'
import Scoreboard from '../components/scoreboard.js';
import LoadingScreen from '../components/loading.js';

// CSS
import 'antd/dist/antd.css';
import '../css/table.css';
import "../css/awesomebutton.css";
import "../css/trackr.css";

class BetTrackr extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            all_scoreboards: null,
            trackedPlayers: [],
            inputPlayer: "",
            todaysDate: "",
            todaysGames: null,
            todaysPlayers: null,
            todaysPbp: null
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleTrackPlayer = this.handleTrackPlayer.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
        axios.get(`https://data.nba.net/10s/prod/v1/today.json`)
            .then(t_response => {
                var date = t_response.data.links.anchorDate
                //date = "20210620"
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
                                all_scoreboards: all_gameBS,
                                todaysDate: date,
                                todaysPbp: all_pbp
                            })
                        } else {
                            g_response.data.games.forEach((game, key) => {
                                all_gameIds.push(game.gameId)
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
                                    this.setState({
                                        todaysPlayers: all_players,
                                        todaysGames: all_gameIds,
                                        all_scoreboards: all_gameBS,
                                        todaysDate: date,
                                        todaysPbp: all_pbp
                                    })
                                })
                            })
                        }
                    })
                    .catch(error => { console.log(error) })
            })
            .catch(error => { console.log(error) })
        this.forceUpdate()
    }

    handleInput(e) {
        let value = e;
        this.setState({
            inputPlayer: value
        })
    }

    handleTrackPlayer() {
        if (this.state.inputPlayer !== "") {
            this.setState(prevState => ({
                trackedPlayers: [...prevState.trackedPlayers, this.state.inputPlayer],
                inputPlayer: ""
            }))
        }
    }

    refreshData() {
        var all_gameBS = []
        var all_pbp = []
        var promises = []
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
                this.setState({
                    all_scoreboards: all_gameBS,
                    todaysPbp: all_pbp
                })
            })
        })

    }

    render() {
        if (!this.state.all_scoreboards || !this.state.todaysGames || !this.state.todaysPlayers) {
            return <LoadingScreen text={"Fetching Data.."} />
        }
        // Buttons
        const addPlayerButton = <AwesomeButton onPress={this.handleTrackPlayer} type="primary">Add Player</AwesomeButton>
        const refreshDataButton = <AwesomeButton onPress={this.refreshData} type="secondary">Refresh Data</AwesomeButton>

        // Input Dropdown Bar
        var myOptions = []
        this.state.todaysPlayers.forEach((player, key) => {
            myOptions.push({ value: player, label: player })
        })
        const input = <Select
            showSearch
            options={myOptions}
            onChange={(e) => this.handleInput(e)}
            style={{ width: 200 }}
            className="select"
        />

        // Play by Play
        var formattedPbp = []
        this.state.todaysPbp.forEach((pbp, key) => {
            var singlePbp = []
            var gameName = pbp[0]
            for (let i = 1; i < 5; i++) {
                pbp.forEach((q_pbp, key2) => {
                    if (key2 !== 0) {
                        if (q_pbp.q_num === i) {
                            q_pbp.q_data.plays.forEach((play, key3) => {
                                this.state.trackedPlayers.forEach((player, key3) => {
                                    let lastName = player.substring(player.indexOf(" ") + 1)
                                    if (play.description.includes(lastName)) {
                                        singlePbp.unshift(
                                            <p>
                                                Q{q_pbp.q_num} {play.clock}: {play.description}
                                            </p>
                                        )
                                    }
                                })
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
        return (
            <div>
                <Content heading='Your Scoreboard' headingright2={addPlayerButton} headingright={input}>
                    {refreshDataButton}
                    <Scoreboard trackedPlayers={this.state.trackedPlayers} all_scoreboards={this.state.all_scoreboards} />
                </Content>
                <Subcontent heading='Play-By-Play'>
                    {formattedPbp}
                </Subcontent>
            </div>
        )
    }
}

export default BetTrackr