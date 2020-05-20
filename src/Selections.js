import React from 'react';
import './Styles/Main.css';

import {reactSelectStyles} from './Styles/react-select';
import Select from 'react-select';
import axios from "axios";

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.yourElement = React.createRef();
        this.state = {
            championships: [],
            tournament: [],
            bombardiers: [],
            teams: [],
            players: [],

            //Tables and theirs fields we need to display
            tables: {
                championships: "ChampName", tournament: null, bombardiers: null,
                teams: "TeamName", players: "PlayerName"
            }
        };
    }

    componentDidMount() {
        axios.get("/api/collections/extract", {
            params: {
                table: Object.keys(this.state.tables)[0],
                projection: this.state.tables[Object.keys(this.state.tables)[0]]
            }
        }).then((res) => {
            this.setState({
                championships: res.data.map((item) => {
                    return {label: item[Object.keys(item)[0]], value: item[Object.keys(item)[0]]}
                })
            })
        }).catch((err) => console.log(err))
    }


    onSelectChange = (Table, event) => {
        const value = event.value;
        const {tables} = this.state;

        const bombardiers = [], tournament = [], teams = [], players = [];
        if (Table === "championships") {
            //То потрібно команди/турнірну таблицю, бомбардирів та гравців чемпіонату

            axios.get("/api/collections/extract", {
                params: {
                    table: "championships",
                    field: tables.championships,
                    value: value,
                    projection: "teams"
                }
            }).then((res) => { //Тут ми отримали массив ключів команд

                if (res.data[0].hasOwnProperty("teams")) {
                    const teamIds = [];
                    res.data[0].teams.forEach((item) => { //конвертую в массив
                        teamIds.push(item._id);
                    });

                    axios.get("/api/collections/extract", {
                        params: {
                            table: "teams", field: "_id", value: teamIds,
                            projection: [tables.teams, "Points"], sort: "Points"
                        }
                    }).then((teamData) => { //тут отримуємо імена команд + очки
                        teamData.data.map((team) => {
                            teams.push({label: team.TeamName, value: team.TeamName});
                            tournament.push({
                                label: team.TeamName + " - " + team.Points,
                                value: team.TeamName + " - " + team.Points
                            });
                        })

                    }).catch((err) => console.log(err));

                    axios.get("/api/collections/extract", {
                        params: {
                            table: "players", field: "Parents._id", value: teamIds,
                            projection: ["PlayerName", "Goals"], sort: "Goals"
                        }
                    }).then((PlayersData) => {

                        PlayersData.data.map((player) => {
                            players.push({label: player.PlayerName, value: player.PlayerName});
                            bombardiers.push({
                                label: player.PlayerName + " - " + player.Goals,
                                value: player.PlayerName + " - " + player.Goals
                            });
                        });

                    }).catch((err) => console.log(err));


                    this.setState({
                        tournament: tournament,
                        bombardiers: bombardiers,
                        teams: teams,
                        players: players
                    })
                } else {
                    this.setState({
                        tournament: [],
                        bombardiers: [],
                        teams: [],
                        players: [],
                    })
                }
            }).catch((err) => console.log(err));

        } else if (Table === "teams") { //То отримуємо гравців команди, а не всього чемпіонату
            axios.get("/api/collections/extract", {
                params: {
                    table: "teams", field: tables.teams, value: value,
                    projection: "players"
                }
            }).then((res) => {

                if (res.data[0].hasOwnProperty("players")) {
                    const playersIds = [];
                    res.data[0].players.forEach((item) => {
                        playersIds.push(item._id);
                    });

                    axios.get("/api/collections/extract", {
                        params: {
                            table: "players", field: "_id", value: playersIds,
                            projection: "PlayerName"
                        }
                    }).then((Players) => {

                        Players.data.map((team) => {
                            players.push({label: team.PlayerName, value: team.PlayerName});
                        })
                    }).catch((err) => console.log(err));

                    this.setState({players: players})

                } else {
                    this.setState({players: []})
                }
            }).catch((err) => console.log(err));
        }
    };

    render() {
        const {tables} = this.state;
        return (
            <div className="row">
                {Object.keys(tables).map((table, i) => {
                    return <Select
                        key={i}
                        name={table}
                        // value={selectedOption}
                        onChange={(event) => {
                            if (table !== Object.keys(tables)[1] && table !== Object.keys(tables)[2]) {
                                this.onSelectChange(table, event)
                            }
                        }}
                        options={this.state[table]}
                        styles={reactSelectStyles}
                        placeholder={table}
                    />
                })}
            </div>
        )
    }
}
