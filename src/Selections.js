import React from 'react';
import * as THREE from 'three'
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

            selectedInfo: null,
            champId: null,

            operations: ["Create", "Read", "Update", "Delete"]
        };
    }

    componentDidMount() {
        axios.get("/api/collections/extract", {
            params: {
                path: [{table: "Championship", field: ""}],
                projection: "champName"
            }
        }).then((res) => {
            console.log(res);
            this.setState({championships: {label: res.data.name, value: res.data.name}})

        }).catch((err) => console.log(err))
    }


    changeChamp = (selectedOption) => {
        console.log(`Option selected:`, selectedOption);

        //Використай projection fields на сервері  /forEach object[key] = 1
        axios.get("/api/collections/extract", {
            params: {
                path: [{table: "Championship", field: "champName"}],
                value: selectedOption.value,//значення параметра яке маємо
                projection: ["champId", "ChampName", "Country", "Popularity"]//поля для проекції, тобто що потрібно
            }
        }).then((res) => {
            this.setState({selectedInfo: res.data});
            console.log(res)

        }) .catch((err) => console.log(err))

        //Шукаємо за назвою чемпіонату його champID, далі в таблиці teams шукаємо teamName за champID
        axios.get("/api/collections/extract", {
            params: {
                path: [{table: "Championship", field: "champName"}, {table: "Team", field: "champId"}],
                value: selectedOption.value,
                projection: "teamName"
            }
        }).then((res) => {
            this.setState({
                teams: res.data.map((item) => {
                    return {label: item.name, value: item.name}
                })
            });
            console.log(res)

        }).catch((err) => console.log(err));

        //Отримати сортовані за зростанням очки команд + назви команд
        axios.get("/api/collections/extract", {
            params: {
                path: [{table: "Championship", field: "champName"}, {table: "Team", field: "champId"}],
                value: selectedOption.value,
                projection: ["teamName", "points"],
                sort: "points"
            }
        }).then((res) => {
            // this.setState({teams: {label: res.data.name, value: res.data.name}});
            console.log(res)

        }).catch((err) => console.log(err))

        //шукаємо champId, далі bombId, далі риємо Playera
        axios.get("/api/collections/extract", {
            params: {
                path: [{table: "Championship", field: "champName"}, {table: "Bombardiers", field: "champId"},
                    {table: "Player", field: "bombId"}],
                value: selectedOption.value,
                projection: ["playerName", "goals"],
                sort: "goals"
            }
        }).then((res) => {
            // this.setState({teams: {label: res.data.name, value: res.data.name}});
            console.log(res)
        }).catch((err) => console.log(err))
    };

    changeTeam = (selectedOption) => {
        console.log(`Option selected:`, selectedOption);


    };

    changePlayer = (selectedOption) => {
        console.log(`Option selected:`, selectedOption);
    };

    render = () =>
            <div className="row">
                <Select
                    // value={selectedOption}
                    onChange={this.changeChamp}
                    options={this.state.championships}
                    styles={reactSelectStyles}
                />
                <Select //Команда + очки
                    // value={selectedOption}
                    onChange={() => alert("You cannot select this option")}
                    options={this.state.tournament}
                    styles={reactSelectStyles}
                />
                <Select //гравець + голи
                    //value={selectedOption}
                    onChange={() => alert("You cannot select this option")}
                    options={this.state.bombardiers}
                    styles={reactSelectStyles}
                />
                <Select
                    //  value={selectedOption}
                    onChange={this.changeTeam}
                    options={this.state.teams}
                    styles={reactSelectStyles}
                />
                <Select
                    // value={selectedOption}
                    onChange={this.changePlayer}
                    options={this.state.players}
                    styles={reactSelectStyles}
                />
            </div>
}
