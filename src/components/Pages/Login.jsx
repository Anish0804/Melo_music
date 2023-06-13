import React from "react";
import { Link, Redirect } from "react-router-dom";
import Web3 from "web3";
import HeadPhone from '../assets/img/headphones.svg';
import './css/Login.scss';
import logo from '../assets/img/melo_logo.png';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      account: "",
      redirectToHome: false,
    };
  }

  async connectWallet() {
    if (window.ethereum) {
      try {
        // Request account access from MetaMask
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();

        // Set the account and update the state
        this.setState({ loggedIn: true, account: accounts[0], redirectToHome: true });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  }

  render() {
    const { loggedIn, account, redirectToHome } = this.state;

    if (redirectToHome) {
      return <Redirect to="/home" />;
    }

    return (
      <section id="main">
        <div className="nav-item"></div>
        <div className="main-row">
          <div className="main-row-img">
            <img className="head-phone-img" src={logo} alt="" />
          </div>
          <div className="main-row-text">
            <h1>DECENTRALIZED MUSIC</h1>
            <p>Music of the people, by the people, to the people</p>
            {loggedIn ? (
              <p>Logged in with {account}</p>
            ) : (
              <button className="btn" onClick={() => this.connectWallet()}>
                CONNECT WALLET
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
