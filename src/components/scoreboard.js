import React from 'react';
import { Table } from 'antd';
import '../css/scoreboard.css';

class Scoreboard extends React.Component {
    render() {
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
        this.props.all_scoreboards.forEach((sb, key) => {
            teams[sb.basicGameData.vTeam.teamId] = sb.basicGameData.vTeam.triCode
            teams[sb.basicGameData.hTeam.teamId] = sb.basicGameData.hTeam.triCode
            if ("stats" in sb) {
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
            }
        })

        var filteredData = []
        data.forEach((scoreline, key) => {
            if (this.props.trackedPlayers.includes(scoreline.name)) {
                filteredData.push(scoreline)
            }
        })
        return (
            <Table
                className='table'
                columns={columns}
                dataSource={filteredData}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            />
        )
    }
}

export default Scoreboard;
