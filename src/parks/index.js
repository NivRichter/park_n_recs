import React, { Component } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import MomentLocaleUtils from "react-day-picker/moment";
import "moment/locale/he";
import { PARKS_METADATA } from "./constants";
import {Container, Row, Col, ToggleButton, ButtonGroup} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";

class Parks extends Component {
  constructor(props) {
    super();

    this.state = {
      value: "",
      view: true,
      jsonData: {},
      picturesDB: {},
      avilableSites: {},
      selectedDay: undefined,
      formatDate: "",
      locale: "he",
      north: true,
      south: true,
      Jerusalem: true,
      center: true,
      first: true,
    };

    this.handleDayClick = this.handleDayClick.bind(this);
  }

  handleDayClick(day) {
    this.setState({
      selectedDay: day,
      view: false,
      north: true,
      south: true,
      Jerusalem: true,
      center: true,
      first: true,
    });
    this.setState({ formatDate: this.formatDate(day) }, function () {
      this.getData();
    });
  }

  getPicturesData() {
    const selectedDay = this.state.formatDate;
    let url = `https://checkfrontcom.checkfront.com/api/3.0/item?item_id=11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,3,30,32,33,34,37,38,39,4,40,44,45,48,49,50,51,52,53,54,55,56,57,59,6,60,61,62,64,65,66,67,69,7,76,77,8,80,81,82,9,90,93,94&start_date=${selectedDay}&end_date=${selectedDay}`;
    fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
    })
      .then((res) => res.json())
      .then((data) => this.setState({ picturesDB: data.items }));
  }

  getData() {
    this.getPicturesData();
    console.log("mounting APP");
    const selectedDay = this.state.formatDate;
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
          this.setState(
            { avilableSites: this.getAvailabeSites(), view: true },
            this.showAvailableSites
          )
        );
      });
  }

  showAvailableSites() {
    const sites = this.state.avilableSites;
  }

  getAvailabeSites() {
    const data = this.state.jsonData["items"];
    const ids = [
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      3,
      30,
      32,
      33,
      34,
      37,
      38,
      39,
      4,
      40,
      44,
      45,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      59,
      6,
      60,
      61,
      62,
      64,
      65,
      66,
      67,
      69,
      7,
      76,
      77,
      8,
      80,
      81,
      82,
      9,
      90,
      93,
      94,
    ];
    const date = this.state.formatDate;
    // const undefs = ids.filter((id)=>data[id] === undefined)
    // console.log(undefs)
    return ids.reduce(
      (acc, curr) =>
        data[curr][date] === 1
          ? { ...acc, [curr]: PARKS_METADATA[curr] }
          : acc,
      {}
    );
  }
  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("");
  }

  formatIsraeliDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  }

  render() {
    let avilableSites = this.state.avilableSites;
    let sitesTable = { north: [], center: [], Jerusalem: [], south: [] };
    let checkedN = this.state.north;
    let checkedJ = this.state.Jerusalem;
    let checkedC = this.state.center;
    let checkedS = this.state.south;
    const today = new Date();
    const fortnightAway = new Date(Date.now() + 12096e5);

    for (let id in avilableSites) {
      if (this.state.avilableSites[id]["region"]) {
        let name = avilableSites[id]["name"];
        let url = avilableSites[id]["url"];
        let region = this.state.avilableSites[id]["region"];
        if (this.state[region]) {
          let background =
            this.state.picturesDB[id]?.image?.[1]?.url ||
            this.state.picturesDB[id]?.image?.[2]?.url ||
            this.state.picturesDB[id]?.image?.[3]?.url;
          sitesTable[region].push(
            <div
              className="card w3-blue"
              key={id}
              style={{
                backgroundImage: "url(" + background + ")",
              }}
            >
              {" "}
              <a className="hyperLink" href={url}>
                {name}{" "}
              </a>
            </div>
          );
        }
      }
    }

    return (
        <div>
            <Container fluid className="bg-teva-sand">
                <Row>
                    <Col>
                    <div className="py-2">
                        <DayPicker
                        disabledDays={{ before: today, after: fortnightAway }}
                        modifiers={{ selectedDay: this.state.selectedDay }}
                        onDayClick={this.handleDayClick}
                        localeUtils={MomentLocaleUtils}
                        locale={this.state.locale}
                        />
                        {this.state.selectedDay ? (
                        //<p>You clicked {this.state.selectedDay.toLocaleDateString()}</p>
                        <div className="alert alert-warning">
                            <strong className="d-blockalert">
                            מציג אתרים הזמינים בתאריך:{" "}
                            {this.formatIsraeliDate(this.state.selectedDay)}
                            </strong>
                        </div>
                        ) : (
                        <h6 style={{ color: "#D35400" }}>
                            אנא בחרו תאריך לבדיקת זמינות
                        </h6>
                        )}
                    </div>
                    </Col>
                </Row>
            </Container>

            <Container fluid className="bg-teva-sand">
                <Row>
                    <Col>
                    <Container>
                        <Row>
                        <Col>
                            {!this.state.view ? (
                            <ClipLoader size={100} color={"#123abc"} loading={true} />
                            ) : (
                            <div>
                                <div>
                                {this.state.formatDate.length > 0 ? (
                                    <div>
                                    <div>
                                        <h4 className="d-block">סינון לפי איזור:</h4>
                                    </div>
                                    <ButtonGroup toggle className="my-2 d-flex">
                                        <ToggleButton
                                        className="Btn-region"
                                        type="checkbox"
                                        variant="secondary"
                                        checked={checkedN}
                                        value="1"
                                        onChange={(e) =>
                                            this.state.first
                                            ? this.setState({
                                                first: false,
                                                north: true,
                                                Jerusalem: false,
                                                center: false,
                                                south: false,
                                                })
                                            : this.setState({
                                                north: e.currentTarget.checked,
                                                })
                                        }
                                        >
                                        <a className="region">צפון</a>
                                        </ToggleButton>

                                        <ToggleButton
                                        className="Btn-region"
                                        type="checkbox"
                                        variant="secondary"
                                        checked={checkedJ}
                                        value="2"
                                        onChange={(e) =>
                                            this.state.first
                                            ? this.setState({
                                                first: false,
                                                north: false,
                                                Jerusalem: true,
                                                center: false,
                                                south: false,
                                                })
                                            : this.setState({
                                                Jerusalem: e.currentTarget.checked,
                                                })
                                        }
                                        >
                                        <a className="region"> ירושלים</a>
                                        </ToggleButton>

                                        <ToggleButton
                                        className="Btn-region"
                                        type="checkbox"
                                        variant="secondary"
                                        checked={checkedC}
                                        value="3"
                                        onChange={(e) =>
                                            this.state.first
                                            ? this.setState({
                                                first: false,
                                                north: false,
                                                Jerusalem: false,
                                                center: true,
                                                south: false,
                                                })
                                            : this.setState({
                                                center: e.currentTarget.checked,
                                                })
                                        }
                                        >
                                        <a className="region"> מרכז</a>
                                        </ToggleButton>

                                        <ToggleButton
                                        className="Btn-region"
                                        type="checkbox"
                                        variant="secondary"
                                        checked={checkedS}
                                        value="4"
                                        onChange={(e) =>
                                            this.state.first
                                            ? this.setState({
                                                first: false,
                                                north: false,
                                                Jerusalem: false,
                                                center: false,
                                                south: true,
                                                })
                                            : this.setState({
                                                south: e.currentTarget.checked,
                                                })
                                        }
                                        >
                                        <a className="region"> דרום</a>
                                        </ToggleButton>
                                    </ButtonGroup>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                </div>

                                {this.state.formatDate.length > 0 ? (
                                <div>
                                    <div className="alert mt-4 alert-info">
                                    <a
                                        className="refToStie"
                                        style={{
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        }}
                                    >
                                        למעבר להזמנת מקומות באתר רשות הטבע והגנים, לחצו
                                        על האתר המבוקש
                                    </a>
                                    </div>

                                    <div className="region bg-teva-lime mt-5 mb-2 py-2">
                                    <h3>צפון</h3>
                                    </div>
                                    <section className="basic-grid">
                                    {sitesTable["north"]}
                                    </section>

                                    <div className="region bg-teva-lime mt-5 mb-2 py-2">
                                    <h3>מרכז</h3>
                                    </div>
                                    <section className="basic-grid">
                                    {sitesTable["center"]}
                                    </section>

                                    <div className="region bg-teva-lime mt-5 mb-2 py-2">
                                    <h3>ירושלים</h3>
                                    </div>
                                    <section className="basic-grid">
                                    {sitesTable["Jerusalem"]}
                                    </section>

                                    <div className="region bg-teva-lime mt-5 mb-2 py-2">
                                    <h3>דרום</h3>
                                    </div>
                                    <section className="basic-grid">
                                    {sitesTable["south"]}
                                    </section>
                                </div>
                                ) : null}
                            </div>
                            )}
                        </Col>
                        </Row>
                    </Container>
                    </Col>
                </Row>
                </Container>
        </div>
    )
  }
}

export default Parks;
