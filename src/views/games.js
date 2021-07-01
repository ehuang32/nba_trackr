import React from 'react';
import axios from 'axios';
import { Table } from 'antd';
import LoadingScreen from '../components/loading.js';
import Content from '../components/content.js';
import '../css/scoreboard.css';
import '../css/table.css';
import 'antd/dist/antd.css';

class Games extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            todaysScoreboards: null
        }
    }

    componentDidMount() {
        axios.get(`https://data.nba.net/10s/prod/v1/today.json`)
            .then(t_response => {
                var date = t_response.data.links.anchorDate
                // date = "20210428"
                axios.get(`https://data.nba.net/10s/prod/v1/${date}/scoreboard.json`)
                    .then(g_response => {
                        var all_gameBS = []
                        var promises = []
                        if (g_response.data.games.length === 0) {
                            this.setState({
                                todaysScoreboards: all_gameBS
                            })
                        } else {
                            g_response.data.games.forEach(game => {
                                promises.push(
                                    axios.get(`https://data.nba.net/10s/prod/v1/${date}/${game.gameId}_boxscore.json`)
                                        .then(bs_response => {
                                            all_gameBS.push(bs_response.data);
                                        })
                                        .catch(error => { console.log(error) })
                                )
                            })
                            Promise.all(promises).then(() => {
                                this.setState({
                                    todaysScoreboards: all_gameBS
                                })
                            })
                        }

                    })
            })
            .catch(error => { console.log(error) })
    }

    render() {
        if (!this.state.todaysScoreboards) {
            return <LoadingScreen text={"Fetching Data.."} />
        }
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
                sorter: (a, b) => a.plusMinus - b.plusMinus
            },
            {
                title: 'PTS',
                dataIndex: 'pts',
                key: 'pts',
                sorter: (a, b) => a.pts - b.pts
            }
        ]

        var teams = {}
        var teamsList = []
        var data = []
        this.state.todaysScoreboards.forEach(sb => {
            let game_data = []
            teams[sb.basicGameData.vTeam.teamId] = sb.basicGameData.vTeam.triCode
            teams[sb.basicGameData.hTeam.teamId] = sb.basicGameData.hTeam.triCode
            teamsList.push(sb.basicGameData.vTeam.triCode.concat(" vs ", sb.basicGameData.hTeam.triCode))
            if ("stats" in sb) {
                sb.stats.activePlayers.forEach(player => {
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
                        pts: player.points
                    }
                    game_data.push(scoreline)
                })
                data.push(game_data)
            }
        })

        var scoreboardCarousel = data.map((game, key) => (
            <div>
                <h2 className="bold">{teamsList[key]}</h2>
                <Table
                    className='table'
                    columns={columns}
                    dataSource={game}
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    size="small"
                    bordered
                    pagination={{ pageSize: 30 }}
                />
            </div>
        ))

        return (
            <Content heading="Today's Games [Not completed]">
                {scoreboardCarousel}
            </Content >
        )
    }
}

export default Games;