import React from 'react';
import * as THREE from 'three'
import './Styles/Main.css';
import Crud from "./crud";
import Selection from "./Selections";


export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.yourElement = React.createRef();
    }

    componentDidMount() {
        this.vantaEffect = VANTA.CELLS({
            el: this.yourElement.current,
            color: 0x153c09,
            THREE: THREE
        });
    }

    render = () =>
        <div className="wrapper" ref={this.yourElement}>
            <Selection/>
            <Crud/>
        </div>
}
