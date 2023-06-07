import React, {useContext, useState} from "react";
import '../assets/scss/Navigation.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DropDownLanguageList from "./DropDownLanguageList";
import SearchBar from "./SearchBar";
import Brand from "./Brand";
import DropDownProfile from "./DropDownProfile";
import {Avatar, Button} from "@material-ui/core";
import {ThemeContext} from "../../api/Theme";
import profilepic from '../assets/img/avatar2.jpg';

function Navigation() {

    const [isLanguageListOpen, setLangList] = useState(false);
    const [isOpenProfile, setOpenProfile] = useState(false);


    function handleOpenLanguageList() {
        if (isOpenProfile === true)
            setOpenProfile(!isOpenProfile);
        setLangList(!isLanguageListOpen);
    }

    function handleOpenProfile() {
        if (isLanguageListOpen === true)
            setLangList(!isLanguageListOpen);
        setOpenProfile(!isOpenProfile);
    }
    const useStyle = useContext(ThemeContext);
    return (
        <nav style={useStyle.component}>
            <Brand/>
            <div className={"navigation"}>
               {/* <NavigationButton href={"/home"} name={"Home"}/>*/}
               {/* <NavigationButton href={"/home/about"} name={"About"}/>*/}
                {/*<NavigationButton href={"/home/add"} name={"Add"}/>*/}
            </div>
            <SearchBar/>
            <div className="profile" onClick={handleOpenProfile}>
                <Button className={"Dropdown-btn"}>
                    <img src={profilepic} style={{width:'60px', background:'rgba(255, 255, 255, 0.344)',borderRadius: '50%', padding:'3px'}} alt="" />
                </Button>
                {
                    isOpenProfile &&
                    <DropDownProfile/>
                }
            </div>
        </nav>
    );
}

export default Navigation;