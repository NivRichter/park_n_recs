import React, { Component } from "react";
import DayPicker from "react-day-picker";
import MomentLocaleUtils from "react-day-picker/moment";
import * as dayjs from "dayjs";
import "dayjs/locale/he";
import { Container, Row, Col, Alert } from "react-bootstrap";
import ReactGA from "react-ga";
import { CAMPSITES_METADATA } from "./constants";
import axios from 'axios';

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
    ReactGA.pageview('/campsites');
  }

  componentDidMount() {
    // axios.get('https://ganleumi-campsites-latest.riido.workers.dev/latest')
    axios.get('https://ganleumi.riido.workers.dev/campsites')
    .then(response => {
      if(response.status === 200 && response.data) {
        this.setState({latest: response.data});
        this.handleDayClick(this.state.selectedDay);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleDayClick(day) {
    this.setState({ selectedDay: day });
    this.setState({
      selectedDayKey: 'date-' + dayjs(day).format("YYYY-MM-DD"),
    });

    ReactGA.event({
      category: 'ganleumi.online',
      action: 'campsites - change date'
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
              {this.state.latest?.days[this.state.selectedDayKey]
                ? Object.keys(this.state.latest.days[this.state.selectedDayKey]).map((campId) => {
                    const site = this.state.latest?.days[this.state.selectedDayKey][campId];
                    return (
                      <div
                        key={campId}
                        className={
                          "py-1 " +
                          (site.SumRoomsForSale <= 0
                            ? "text-muted"
                            : "")
                        }
                      >
                        <span
                          className="pl-1"
                          role="img"
                          aria-label="Tent emoji"
                        >
                          {site.SumRoomsForSale > 0
                            ? "⛺"
                            : "✖️"}
                        </span>
                        <span>{CAMPSITES_METADATA[campId].name} - </span>
                        {site.SumRoomsForSale > 0 ? (
                          <span>
                            <ReactGA.OutboundLink
                              eventLabel={`goTo campsite ${campId} - ${CAMPSITES_METADATA[campId].name}`}
                              onClick={() => ReactGA.event({category: 'ganleumi.online', action: 'campsites - click', label: `goTo campsite ${campId} - ${CAMPSITES_METADATA[campId].name}`, value: campId})}
                              to={CAMPSITES_METADATA[campId].url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >{`${site.SumRoomsForSale} מקומות`}</ReactGA.OutboundLink>
                          </span>
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
              { this.state.latest?.lastUpdate ? (
                <Alert variant="success">
                  <span>עדכון אחרון: </span>
                  <span>{this.formatDayDateTime(this.state.latest.lastUpdate)}</span>
                </Alert>
              ) : '' }

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
