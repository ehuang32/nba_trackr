import React from 'react';
import { Table, Button } from 'antd';
import '../css/scoreboard.css';

// Function to parse a stat and bet combo e.g. 15 [o13.5] 5 - 12 [o2.5]
function hasBetHit(statAndBet) {
    let stat = statAndBet.substring(0, statAndBet.indexOf(" "))
    let ou = statAndBet.substring(statAndBet.indexOf("[") + 1, statAndBet.indexOf("[") + 2)
    let line = statAndBet.substring(statAndBet.indexOf("[") + 2, statAndBet.length - 1)

    if (ou === "o") {
        if (parseFloat(stat) > parseFloat(line)) {
            return true
        } else {
            return false
        }
    } else if (ou === "u") {
        if (parseFloat(stat) < parseFloat(line)) {
            return true
        } else {
            return false
        }
    }
}


class Scoreboard extends React.Component {

    constructor(props) {
        super(props);
        this.columns = [
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
                sorter: (a, b) => a.tpm - b.tpm,
                render(text, record) {
                    if (!text.includes("[")) {
                        return {
                            children: <div>{text}</div>
                        }
                    } else {
                        return {
                            props: {
                                style: { color: hasBetHit(text) ? 'green' : 'red' }
                            },
                            children: <div>{text}</div>
                        }
                    }
                }
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
                sorter: (a, b) => a.reb - b.reb,
                render(text, record) {
                    if (!text.includes("[")) {
                        return {
                            children: <div>{text}</div>
                        }
                    } else {
                        return {
                            props: {
                                style: { color: hasBetHit(text) ? 'green' : 'red' }
                            },
                            children: <div>{text}</div>
                        }
                    }
                }
            },
            {
                title: 'AST',
                dataIndex: 'ast',
                key: 'ast',
                sorter: (a, b) => a.ast - b.ast,
                render(text, record) {
                    if (!text.includes("[")) {
                        return {
                            children: <div>{text}</div>
                        }
                    } else {
                        return {
                            props: {
                                style: { color: hasBetHit(text) ? 'green' : 'red' }
                            },
                            children: <div>{text}</div>
                        }
                    }
                }
            },
            {
                title: 'STL',
                dataIndex: 'stl',
                key: 'stl',
                sorter: (a, b) => a.stl - b.stl,
                render(text, record) {
                    if (!text.includes("[")) {
                        return {
                            children: <div>{text}</div>
                        }
                    } else {
                        return {
                            props: {
                                style: { color: hasBetHit(text) ? 'green' : 'red' }
                            },
                            children: <div>{text}</div>
                        }
                    }
                }
            },
            {
                title: 'BLK',
                dataIndex: 'blk',
                key: 'blk',
                sorter: (a, b) => a.blk - b.blk,
                render(text, record) {
                    if (!text.includes("[")) {
                        return {
                            children: <div>{text}</div>
                        }
                    } else {
                        return {
                            props: {
                                style: { color: hasBetHit(text) ? 'green' : 'red' }
                            },
                            children: <div>{text}</div>
                        }
                    }
                }
            },
            {
                title: 'TO',
                dataIndex: 'to',
                key: 'to',
                sorter: (a, b) => a.to - b.to,
                render(text, record) {
                    if (!text.includes("[")) {
                        return {
                            children: <div>{text}</div>
                        }
                    } else {
                        return {
                            props: {
                                style: { color: hasBetHit(text) ? 'green' : 'red' }
                            },
                            children: <div>{text}</div>
                        }
                    }
                }
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
                sorter: (a, b) => a.pts - b.pts,
                render(text, record) {
                    if (!text.includes("[")) {
                        return {
                            children: <div>{text}</div>
                        }
                    } else {
                        return {
                            props: {
                                style: { color: hasBetHit(text) ? 'green' : 'red' }
                            },
                            children: <div>{text}</div>
                        }
                    }
                }
            },
            {
                title: '',
                key: '',
                render: (text, record) => {
                    return (
                        <Button type="text" onClick={() => this.props.removeTrackPlayer(record.name)}>x</Button>
                    )
                }
            }
        ]
    }

    render() {
        var teams = {}
        var data = []
        this.props.todaysScoreboards.forEach((sb, key) => {
            teams[sb.basicGameData.vTeam.teamId] = sb.basicGameData.vTeam.triCode
            teams[sb.basicGameData.hTeam.teamId] = sb.basicGameData.hTeam.triCode
            if ("stats" in sb) {
                sb.stats.activePlayers.forEach((player, key2) => {
                    let ptsLine = ""
                    let tpmLine = ""
                    let rebLine = ""
                    let astLine = ""
                    let stlLine = ""
                    let blkLine = ""
                    let toLine = ""
                    this.props.trackedBets.forEach(bet => {
                        if (bet.player === player.firstName.concat(" ", player.lastName)) {
                            let lineSuffix = ""
                            if (bet.ou === "over") {
                                lineSuffix = ` [o${bet.line}]`
                            } else {
                                lineSuffix = ` [u${bet.line}]`
                            }
                            switch (bet.stat) {
                                case "PTS":
                                    ptsLine = lineSuffix
                                    break;
                                case "3PM":
                                    tpmLine = lineSuffix
                                    break;
                                case "REB":
                                    rebLine = lineSuffix
                                    break;
                                case "AST":
                                    astLine = lineSuffix
                                    break;
                                case "STL":
                                    stlLine = lineSuffix
                                    break;
                                case "BLK":
                                    blkLine = lineSuffix
                                    break;
                                case "TO":
                                    toLine = lineSuffix
                                    break;
                                default:

                            }
                        }
                    })
                    const scoreline = {
                        name: player.firstName.concat(" ", player.lastName),
                        position: player.pos,
                        team: teams[player.teamId],
                        min: player.min,
                        fg: player.fgm.concat(" - ", player.fga),
                        ft: player.ftm.concat(" - ", player.fta),
                        tp: player.tpm.concat(" - ", player.tpa, tpmLine),
                        reb: player.totReb.concat(rebLine),
                        ast: player.assists.concat(astLine),
                        stl: player.steals.concat(stlLine),
                        blk: player.blocks.concat(blkLine),
                        to: player.turnovers.concat(toLine),
                        pFouls: player.pFouls,
                        plusMinus: player.plusMinus,
                        pts: player.points.concat(ptsLine),
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

        if (data.length === 0) {
            this.props.trackedPlayers.forEach(player => {
                const emptyScoreline = {
                    name: player,
                    position: "",
                    team: "",
                    min: "",
                    fg: "",
                    ft: "",
                    tp: "",
                    reb: "",
                    ast: "",
                    stl: "",
                    blk: "",
                    to: "",
                    pFouls: "",
                    plusMinus: "",
                    pts: "",
                }
                filteredData.push(emptyScoreline)
            })
        }
        return (
            <Table
                className='table'
                columns={this.columns}
                dataSource={filteredData}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            />
        )
    }
}

export default Scoreboard;
