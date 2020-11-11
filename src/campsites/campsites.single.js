import React, { Component } from "react";
import FirebaseAdmin from "../firebase";
import DayPicker from "react-day-picker";
import MomentLocaleUtils from "react-day-picker/moment";
import * as dayjs from "dayjs";
import "dayjs/locale/he";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { CAMPSITES_METADATA } from "./constants";

class SingleDayCampsites extends Component {
  constructor(props) {
    super();
    dayjs.locale("he");
    const today = new Date();
    let tomorrow = new Date();
    let after = new Date();
    tomorrow.setDate(today.getDate() + 1);
    after.setDate(today.getDate() + 29);
    this.state = {
      selectedDay: tomorrow,
      selectedDayKey: 'date-' + dayjs().format('YYYY-MM-DD'),
      locale: "he",
      after: after,
    };
    
    this.handleDayClick = this.handleDayClick.bind(this);
    this.campsitesRef = FirebaseAdmin.database().ref("worker/latest");
    this.handleDayClick(this.state.selectedDay);
  }

  handleDayClick(day) {
    this.setState({ selectedDay: day });
    this.setState({
      selectedDayKey: "date-" + dayjs(day).format("YYYY-MM-DD"),
    });

    this.setState({ sites: {} });
    this.campsitesRef
      .child("days/date-" + dayjs(day).format("YYYY-MM-DD"))
      .once("value", (snapshot) => {
        const sites = snapshot.val();
        this.setState({ sites: sites });
      });

    this.campsitesRef.child("lastUpdate").once("value", (snapshot) => {
      const lastUpdate = snapshot.val();
      this.setState({ lastUpdate: lastUpdate });
    });
  }

  getWeekDay() {
    return dayjs(this.state.selectedDay).format("dddd");
  }

  formattedDayAndDate() {
    return `${dayjs(this.state.selectedDay).format("dddd")} ה-${dayjs(
      this.state.selectedDay
    ).format("DD/MM")}`;
  }

  formatDayDateTime(timestamp) {
    return `${dayjs(timestamp).format("DD/MM/YYYY HH:mm")}`;
  }

  render() {
    return (
      <div id="campsite-search" className="bg-teva-sand">
        <Container>
          <Row>
            <Col sm={6} xs={12} className="text-sm-left">
              <DayPicker
                disabledDays={{ before: new Date(), after: this.state.after }}
                modifiers={{ selectedDay: this.state.selectedDay }}
                onDayClick={this.handleDayClick}
                localeUtils={MomentLocaleUtils}
                locale={"he"}
              />
            </Col>

            <Col sm={6} xs={12} className="pt-3" style={{ textAlign: "right" }}>
              <strong className="text-xs-center">
                <span>זמינות חניוני לילה ביום </span>
                <span>{this.formattedDayAndDate()}</span>
              </strong>
              {this.state.sites
                ? Object.keys(this.state.sites).map((campId) => {
                    return (
                      <div
                        key={campId}
                        className={
                          "py-1 " +
                          (this.state.sites[campId].SumRoomsForSale <= 0
                            ? "text-muted"
                            : "")
                        }
                      >
                        <span
                          className="pl-1"
                          role="img"
                          aria-label="Tent emoji"
                        >
                          {this.state.sites[campId].SumRoomsForSale > 0
                            ? "⛺"
                            : "✖️"}
                        </span>
                        <span>{CAMPSITES_METADATA[campId].name} - </span>
                        {this.state.sites[campId].SumRoomsForSale > 0 ? (
                          <a
                            href={CAMPSITES_METADATA[campId].url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >{`${this.state.sites[campId].SumRoomsForSale} מקומות`}</a>
                        ) : (
                          <span>אין מקומות</span>
                        )}
                      </div>
                    );
                  })
                : null}
            </Col>
          </Row>
          <Row>
            <Col className="my-4">
              <Alert variant="success">
                <span>עדכון אחרון: </span>
                <span>{this.formatDayDateTime(this.state.lastUpdate)}</span>
              </Alert>

              <Alert variant="warning">
                שימו לב! לחלק מהחניונים יש מינימום 2 לילות
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SingleDayCampsites;
