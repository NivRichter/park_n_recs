import React, { Component } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import MomentLocaleUtils from "react-day-picker/moment";
import "moment/locale/he";
import ReactGA from "react-ga";
import { PARKS_METADATA } from "./constants";
import {
  Container,
  Row,
  Col,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import Fuse from "fuse.js";

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
      suggestions: [],
      chosen_park: "",
      input: "",
    };

    this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount() {
    this.initData();
    this.getAllSitesName();
  }

  initData() {
    // console.log("init data");
    let url = `https://checkfrontcom.checkfront.com/api/3.0/item`;
    fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
    })
      .then((res) => res.json())
      .then((data) =>
        this.setState({ picturesDB: data.items }, function () {
          this.getAllSitesName();
        })
      );
  }

  getAllSitesName() {
    const sitesData = this.state.picturesDB;
    let names = [];
    for (let item_id in sitesData) {
      names = names.concat([sitesData[item_id]["name"]]);
    }
    this.setState({ suggestions: names });
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

  // getPicturesData() {
  //   const selectedDay = this.state.formatDate;
  //   let url = `https://checkfrontcom.checkfront.com/api/3.0/item?item_id=11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,3,30,32,33,34,37,38,39,4,40,44,45,48,49,50,51,52,53,54,55,56,57,59,6,60,61,62,64,65,66,67,69,7,76,77,8,80,81,82,9,90,93,94&start_date=${selectedDay}&end_date=${selectedDay}`;
  //   fetch(url, {
  //     method: "GET", // *GET, POST, PUT, DELETE, etc.
  //     mode: "cors", // no-cors, *cors, same-origin
  //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //     credentials: "same-origin", // include, *same-origin, omit
  //   })
  //     .then((res) => res.json())
  //     .then((data) => this.setState({ picturesDB: data.items }));
  // }

  async getData() {
    //await this.getPicturesData()
    const selectedDay = this.state.formatDate; //let url = "https://checkfrontcom.checkfront.com/api/3.0/item/cal?item_id=40,14,77&start_date=20201024&end_date=20201025"
    let url = `https://checkfrontcom.checkfront.com/api/3.0/item/cal?start_date%20=${selectedDay}&end_date=${selectedDay}`;
    fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
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

  convertRegionID2Name(id) {
    switch (id) {
      case 56:
        return "north";
      case 57:
        return "center";
      case 58:
        return "Jerusalem";
      case 59:
        return "south";
      default:
        return "center";
    }
  }

  getAvailabeSites() {
    const sitesAvailablity = this.state.jsonData["items"];
    //const ids = [11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,3,30,32,33,34,37,38,39,4,40,44,45,48,49,50,51,52,53,54,55,56,57,59,6,60,61,62,64,65,66,67,69,7,76,77,8,80,81,82,9,90,93,94]
    const date = this.state.formatDate;
    const sitesData = this.state.picturesDB;
    let avilableSites = {};
    let repeated_sites_to_ignore = [];
    for (let item_id in sitesAvailablity) {
      if (!repeated_sites_to_ignore.includes(item_id)) {
        if (sitesAvailablity[item_id][date] === 1 && PARKS_METADATA[item_id]) {
          if (sitesData[item_id]["product_group_children"].length > 0) {
            let to_ignore = sitesData[item_id]["product_group_children"];
            //console.log(`to ignore: ${typeof(to_ignore)}`)
            repeated_sites_to_ignore = repeated_sites_to_ignore.concat(
              to_ignore.reduce((acc, curr) => acc.concat([curr["item_id"]]), [])
            );
          }
          avilableSites[item_id] = {
            name: sitesData[item_id]["name"],
            url: PARKS_METADATA[item_id]?.["url"],
            region: this.convertRegionID2Name(
              sitesData[item_id]["category_id"]
            ),
          };
        }
      }
    }
    return avilableSites;
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

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  render() {
    let avilableSites = this.state.avilableSites;
    let sitesTable = { north: [], center: [], Jerusalem: [], south: [] };
    let checkedN = this.state.north;
    let checkedJ = this.state.Jerusalem;
    let checkedC = this.state.center;
    let checkedS = this.state.south;
    let parks_names = [];
    const today = new Date();
    const fortnightAway = new Date(Date.now() + 12096e5);
    let input = this.state.input;

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
          parks_names.push(name);
          sitesTable[region].push({
            name: name,
            element: (
              <ReactGA.OutboundLink 
                eventLabel={`goTo park ${id} - ${name}`} 
                onClick={() => ReactGA.event({category: 'ganleumi.online', action: 'parks - click', label: `goTo park ${id} - ${name}`, value: id})}
                to={url} 
                target="_blank"
                className="hyperLink" 
                key={id}>
                <div
                  className="card w3-blue"
                  style={{ backgroundImage: "url(" + background + ")" }}
                >
                  <span className="hyperLink">{name}</span>
                </div>
              </ReactGA.OutboundLink>
            ),
          });
        }
      }
    }

    const fuseNorth = new Fuse(sitesTable["north"], {
      keys: ["name"],
      threshold: 0.5,
    });
    const fuseCenter = new Fuse(sitesTable["center"], {
      keys: ["name"],
      threshold: 0.5,
    });
    const fuseJerusalem = new Fuse(sitesTable["Jerusalem"], {
      keys: ["name"],
      threshold: 0.5,
    });
    const fuseSouth = new Fuse(sitesTable["south"], {
      keys: ["name"],
      threshold: 0.5,
    });

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

                              <Row>
                                <Col>
                                  חיפוש:
                                  <input
                                    type="text"
                                    value={this.state.input}
                                    onChange={this.handleChange}
                                    placeholder="הכנס שם פארק לאומי"
                                  />
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>

                        {this.state.formatDate.length > 0 ? (
                          <div>
                            <div className="alert mt-4 alert-info">
                              <span
                                className="refToStie"
                                style={{
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                למעבר להזמנת מקומות באתר רשות הטבע והגנים, לחצו
                                על האתר המבוקש
                              </span>
                            </div>

                            <div className="region bg-teva-lime mt-5 mb-2 py-2">
                              <h3>צפון</h3>
                            </div>
                            <section className="basic-grid">
                              {input.length === 0
                                ? sitesTable.north.map((item) => item.element)
                                : fuseNorth
                                    .search(this.state.input)
                                    .map((x) => x.item.element)}
                            </section>

                            <div className="region bg-teva-lime mt-5 mb-2 py-2">
                              <h3>מרכז</h3>
                            </div>
                            <section className="basic-grid">
                              {input.length === 0
                                ? sitesTable.center.map((item) => item.element)
                                : fuseCenter
                                    .search(this.state.input)
                                    .map((x) => x.item.element)}{" "}
                            </section>

                            <div className="region bg-teva-lime mt-5 mb-2 py-2">
                              <h3>ירושלים</h3>
                            </div>
                            <section className="basic-grid">
                              {input.length === 0
                                ? sitesTable.Jerusalem.map(
                                    (item) => item.element
                                  )
                                : fuseJerusalem
                                    .search(this.state.input)
                                    .map((x) => x.item.element)}
                            </section>

                            <div className="region bg-teva-lime mt-5 mb-2 py-2">
                              <h3>דרום</h3>
                            </div>
                            <section className="basic-grid">
                              {input.length === 0
                                ? sitesTable.south.map((item) => item.element)
                                : fuseSouth
                                    .search(this.state.input)
                                    .map((x) => x.item.element)}
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
    );
  }
}

export default Parks;
