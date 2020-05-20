import React from 'react';
import './Styles/Main.css';
import Crud from "./crud";
import Selection from "./Selections";


export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () =>
        <div className="wrapper">
            <Selection/>
            <Crud/>
        </div>
}
