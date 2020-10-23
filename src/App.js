import React, { Component, useState } from "react";
import logo from './logo.svg';
import './App.css';
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import ClipLoader from "react-spinners/ClipLoader";

import "bootstrap/dist/css/bootstrap.css";
import 'react-day-picker/lib/style.css';

import MomentLocaleUtils from 'react-day-picker/moment';

// Make sure moment.js has the required locale data
import 'moment/locale/he';


import {
  Button,
  Container,
  Row,
  Col,
  Fade,
  Table,
  ListGroup,
  Nav,
  Navbar,
  Form,
  FormControl,
  ToggleButton,
  ButtonGroup
} from "react-bootstrap";

import { isDOMComponent } from "react-dom/test-utils";
//https://checkfrontcom.checkfront.com/api/3.0/item?start_date =20201024&end_date=20201024
//11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,3,30,32,33,34,37,38,39,4,40,44,45,48,49,50,51,52,53,54,55,56,57,59,6,60,61,62,64,65,66,67,69,7,76,77,8,80,81,82,9,90,93,94
class App extends Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);



 
    this.state = {
      value: "",
      view:true,
      jsonData: {},
      picturesDB: {},
      avilableSites:{},
      selectedDay: undefined,
      formatDate: "",
      north: true,
      south: true,
      Jerusalem: true,
      center:true,
      first:true,
      sites_by_id : {
         "13":{
            "name":"שמורת טבע נחל עיון",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%A0%D7%97%D7%9C-%D7%A2%D7%99%D7%95%D7%9F-%D7%94%D7%AA%D7%A0%D7%95%D7%A8/#13",
            "region":"north"
         },
         "8":{
            "name":"גן לאומי מבצר נמרוד",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%9E%D7%91%D7%A6%D7%A8-%D7%A0%D7%9E%D7%A8%D7%95%D7%93-%D7%A7%D7%9C%D7%A2%D7%AA-%D7%A0%D7%9E%D7%A8%D7%95%D7%93/#13",
            "region":"north"
         },
         "77":{
            "name":"בניאס - מתחם המפל והשביל התלוי",
            "url":"https://www.parks.org.il/reserve-park/banias-mapal/#13",
            "region":"north"
         },
         "9":{
            "name":"בניאס - מתחם המעיינות",
            "url":"https://www.parks.org.il/reserve-park/banias/#13",
            "region":"north"
         },
         "11":{
            "name":"שמורת טבע תל דן",
            "url":"https://www.parks.org.il/reserve-park/שמורת-טבע-תל-דן/#13",
            "region":"north"
         },
         "12":{
            "name":"שמורת טבע נחל שניר",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%A0%D7%97%D7%9C-%D7%A9%D7%A0%D7%99%D7%A8-%D7%97%D7%A6%D7%91%D7%90%D7%A0%D7%99/#13",
            "region":"north"
         },
         "17":{
            "name":"שמורת טבע החולה",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%94%D7%97%D7%95%D7%9C%D7%94/#13",
            "region":"north"
         },
         "90":{
            "name":"גן לאומי חוף אכזיב",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-אכזיב-וחוף-אכזיב/#13",
            "region":"north"
         },
         "4":{
            "name":"גן לאומי ברעם",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-ברעם/#13",
            "region":"north"
         },
         "6":{
            "name":"גן לאומי תל חצור",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-תל-חצור/#13",
            "region":"north"
         },
         "7":{
            "name":"גן לאומי מבצר יחיעם",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%9E%D7%91%D7%A6%D7%A8-%D7%99%D7%97%D7%99%D7%A2%D7%9D/#13",
            "region":"north"
         },
         "15":{
            "name":"שמורת טבע נחל משושים",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%A0%D7%97%D7%9C-%D7%94%D7%9E%D7%A9%D7%95%D7%A9%D7%99%D7%9D/#13",
            "region":"north"
         },
         "14":{
            "name":"שמורת טבע יהודיה",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%99%D7%A2%D7%A8-%D7%99%D7%94%D7%95%D7%93%D7%99%D7%94/#13",
            "region":"north"
         },
         "5":{
            "name":"גן לאומי חורשת טל",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%97%D7%95%D7%A8%D7%A9%D7%AA-%D7%98%D7%9C/#13",
            "region":"north"
         },
         "25":{
            "name":"שמורת טבע נחל עמוד",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%A0%D7%97%D7%9C-%D7%A2%D7%9E%D7%95%D7%93/#13",
            "region":"north"
         },
         "19":{
            "name":"גן לאומי כורזים",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-כורזים/#13",
            "region":"north"
         },
         "16":{
            "name":"שמורת טבע גמלא",
            "url":"https://www.parks.org.il/reserve-park/שמורת-טבע-גמלא/#13",
            "region":"north"
         },
         "23":{
            "name":"שמורת טבע מג'רסה",
            "url":"https://www.parks.org.il/reserve-park/שמורת-הטבע-מגרסה-הבטיחה-בקעת-",
            "region":"north"
         },
         "22":{
            "name":"שמורת טבע עין אפק ",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%A2%D7%99%D7%9F-%D7%90%D7%A4%D7%A7/#13",
            "region":"north"
         },
         "24":{
            "name":"גן לאומי שמורת טבע ארבל",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-ושמורת-טבע-ארבל/#13",
            "region":"north"
         },
         "18":{
            "name":"גן לאומי כורסי",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-כורסי/#13",
            "region":"north"
         },
         "26":{
            "name":"גן לאומי חמת טבריה",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%97%D7%9E%D7%AA-%D7%98%D7%91%D7%A8%D7%99%D7%94/#13",
            "region":"north"
         },
         "32":{
            "name":"גן לאומי ציפורי",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-ציפורי/#13",
            "region":"north"
         },
         "33":{
            "name":"שמורת טבע חי בר - כרמל",
            "url":"https://www.parks.org.il/reserve-park/שמורת-טבע-חי-בר-בכרמל/#13",
            "region":"north"
         },
         "30":{
            "name":"גן לאומי בית שערים",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-בית-שערים/#13",
            "region":"north"
         },
         "34":{
            "name":"שמורת טבע נחל מערות",
            "url":"https://www.parks.org.il/reserve-park/שמורת-טבע-נחל-המערות/#13",
            "region":"north"
         },
         "20":{
            "name":"שמורת טבע חוף דור הבונים",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%97%D7%95%D7%A3-%D7%93%D7%95%D7%A8-%D7%94%D7%91%D7%95%D7%A0%D7%99%D7%9D/#13",
            "region":"north"
         },
         "27":{
            "name":"גן לאומי כוכב הירדן",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-כוכב-הירדן/#13",
            "region":"north"
         },
         "21":{
            "name":"גן לאומי מעיין חרוד",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-מעיין-חרוד/#13",
            "region":"north"
         },
         "28":{
            "name":"גן לאומי בית אלפא",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-בית-אלפא/#13",
            "region":"north"
         },
         "37":{
            "name":"שמורת טבע נחל תנינים",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%A0%D7%97%D7%9C-%D7%AA%D7%A0%D7%99%D7%A0%D7%99%D7%9D/#13",
            "region":"north"
         },
         "82":{
            "name":"גן לאומי קיסריה",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%A7%D7%99%D7%A1%D7%A8%D7%99%D7%94/#13",
            "region":"north"
         },
         "40":{
            "name":"גן לאומי אפולוניה",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%90%D7%A4%D7%95%D7%9C%D7%95%D7%A0%D7%99%D7%94-%D7%AA%D7%9C-%D7%90%D7%A8%D7%A9%D7%A3/#13",
            "region":"center"
         },
         "39":{
            "name":"גן לאומי ירקון – מתחם תל אפק (אנטיפטריס)",
            "url":"https://www.parks.org.il/reserve-park/yarkon-3/#13",
            "region":"center"
         },
         "38":{
            "name":"גן לאומי ירקון - מתחם מקורות הירקון",
            "url":"https://www.parks.org.il/reserve-park/yarkon-2/#13",
            "region":"center"
         },
         "45":{
            "name":"גן לאומי בית גוברין",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%91%D7%99%D7%AA-%D7%92%D7%95%D7%91%D7%A8%D7%99%D7%9F/#13",
            "region":"center"
         },
         "94":{
            "name":"שמורת טבע מערת הנטיפים",
            "url":"https://www.parks.org.il/reserve-park/שמורת-טבע-מערת-הנטיפים/#13",
            "region":"center"
         },
         "44":{
            "name":"אתר לאומי הקסטל",
            "url":"https://www.parks.org.il/reserve-park/%D7%90%D7%AA%D7%A8-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%94%D7%A7%D7%A1%D7%98%D7%9C/#13",
            "region":"center"
         },
         "48":{
            "name":"גן לאומי עין חמד",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-עין-חמד/#13",
            "region":"center"
         },
         "51":{
            "name":"גן לאומי נבי סמואל",
            "url":"https://www.parks.org.il/reserve-park/%D7%A4%D7%90%D7%A8%D7%A7-%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%A0%D7%91%D7%99-%D7%A1%D7%9E%D7%95%D7%90%D7%9C",
            "region":"Jerusalem"
         },
         "81":{
            "name":"שמורת טבע עין פרת",
            "url":"https://www.parks.org.il/reserve-park/שמורת-טבע-נחל-פרת-עין-פרת/#13",
            "region":"Jerusalem"
         },
         "55":{
            "name":"שמורת טבע עין מבוע",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%A0%D7%97%D7%9C-%D7%A4%D7%A8%D7%AA-%D7%A2%D7%99%D7%9F-%D7%9E%D7%91%D7%95%D7%A2",
            "region":"Jerusalem"
         },
         "54":{
            "name":"מוזיאון השומרוני הטוב",
            "url":"https://www.parks.org.il/reserve-park/מוזיאון-השומרוני-הטוב/#13",
            "region":"Jerusalem"
         },
         "50":{
            "name":"אתר הר גריזים",
            "url":"https://www.parks.org.il/reserve-park/הר-גריזים/#13",
            "region":"Jerusalem"
         },
         "49":{
            "name":"גן לאומי הרודיון",
            "url":"https://www.parks.org.il/reserve-park/%D7%A4%D7%90%D7%A8%D7%A7-%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%94%D7%A8%D7%95%D7%93%D7%99%D7%95%D7%9F/#13",
            "region":"Jerusalem"
         },
         "53":{
            "name":"גן לאומי קומראן",
            "url":"https://www.parks.org.il/reserve-park/פארק-גן-לאומי-קומראן/#13",
            "region":"Jerusalem"
         },
         "80":{
            "name":"אתר הטבילה קאסר אל יהוד",
            "url":"https://www.parks.org.il/reserve-park/%D7%90%D7%AA%D7%A8-%D7%94%D7%98%D7%91%D7%99%D7%9C%D7%94-%D7%A7%D7%90%D7%A1%D7%A8-%D7%90%D7%9C-%D7%99%D7%94%D7%95%D7%93",
            "region":"Jerusalem"
         },
         "56":{
            "name":"שמורת טבע עיינות צוקים",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%A2%D7%99%D7%99%D7%A0%D7%95%D7%AA-%D7%A6%D7%95%D7%A7%D7%99%D7%9D-%D7%A2%D7%99%D7%9F-%D7%A4%D7%A9%D7%97%D7%94/#13",
            "region":"Jerusalem"
         },
         "52":{
            "name":"תל חברון",
            "url":"https://www.parks.org.il/reserve-park/%D7%AA%D7%9C-%D7%97%D7%91%D7%A8%D7%95%D7%9F/#13",
            "region":"Jerusalem"
         },
         "57":{
            "name":"שמורת טבע עין גדי- נחל דוד",
            "url":"https://www.parks.org.il/reserve-park/david/#13",
            "region":"south"
         },
         "69":{
            "name":"שמורת טבע עין גדי - נחל ערוגות",
            "url":"https://www.parks.org.il/reserve-park/arugot/#13",
            "region":"south"
         },
         "3":{
            "name":"גן לאומי מצדה",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%9E%D7%A6%D7%93%D7%94/#13",
            "region":"south"
         },
         "64":{
            "name":"גן לאומי תל באר שבע",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%AA%D7%9C-%D7%91%D7%90%D7%A8-%D7%A9%D7%91%D7%A2/#13",
            "region":"south"
         },
         "60":{
            "name":"גן לאומי תל ערד",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-תל-ערד/#13",
            "region":"south"
         },
         "65":{
            "name":"גן לאומי פארק הבשור (אשכול)",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%94%D7%91%D7%A9%D7%95%D7%A8-%D7%A4%D7%90%D7%A8%D7%A7-%D7%90%D7%A9%D7%9B%D7%95%D7%9C/#13",
            "region":"south"
         },
         "61":{
            "name":"גן לאומי ממשית",
            "url":"https://www.parks.org.il/reserve-park/גן-לאומי-ממשית/#13",
            "region":"south"
         },
         "76":{
            "name":"גן לאומי עין עבדת",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%A2%D7%99%D7%9F-%D7%A2%D7%91%D7%93%D7%AA/#13",
            "region":"south"
         },
         "62":{
            "name":"גן לאומי עבדת",
            "url":"https://www.parks.org.il/reserve-park/%D7%92%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%A2%D7%91%D7%93%D7%AA/#13",
            "region":"south"
         },
         "59":{
            "name":"שמורת טבע ומרכז מבקרים מכתש רמון",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%95%D7%9E%D7%A8%D7%9B%D7%96-%D7%9E%D7%91%D7%A7%D7%A8%D7%99%D7%9D-%D7%9E%D7%9B%D7%AA%D7%A9-%D7%A8%D7%9E%D7%95%D7%9F/#13",
            "region":"south"
         },
         "93":{
            "name":"חי רמון ",
            "url":"https://www.parks.org.il/reserve-park/chay-ramon/#13",
            "region":"south"
         },
         "67":{
            "name":"שמורת טבע חי בר יוטבתה",
            "url":"https://www.parks.org.il/reserve-park/%D7%A9%D7%9E%D7%95%D7%A8%D7%AA-%D7%98%D7%91%D7%A2-%D7%97%D7%99-%D7%91%D7%A8-%D7%99%D7%95%D7%98%D7%91%D7%AA%D7%94-2/#13",
            "region":"south"
         },
         "66":{
            "name":"שמורת טבע חוף האלמוגים",
            "url":"https://www.parks.org.il/reserve-park/שמורת-טבע-חוף-האלמוגים/#13",
            "region":"south"
         },
      }
    };

   
  }



  handleDayClick(day) {
    this.setState({ selectedDay: day, view:false,  
       north: true,
      south: true,
      Jerusalem: true,
      center:true,
      first:true, });
    this.setState({formatDate:this.formatDate(day)}, function () {
      this.getData()
    })

  }

  getPicturesData(){
   const selectedDay = this.state.formatDate
   let url = `https://checkfrontcom.checkfront.com/api/3.0/item?item_id=11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,3,30,32,33,34,37,38,39,4,40,44,45,48,49,50,51,52,53,54,55,56,57,59,6,60,61,62,64,65,66,67,69,7,76,77,8,80,81,82,9,90,93,94&start_date=${selectedDay}&end_date=${selectedDay}`;
   fetch(url, {
     method: "GET", // *GET, POST, PUT, DELETE, etc.
     mode: "cors", // no-cors, *cors, same-origin
     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
     credentials: "same-origin", // include, *same-origin, omit
   })
     .then((res) => res.json())
     .then((data) =>this.setState({ picturesDB: data.items }) )
}

  getData() {
   this.getPicturesData()
    console.log("mounting APP");
    const selectedDay = this.state.formatDate
    let url = `https://checkfrontcom.checkfront.com/api/3.0/item/cal?item_id=11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,3,30,32,33,34,37,38,39,4,40,44,45,48,49,50,51,52,53,54,55,56,57,59,6,60,61,62,64,65,66,67,69,7,76,77,8,80,81,82,9,90,93,94&start_date=${selectedDay}&end_date=${selectedDay}`;
    //let url = "https://checkfrontcom.checkfront.com/api/3.0/item/cal?item_id=40,14,77&start_date=20201024&end_date=20201025"
    fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ jsonData: data }, () => 
          this.setState({avilableSites:this.getAvailabeSites(), view:true}, this.showAvailableSites
          ))
      });
    }

  showAvailableSites(){
    const sites = this.state.avilableSites;
  }

