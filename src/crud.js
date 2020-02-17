import React from 'react';
import './Styles/Main.css';

import {reactSelectStyles} from './Styles/react-select';
import Select from 'react-select';
import axios from "axios";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operations: [{label: "Create", value: "Create"}, {label: "Read", value: "Read"},
        {label: "Update", value: "Update"}, {label: "Delete", value: "Delete"}],

      selectedOperation: {label: "Create", value: "Create"},

      tables: [],
      selectedTable: null,

      fields: [],
      idKeys: [],
      selectedField: null,

      values: [],
      selectedValue: null
    };
  }

  componentDidMount() {
    axios.get("/api/collections", {}).then((res) => {
      this.setState({
        tables: res.data.map((item) => {
          return {label: item, value: item}
        })
      });
      // console.log(res)
    }).catch((err) => console.log(err))
  }

  extractionFields = (requireParents) => {

    return axios.get("/api/collections/metadata", {
      params: {
        table: this.state.selectedTable.value,
        requireParents: requireParents
      }
    })
  };

  configureFieldsSelect = async () => {
    const {selectedOperation, selectedTable, operations} = this.state;
    if (selectedTable) {
      if (selectedOperation.value === operations[0].value) {
        let fields = [], idKeys = [], keysNames = [];

        await this.extractionFields(true).then((res) => {
          console.log(res);

          let key = 0;
          res.data.map((item) => {
            if (typeof item === "string") {
              fields = fields.concat({label: item, value: item});
            } else {
              idKeys[key] = [];
              keysNames.push(Object.keys(item)[0]);
              item[Object.keys(item)[0]].map((object) => {
                Array.prototype.push.apply(idKeys[key], ([{label: object._id, value: object._id}]));
              });
              key++;
            }
          });
        }).catch((err) => console.log(err));

        this.setState(
          {fields: fields, idKeys: idKeys, keysNames: keysNames}
        )
      } else if (selectedOperation.value === operations[1].value || selectedOperation.value === operations[2].value
        || selectedOperation.value === operations[3].value) {
        this.extractionFields().then((res) => {
          console.log(res.data);
          this.setState(
            {
              fields: res.data.map((item) => {
                return {label: item, value: item}
              })
            })
        }).catch((err) => console.log(err));
      }
    }
  };

  create = (event, selectedTable, fields, keysNames) => {
    console.log("selectedTable.value");
    console.log(selectedTable.value);

    let payload = {};

    for (let i = 0; i < fields.length; i++) {
      console.log(event.target.elements['textInput' + i].value);

      //payload[item.value] = event.target.elements['textInput' + i].value
    }

    axios.post("/api/collections/", payload, {params: {table: selectedTable.value}}).then((res) => {
      console.log(res)
    }).catch((err) => console.log(err))
  };

  find = (selectedTable, selectedField, selectedValue) => {
    if (selectedField && selectedValue) {
      axios.get("/api/collections/find", {
        params: {
          table: selectedTable.value, field: selectedField.value,
          value: selectedValue.value
        }
      }).then((res) => {
        console.log(res)
      }).catch((err) => console.log(err))
    }
  };

  update = (selectedTable, selectedField, selectedValue) => {
    axios.put("/api/collections/update", {
        params: {
          table: selectedTable.value,
          field: selectedField.value, value: selectedValue
        }
      }
    ).then((res) => {
      console.log(res)
    }).catch((err) => console.log(err))
  };

  delete = (selectedTable, selectedField, selectedValue) => {
    axios.put("/api/collections/delete", {
        params: {
          table: selectedTable.value,
          field: selectedField.value,
          value: selectedValue.value
        }
      }
    ).then((res) => {
      console.log(res)
    }).catch((err) => console.log(err))
  };

  crud = (event) => {
    event.preventDefault();
    //Можна й в кожній функції деструктуризувати...
    const {selectedOperation, selectedTable, selectedField, selectedValue, operations, fields, keysNames} = this.state;

    console.log(selectedTable);
    if (selectedTable) {
      if (selectedOperation.value === operations[0].value) {
        this.create(event, selectedTable, fields, keysNames);
      } else if (selectedOperation.value === operations[1].value) {
        this.find(selectedTable, selectedField, selectedValue);
      } else if (selectedOperation.value === operations[2].value) {
        this.update(selectedTable, selectedField, selectedValue);
      } else if (selectedOperation.value === operations[3].value) {
        this.delete(selectedTable, selectedField, selectedValue);
      } else {
        alert("Please, make request correctly!")
      }
    }
  };

  render() {
    return (
      <div className="column">

        <div className="row">CRUD</div>

        <form className="row form" onSubmit={(e) => {
          this.crud(e)
        }}>

          <div>
            <div> Select operation</div>
            <Select
              value={this.state.selectedOperation}
              onChange={async (selected) => {
                await this.setState({
                  selectedOperation: selected,
                });
                await this.configureFieldsSelect()
              }}
              options={this.state.operations}
              styles={reactSelectStyles}/>
          </div>

          <div>
            <div> Select table</div>
            <Select
              name="tables"
              onChange={async (selected) => {
                await this.setState({selectedTable: selected});
                await this.configureFieldsSelect();

              }}
              options={this.state.tables}
              styles={reactSelectStyles}
            />
          </div>


          {this.state.selectedTable && this.state.selectedOperation.value === this.state.operations[0].value ?
            <div className="fieldsBlock">

              {this.state.idKeys.map((select, i) => {
                return <Select
                  className="field"
                  key={i}
                  name={"textInput" + i + this.state.fields.length}
                  options={select}
                  styles={reactSelectStyles}
                  placeholder={this.state.keysNames[i]}
                />
              })}

              {this.state.fields.map((field, i) => {
                return <input key={i} required name={"textInput" + i} className="input field"
                              placeholder={field.value}/>
              })}
            </div>
            :

            this.state.selectedTable ?
              <div>
                <div> Select field</div>
                <Select
                  name="fields"
                  onChange={(selected) => this.setState({
                    selectedField: selected,
                  })}
                  options={this.state.fields}
                  styles={reactSelectStyles}/>
              </div> : null
          }


          {this.state.selectedField && this.state.selectedOperation.value === this.state.operations[1].value ?
            <div>
              <div> Select value</div>
              <Select
                name="values"
                onChange={(selected) => this.setState({
                  selectedValue: selected,
                })}
                options={this.state.values}
                styles={reactSelectStyles}/>
            </div>

            : this.state.selectedField && this.state.selectedOperation.value === this.state.operations[2].value ?
              <input className="input" placeholder="Enter new data..."/> : null}

          <button className="button" type="submit">{this.state.selectedOperation.value + " this!"}</button>

        </form>
      </div>
    )
  }
}
//delete and read однакові

