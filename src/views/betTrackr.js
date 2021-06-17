import React from 'react';
import Content from '../components/content.js';
import { Table, Select } from 'antd';
import 'antd/dist/antd.css';
import '../css/table.css';
import axios from 'axios';
import LoadingScreen from '../components/loading.js';
import { AwesomeButton } from 'react-awesome-button';
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
            todaysPlayers: null
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleTrackPlayer = this.handleTrackPlayer.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }


    componentDidMount() {
        axios.get(`http://data.nba.net/10s/prod/v1/today.json`)
            .then(t_response => {
                console.log(t_response.data);
                axios.get(`https://data.nba.net/10s/prod/v1/${t_response.data.links.anchorDate}/scoreboard.json`)
                    .then(g_response => {
                        console.log(g_response.data);
                        var all_gameIds = []
                        var all_gameBS = []
                        var all_players = []
                        g_response.data.games.forEach((game, key) => {
                            all_gameIds.push(game.gameId)
                            axios.get(`https://data.nba.net/10s/prod/v1/${t_response.data.links.anchorDate}/${game.gameId}_boxscore.json`)
                                .then(bs_response => {
                                    console.log(bs_response.data);
                                    all_gameBS.push(bs_response.data);
                                    bs_response.data.stats.activePlayers.forEach((player, key2) => {
                                        all_players.push(player.firstName.concat(" ", player.lastName))
                                    })
                                })
                                .catch(error => { console.log(error) })
                        })
                        this.setState({
                            todaysPlayers: all_players,
                            todaysGames: all_gameIds,
                            all_scoreboards: all_gameBS,
                            todaysDate: t_response.data.links.anchorDate
                        })
                    })
                    .catch(error => { console.log(error) })
            })
            .catch(error => { console.log(error) })
    }

    handleInput(e) {
        let value = e;
        this.setState({
            inputPlayer: value
        })
    }

    handleTrackPlayer() {
        this.setState(prevState => ({
            trackedPlayers: [...prevState.trackedPlayers, this.state.inputPlayer],
            inputPlayer: ""
        }))
    }

    refreshData() {
        var all_gameBS = []
        this.state.todaysGames.forEach((gameId, key) => {
            axios.get(`https://data.nba.net/10s/prod/v1/${this.state.todaysDate}/${gameId}_boxscore.json`)
                .then(bs_response => {
                    console.log(bs_response.data);
                    all_gameBS.push(bs_response.data);
                })
                .catch(error => { console.log(error) })
        })
        this.setState({
            all_scoreboards: all_gameBS
        })
    }

    render() {
        if (!this.state.all_scoreboards || !this.state.todaysGames || !this.state.todaysPlayers) {
            return <LoadingScreen text={"Fetching Data.."} />
        }
        const addPlayerButton = <AwesomeButton onPress={this.handleTrackPlayer} type="primary">Add Player</AwesomeButton>
        const refreshDataButton = <AwesomeButton onPress={this.refreshData} type="secondary">Refresh Data</AwesomeButton>
        const columns = [
            {
                title: 'PLAYER NAME',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name < b.name
            },
            {
                title: 'TEAM',
                dataIndex: 'team',
                key: 'team'
            },
            {
                title: 'MIN',
                dataIndex: 'min',
                key: 'min',
                sorter: (a, b) => a.min - b.min
            },
            {
                title: 'FG',
                dataIndex: 'fg',
                key: 'fg',
                sorter: (a, b) => a.fgm - b.fgm
            },
            {
                title: '3PT',
                dataIndex: 'tp',
                key: 'tp',
                sorter: (a, b) => a.tpm - b.tpm
            },
            {
                title: 'FT',
                dataIndex: 'ft',
                key: 'ft',
                sorter: (a, b) => a.ftm - b.ftm
            },
            {
                title: 'REB',
                dataIndex: 'reb',
                key: 'reb',
                sorter: (a, b) => a.reb - b.reb
            },
            {
                title: 'AST',
                dataIndex: 'ast',
                key: 'ast',
                sorter: (a, b) => a.ast - b.ast
            },
            {
                title: 'STL',
                dataIndex: 'stl',
                key: 'stl',
                sorter: (a, b) => a.stl - b.stl
            },
            {
                title: 'BLK',
                dataIndex: 'blk',
                key: 'blk',
                sorter: (a, b) => a.blk - b.blk
            },
            {
                title: 'TO',
                dataIndex: 'to',
                key: 'to',
                sorter: (a, b) => a.to - b.to
            },
            {
                title: 'PF',
                dataIndex: 'pFouls',
                key: 'pFouls',
                sorter: (a, b) => a.pFouls - b.pFouls
            },
            {
                title: '+-',
                dataIndex: 'plusMinus',
                key: 'plusMinus',
            },
            {
                title: 'PTS',
                dataIndex: 'pts',
                key: 'pts',
                sorter: (a, b) => a.pts - b.pts
            }
        ]
        var teams = {}
        var data = []
        this.state.all_scoreboards.forEach((sb, key) => {
            teams[sb.basicGameData.vTeam.teamId] = sb.basicGameData.vTeam.triCode
            teams[sb.basicGameData.hTeam.teamId] = sb.basicGameData.hTeam.triCode
            sb.stats.activePlayers.forEach((player, key2) => {
                const scoreline = {
                    name: player.firstName.concat(" ", player.lastName),
                    position: player.pos,
                    team: teams[player.teamId],
                    min: player.min,
                    fg: player.fgm.concat(" - ", player.fga),
                    ft: player.ftm.concat(" - ", player.fta),
                    tp: player.tpm.concat(" - ", player.tpa),
                    reb: player.totReb,
                    ast: player.assists,
                    stl: player.steals,
                    blk: player.blocks,
                    to: player.turnovers,
                    pFouls: player.pFouls,
                    plusMinus: player.plusMinus,
                    pts: player.points,
                }
                data.push(scoreline)
            })
        })

        var filteredData = []
        data.forEach((scoreline, key) => {
            if (this.state.trackedPlayers.includes(scoreline.name)) {
                filteredData.push(scoreline)
            }
        })

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
        return (
            <div>
                <Content heading='Your Scoreboard' headingright2={addPlayerButton} headingright={input}>
                    {refreshDataButton}
                    <Table className='table' columns={columns} dataSource={filteredData} />
                </Content>
            </div>
        )
    }
}

export default BetTrackr