import React from "react";
import HeadPhone from '../assets/img/headphones.svg';
import './css/Login.scss';
import {Link} from "react-router-dom";
import logo from '../assets/img/melo_logo.png'

class Login extends React.Component{
    render() {
        return(
            <section id="main">
                    <div className="nav-item">
                    </div>
                    <div className="main-row">
                        <div className="main-row-img">
                            <img className="head-phone-img" src={logo} alt=""/>
                        </div>
                        <div className="main-row-text">
                            <h1>DECENTRALIZED MUSIC</h1>
                            <p>Music of the people, by the people, to the people</p>
                            <Link to={"/home"} className="btn">
                                CONNECT WALLET
                            </Link>
                        </div>
                    </div>
            </section>
        );
    }
}

export default Login;