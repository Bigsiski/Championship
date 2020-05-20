import React from 'react';
import './Styles/Main.css';

import {reactSelectStyles} from './Styles/react-select';
import Select from 'react-select';
import axios from "axios";

import Create from "./Operations/Create"
import Read from "./Operations/Read"
import Update from "./Operations/Update"
import Delete from "./Operations/Delete"

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
            selectedValue: null,
            data: null
        };
    }

    componentDidMount() {
        axios.get("/api/collections", {}).then((res) => {
            this.setState({
                tables: res.data.map((item) => {
                    return {label: item, value: item}
                })
            });
        }).catch((err) => console.log(err))
    }

    setSelectedValue = (property, selectedValue) => {
        this.setState({[property]: selectedValue})
    };

    getMatadata = (selectedTable, requireParents) => {
        return axios.get("/api/collections/metadata", {
            params: {
                table: selectedTable.value,
                requireParents: requireParents
            }
        })
    };

    onFieldsChange = () => {
        const {selectedOperation, operations, selectedTable, selectedField} = this.state;
        if (selectedOperation.value === operations[1].value || selectedOperation.value === operations[3].value) {
            this.extract(selectedTable, selectedField).then((res) => {
                this.setState({
                    values: res.data.map((item) => {
                        return {label: item[Object.keys(item)[0]], value: item[Object.keys(item)[0]]}
                    })
                })
            }).catch((err) => console.log(err));
        } else if (selectedOperation.value === operations[2].value) {
            this.getMatadata(selectedTable).then((res) => {
                console.log(res.data);
                this.setState(
                    {
                        values: res.data.map((item) => {
                            return {label: item, value: item}
                        })
                    })
            }).catch((err) => console.log(err));
        }
    };

    configureFieldsSelect = async () => {
        const {selectedOperation, selectedTable, operations} = this.state;
        this.setState({
            selectedField: null, values: [], selectedValue: null, data: null
        });

        if (selectedTable) {
            if (selectedOperation.value === operations[0].value) {
                let fields = [], idKeys = [], keysNames = [];

                await this.getMatadata(selectedTable, true).then((res) => {
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
            } else if (selectedOperation.value === operations[1].value || selectedOperation.value === operations[3].value) {
                this.getMatadata(selectedTable).then((res) => {
                    console.log(res.data);
                    this.setState(
                        {
                            fields: res.data.map((item) => {
                                return {label: item, value: item}
                            })
                        })
                }).catch((err) => console.log(err));
            } else if (selectedOperation.value === operations[2].value) {
                this.extract(selectedTable).then((res) => {
                    this.setState(
                        {
                            fields: res.data.map((item) => {
                                console.log(item)
                                return {label: item._id, value: item._id}
                            })
                        });
                }).catch((err) => console.log(err));
            }
        }
    };

    create = (event, selectedTable, fields, keysNames) => {
        let payload = {};
        payload.Parents = [];

        for (let i = 0; i < keysNames.length; i++) {
            payload.Parents[i] = {};
            payload.Parents[i]._id = event.target.elements['textSelect' + i].value;
            payload.Parents[i].ParentName = keysNames[i]; //necessary only on server working
        }
        for (let i = 0; i < fields.length; i++) {
            payload[fields[i].value] = event.target.elements['textInput' + i].value;
            event.target.elements['textInput' + i].value = "";
        }

        axios.post("/api/collections", payload, {params: {table: selectedTable.value}})
            .catch((err) => console.log(err))
    };

    extract = (selectedTable, selectedField) => {
        let field;
        if (selectedField) {
            field = selectedField.value;
        } else {
            field = "_id"
        }
        return axios.get("/api/collections/extract", {
            params: {
                table: selectedTable.value, projection: field,
            }
        })
    };

    find = (selectedTable, selectedField, selectedValue) => {
        if (selectedField && selectedValue) {
            axios.get("/api/collections/extract", {
                params: {
                    table: selectedTable.value, field: selectedField.value,
                    value: selectedValue.value
                }
            }).then(async (res) => {
                await this.setState({
                    data: res.data
                });
            }).catch((err) => console.log(err))
        }
    };

    update = (selectedTable, selectedField, selectedValue, event) => {
        axios.put("/api/collections", {newData: {[selectedValue.value]: event.target.elements['updateValue'].value}},
            {
                params: {
                    table: selectedTable.value,
                    field: selectedField.value
                }
            }
        ).then((res) => {
            console.log(res)
        }).catch((err) => console.log(err))
    };

    delete = (selectedTable, selectedField, selectedValue) => {
        axios.delete("/api/collections", {
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
        const {selectedOperation, selectedTable, selectedField, selectedValue, operations, fields, keysNames, idKeys} = this.state;

        if (selectedTable) {
            if (selectedOperation.value === operations[0].value) {
                this.create(event, selectedTable, fields, keysNames, idKeys);
            } else if (selectedOperation.value === operations[1].value) {
                this.find(selectedTable, selectedField, selectedValue);
            } else if (selectedOperation.value === operations[2].value) {
                this.update(selectedTable, selectedField, selectedValue, event);
            } else if (selectedOperation.value === operations[3].value) {
                this.delete(selectedTable, selectedField, selectedValue);
            } else {
                alert("Please, make request correctly!")
            }
        }
    };

    render() {
        const {selectedOperation, operations, selectedField, selectedTable, tables, idKeys, fields, keysNames, values, data} = this.state;
        return (
            <div className="column">

                <div className="row">CRUD</div>

                <form className="row form" onSubmit={(e) => {
                    this.crud(e)
                }}>

                    <div>
                        <div> Select operation</div>
                        <Select
                            value={selectedOperation}
                            onChange={async (selected) => {
                                await this.setState({
                                    selectedOperation: selected,
                                });
                                await this.configureFieldsSelect()
                            }}
                            options={operations}
                            styles={reactSelectStyles}/>
                    </div>

                    <div>
                        <div> Select table</div>
                        <Select
                            value={selectedTable}
                            name="tables"
                            onChange={async (selected) => {
                                await this.setState({selectedTable: selected});
                                await this.configureFieldsSelect();

                            }}
                            options={tables}
                            styles={reactSelectStyles}
                        />
                    </div>

                    {selectedTable ?
                        selectedOperation.value === operations[0].value ?
                            <Create idKeys={idKeys} keysNames={keysNames} fields={fields}/> :
                            selectedOperation.value === operations[1].value ?
                                <Read selectedField={selectedField} setSelectedValue={this.setSelectedValue}
                                      onFieldsChange={this.onFieldsChange}
                                      fields={fields} values={values} data={data}
                                /> : this.state.selectedOperation.value === this.state.operations[2].value ?
                                <Update selectedField={selectedField} setSelectedValue={this.setSelectedValue}
                                        onFieldsChange={this.onFieldsChange} fields={fields} values={values}/>
                                : <Delete selectedField={selectedField} setSelectedValue={this.setSelectedValue}
                                          onFieldsChange={this.onFieldsChange} fields={fields} values={values}/>
                        : null}

                    <button className="button" type="submit">{selectedOperation.value + " this!"}</button>
                </form>
            </div>)
    }
}