getAvailabeSites(){
  const data = this.state.jsonData["items"];
  const ids = [11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,3,30,32,33,34,37,38,39,4,40,44,45,48,49,50,51,52,53,54,55,56,57,59,6,60,61,62,64,65,66,67,69,7,76,77,8,80,81,82,9,90,93,94]
  const date = this.state.formatDate
  // const undefs = ids.filter((id)=>data[id] === undefined)
  // console.log(undefs)
  return ids.reduce( (acc,curr)=> data[curr][date]===1 ? {...acc, [curr]:this.state.sites_by_id[curr] }: acc ,{})

}
 formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('');
}

formatIsraeliDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [day,month,year].join('/');
}

  render() {
 
    let avilableSites = this.state.avilableSites;
    let sitesTable ={north: [], center: [], Jerusalem:[], south:[]};
    let checkedN = this.state.north;
    let checkedJ = this.state.Jerusalem;
    let checkedC = this.state.center;
    let checkedS = this.state.south;
    const today = new Date();
    const fortnightAway = new Date(Date.now() + 12096e5);




    for ( let id in avilableSites){
      if(this.state.avilableSites[id]["region"]){
         let name = avilableSites[id]["name"]
         let url = avilableSites[id]["url"]
         let region = this.state.avilableSites[id]["region"]
         if (this.state[region]){
            let background = this.state.picturesDB[id]?.image?.[1]?.url || this.state.picturesDB[id]?.image?.[2]?.url || this.state.picturesDB[id]?.image?.[3]?.url 
            sitesTable[region].push (
               <div className="card w3-blue" style={{ 
                  backgroundImage:"url("+background+")"
               }} > <a className ="hyperLink" href={url}>{name} </a></div>
        )
      }

      }
    
    }

    return (

      <div className="App" >
  

        <div>
        <Navbar bg="light" variant="light">
               <a className ="hyperLink"  style={{marginLeft:"auto", marginRight: "auto"}} href="https://www.parks.org.il/%D7%94%D7%96%D7%9E%D7%A0%D7%95%D7%AA-%D7%9C%D7%90%D7%AA%D7%A8%D7%99%D7%9D/">
                  לאתר רשות הטבע והגנים לחץ כאן
               </a>
          {/* <Form inline>
            <Button variant="outline-info" onClick={randomClicked}>הגרל אתר שפנוי היום</Button>
          </Form> */}
      </Navbar>
        </div>

        <div style ={{ backgroundColor:"#FEF9E7", marginLeft:"auto", marginRight:"auto", width:"auto"}}>
        <DayPicker  disabledDays={{ before: today , after: fortnightAway}}  onDayClick={this.handleDayClick}  />
        {this.state.selectedDay ? 
          //<p>You clicked {this.state.selectedDay.toLocaleDateString()}</p>
          <p>מציג אתרים הזמינים בתאריך:  {this.formatIsraeliDate(this.state.selectedDay)}</p>
             : 
          <h6 style ={{ color:"#D35400"}}>אנא בחר תאריך לבדיקת זמינות</h6>
        }
      </div>

      <div>
        {
          !this.state.view ?
              <ClipLoader
              size={100 }
              color={"#123abc"}
              loading={true}
                />    
          :
          <div>
           
           <div>
         {
            this.state.formatDate.length > 0?
               <div>
                  <ButtonGroup toggle className="mb-2">
                  
                  <ToggleButton
                           className="Btn-region"
                           type="checkbox"
                           variant="secondary"
                           checked={checkedN}
                           value="1"
                           onChange={(e) => this.state.first? 
                                                   this.setState({first:false, north: true, Jerusalem:false,center:false, south:false}) 
                                                   : this.setState({north: e.currentTarget.checked})          
                                       }
                           >
                           <p class="region"> צפון</p>
                     </ToggleButton>

                     <ToggleButton
                           className="Btn-region"

                           type="checkbox"
                           variant="secondary"
                           checked={checkedJ}
                           value="2"
                           onChange={(e) => this.state.first? 
                              this.setState({first:false, north: false, Jerusalem:true,center:false, south:false}) 
                              : this.setState({Jerusalem: e.currentTarget.checked})  }>
                           <a class="region"> ירושלים</a>
                     </ToggleButton>

                     <ToggleButton
                     className="Btn-region"
                           type="checkbox"
                           variant="secondary"
                           checked={checkedC}
                           value="3"
                           onChange={(e) =>this.state.first? 
                              this.setState({first:false, north: false, Jerusalem:false,center:true, south:false}) 
                              : this.setState({center: e.currentTarget.checked})  }>
                        <a class="region"> מרכז</a>

                     </ToggleButton>

                     <ToggleButton
                     className="Btn-region"
                           type="checkbox"
                           variant="secondary"
                           checked={checkedS}
                           value="4"
                           onChange={(e) =>this.state.first? 
                              this.setState({first:false, north: false, Jerusalem:false,center:false, south:true}) 
                              : this.setState({south: e.currentTarget.checked})  }>
                           <a class="region"> דרום</a>
                     </ToggleButton>
                     <h4>
                  : סינון לפי איזור

                  </h4>
                     </ButtonGroup>
               </div>
            : null
         }
             
            </div>



               
               {
                  this.state.formatDate.length > 0 ?
                  <div>
                     <a className ="refToStie"  style={{marginLeft:"auto", marginRight: "auto", color: "white", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}} >
                        למעבר להזמנת מקומות באתר רשות הטבע והגנים, לחץ על האתר המבוקש
                     </a>
                     <div style={{backgroundColor:'#bada55'}} >
                        <a className="region">
                           <h3>צפון</h3>
                        </a>
                   
                     </div>
                        <section class="basic-grid">
                        {sitesTable["north"]}
                  

                        </section>
                        <div style={{backgroundColor:'#bada55'}} >
                           <a className="region">
                              <h3>מרכז</h3>
                           </a>
                        </div>

                        <section class="basic-grid">
                        {sitesTable["center"]}

                        </section>

                        <div style={{backgroundColor:'#bada55'}} >
                        <a className="region">
                        <h3>ירושלים</h3>
                        </a>
                        </div>

                        <section class="basic-grid">
                        {sitesTable["Jerusalem"]}

                        </section>

                        <div style={{backgroundColor:'#bada55'}} >
                        <a className="region">
                            <h3>דרום</h3>
                        </a>
                        </div>
                        <section class="basic-grid">
                        {sitesTable["south"]}

                        </section>
                     </div>

                  :
                  null
               }
               
            </div>

        }

        </div>

      </div>
    );
  }
}

export default App;
