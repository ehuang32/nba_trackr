import React from 'react';
import { Button } from 'antd';
import '../css/scoreboard.css';

class Scoreboard extends React.Component {
    render() {
        let clock = this.props.clock;
        if (this.props.clock === "") {
            clock = "FINAL"
        }

        var bets = []
        this.props.bets.forEach((bet, betKey) => {
            if (bet.team === this.props.hTeamName || bet.team === this.props.vTeamName) {
                bets.push(
                    <div>
                        <Button type="text" onClick={() => this.props.handleRemoveBet(betKey)}>x</Button>
                        <strong> {bet.team} {bet.oump} {bet.line} {bet.bet}</strong>
                    </div>
                )
            }
        })

        var myPbp = []
        this.props.pbp.forEach((pbp, pbpKey) => {
            const gameName = pbp[0]
            let hTeam = gameName.substring(0, 3)
            let vTeam = gameName.substring(7, 10)
            console.log(hTeam)
            console.log(vTeam)
            if (this.props.hTeamName === hTeam || this.props.hTeamName === vTeam) {
                for (let i = 1; i < 5; i++) {
                    pbp.forEach((q_pbp, qpbpKey) => {
                        if (qpbpKey !== 0) {
                            if (q_pbp.q_num === i) {
                                q_pbp.q_data.plays.forEach(play => {
                                    let isBold = ""
                                    for (let j = 0; j < this.props.trackedPlayers.length; j++) {
                                        let player = this.props.trackedPlayers[j]
                                        let lastName = player.substring(player.indexOf(" ") + 1)
                                        if (play.description.includes(lastName)) {
                                            isBold = "bold"
                                        }
                                    }
                                    myPbp.unshift(
                                        <p className={isBold}>
                                            Q{q_pbp.q_num} {play.clock}: {play.description}
                                        </p>
                                    )
                                })
                            }
                        }
                    })
                }
            }
        })

        return (
            <div className="scoreboard-container">
                <div className="score">
                    <div className="center">
                        Q{this.props.quarter} {clock}
                    </div>
                    <div className="center">
                        {this.props.hTeamName}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.hTeamScore}
                    </div>
                    <div className="center">
                        {this.props.vTeamName}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.vTeamScore}
                    </div>
                </div>
                <div className="bets">
                    {bets}
                </div>
                <div className="pbp">
                    {myPbp}
                </div>
            </div>
        )
    }
}

export default Scoreboard;