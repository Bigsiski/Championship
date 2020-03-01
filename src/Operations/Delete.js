import React from "react";
import {reactSelectStyles} from '../Styles/react-select';
import Select from 'react-select';

function Delete(props) {
  return <div className="row">
    <div>
      <div> Select field</div>
      <Select
        value={props.selectedField}
        name="fields"
        onChange={async (selected) => {
          await props.setSelectedValue("selectedField", selected)
          props.onFieldsChange()
        }}
        options={props.fields}
        styles={reactSelectStyles}/>
    </div>

    {props.selectedField ?
    <div className="column">
      <div> Select value</div>
      <Select
        name="values"
        onChange={(selected) => props.setSelectedValue("selectedValue", selected)}
        options={props.values}
        styles={reactSelectStyles}/>
    </div> : null}

  </div>
}

export default Delete;
