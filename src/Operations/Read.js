import React from "react";
import {reactSelectStyles} from '../Styles/react-select';
import Select from 'react-select';

function Read(props) {
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


    <div className="row">
      <div className="column">
        <div> Select value</div>
        <Select
          name="values"
          onChange={(selected) => props.setSelectedValue("selectedValue", selected)}
          options={props.values}
          styles={reactSelectStyles}/>
      </div>

      <div className="row">
        {props.data && props.data.map((item, i) => {
          console.log(item)
          return <div key={i} className="column">
            {Object.keys(item).map((field, i) => {

              if (!Array.isArray(item[field])) {
                return <div key={i} className="row">
                  <label>{field}</label>
                  <label>{item[field]}</label>
                </div>
              }
            })
            }
          </div>
        })}
      </div>

    </div>
  </div>
}

export default Read;
