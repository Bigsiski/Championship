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
    if (Table === "championships") { //Object.keys(tables)[0]
      //То потрібно команди/турнірну таблицю, бомбардирів та гравців чемпіонату

      axios.get("/api/collections/extract", {
        params: {
          table: "championships",
          field: tables.championships,
          value: value,
          projection: "teams"
        }
      }).then((res) => {
        if (res.data[0].hasOwnProperty("teams")) {

          res.data[0].teams.map((team) => {
            axios.get("/api/collections/extract", {
              params: {table: "teams", field: "_id", value: team._id, projection: "TeamName"}
            }).then((name) => {
              let TeamName = {label: name.data[0].TeamName, value: name.data[0].TeamName};
              teams.push(TeamName)
              /*
              this.setState(prevState => ({
                teams: [...prevState.teams, TeamName]
              }))*/
            }).catch((err) => console.log(err));

            axios.get("/api/collections/extract", {
              params: {
                table: "teams", field: "_id", value: team._id,
                projection: [tables.teams, "Points"], sort: "Points"
              }
            }).then((data) => {
              let TeamData = {
                label: data.data[0].TeamName + " - " + data.data[0].Points,
                value: data.data[0].TeamName + " - " + data.data[0].Points
              };
              tournament.push(TeamData);
            }).catch((err) => console.log(err));

            axios.get("/api/collections/extract", {
              params: {
                table: "players", field: "Parents._id", value: team._id,
                projection: ["PlayerName", "Goals"], sort: "Goals"
              }
            }).then((players) => {
              let PlayerData = {
                label: players.data[0].PlayerName + " - " + players.data[0].Goals,
                value: players.data[0].PlayerName + " - " + players.data[0].Goals
              };
              bombardiers.push(PlayerData);
            }).catch((err) => console.log(err));

            axios.get("/api/collections/extract", {
              params: {
                table: "players", field: "Parents._id", value: team._id,
                projection: "PlayerName"
              }
            }).then(async (Players) => {
              let player = {label: Players.data[0].PlayerName, value: Players.data[0].PlayerName};
              players.push(player);
            }).catch((err) => console.log(err));
          });

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
        console.log(res);
        if (res.data[0].hasOwnProperty("players")) {
          res.data[0].players.map((id) => {
            axios.get("/api/collections/extract", {
              params: {
                table: "players", field: "_id", value: id._id,
                projection: "PlayerName"
              }
            }).then((Players) => {
              console.log(Players)
              const player = {label: Players.data[0].PlayerName, value: Players.data[0].PlayerName};
              players.push(player);
            }).catch((err) => console.log(err));

            this.setState({players: players})
          })
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
