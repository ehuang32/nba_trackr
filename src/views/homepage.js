import React from 'react';
import Content from '../components/content.js';
import { Table, Tag } from 'antd';
import 'antd/dist/antd.css';
import '../css/table.css';

class Homepage extends React.Component {
    render() {
        const columns = [
            {
                title: 'RANK',
                dataIndex: 'rank',
                key: 'rank',
                sorter: (a, b) => a.rank - b.rank
            },
            {
                title: 'PLAYER NAME',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name < b.name
            },
            {
                title: 'Tags',
                dataIndex: 'tags',
                key: 'tags',
                sorter: (a, b) => a.tags.includes("draft") && !b.tags.includes("draft"),
                render: tags => (
                    <>
                        {tags.map(tag => {
                            let color = 'green'
                            if (tag === 'do not draft') {
                                color = 'volcano'
                            } else if (tag === 'mvp') {
                                color = 'blue'
                            }
                            return (
                                <Tag color = {color} key = {tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            )
                        })}
                    </>
                )
            },
            {
                title: 'POSITION',
                dataIndex: 'position',
                key: 'position'
            },
            {
                title: 'TEAM',
                dataIndex: 'team',
                key: 'team'
            },
            {
                title: 'MPG',
                dataIndex: 'mpg',
                key: 'mpg',
                sorter: (a, b) => a.mpg - b.mpg
            },
            {
                title: 'FG%',
                dataIndex: 'fg',
                key: 'fg',
                sorter: (a, b) => a.fg - b.fg
            },
            {
                title: 'FT%',
                dataIndex: 'ft',
                key: 'ft',
                sorter: (a, b) => a.ft - b.ft
            },
            {
                title: '3PM',
                dataIndex: 'tpm',
                key: 'tpm',
                sorter: (a, b) => a.tpm - b.tpm
            },
            {
                title: 'PTS',
                dataIndex: 'pts',
                key: 'pts',
                sorter: (a, b) => a.pts - b.pts
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
                title: 'RATING',
                dataIndex: 'rating',
                key: 'rating',
                sorter: (a, b) => a.rating - b.rating
            },
        ]
        const data = [
            {
                key: 1,
                rank: 1,
                name: 'Stephen Curry',
                tags: ['draft'],
                position: 'PG',
                team: 'GSW',
                mpg: 34.5,
                fg: 0.477,
                ft: 0.926,
                tpm: 6.1,
                pts: 35.2,
                reb: 5.2,
                ast: 5.2,
                stl: 1.2,
                blk: 0.2,
                to: 3.4,
                rating: 13.44
            },
            {
                key: 2,
                rank: 2,
                name: 'Lebron James',
                tags: ['do not draft'],
                position: 'SF',
                team: 'LAL',
                mpg: 34.5,
                fg: 0.477,
                ft: 0.713,
                tpm: 1.8,
                pts: 26.3,
                reb: 7.3,
                ast: 9.2,
                stl: 1.2,
                blk: 0.8,
                to: 4.1,
                rating: 10.44
            },
            {
                key: 3,
                rank: 3,
                name: 'Karl Anthony Towns',
                tags: ['draft', 'mvp'],
                position: 'C',
                team: 'MIN',
                mpg: 36.5,
                fg: 0.513,
                ft: 0.890,
                tpm: 3.2,
                pts: 232.2,
                reb: 13.2,
                ast: 3.4,
                stl: 1.4,
                blk: 1.9,
                to: 2.6,
                rating: 16.44
            },
        ]
        return (
            <div>
                <Content heading='Projections'>
                    <Table className='table' columns={columns} dataSource={data}/>
                </Content>
            </div>
        )
    }
}

export default Homepage;