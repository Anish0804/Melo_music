import React from "react";
import {Link} from "react-router-dom";
import "../assets/scss/Brand.scss";
import Logo from "../assets/img/melo_logo.png"

class Brand extends React.Component {
    render() {
        return (
            <div  className={"brand"} style={{ transform: "scaleY(-1)"}}>
                <Link to={"/home"}>
                    
                        <img src={Logo} flip={"180"} height={"60px"} alt=""/>

                </Link>
            </div>
        );
    }
}

export default Brand;