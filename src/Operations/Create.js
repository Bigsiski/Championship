import React from "react";
import {reactSelectStyles} from '../Styles/react-select';
import Select from 'react-select';

function Create(props) {
  return <div>
    <div className="fieldsBlock">

      {props.idKeys.map((select, i) => {
        return <Select
          className="field"
          key={i}
          name={"textSelect" + i}
          options={select}
          styles={reactSelectStyles}
          placeholder={props.keysNames[i]}
        />
      })}

      {props.fields.map((field, i) => {
        return <input key={i} required name={"textInput" + i} className="input field"
                      placeholder={field.value}/>
      })}
    </div>

  </div>
}

export default Create;
