import React, { Component } from "react";
// import logo from './logo.svg';

import "bootstrap/dist/css/bootstrap.css";
// import 'react-day-picker/lib/style.css';
import "./App.css";

import {
  //   Button,
  Container,
  Row,
  Col,
  //   Fade,
  //   Table,
  //   ListGroup,
  Nav,
  Navbar,
  //   Form,
  //   FormControl,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";

// import { isDOMComponent } from "react-dom/test-utils";

import Campsites from "./campsites";
import Parks from "./parks";

//https://checkfrontcom.checkfront.com/api/3.0/item?start_date =20201024&end_date=20201024
//11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,3,30,32,33,34,37,38,39,4,40,44,45,48,49,50,51,52,53,54,55,56,57,59,6,60,61,62,64,65,66,67,69,7,76,77,8,80,81,82,9,90,93,94
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "parks",
    };
    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(tab) {
     console.log('changing activeTab to ' + tab);
    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div className="App">
        <Container fluid className="text-light bg-teva-green py-3">
          <Row>
            <Col>
              <h1>
                <span>לאן נטייל מחר?</span>
                <span role="img" aria-label="אוהל" className="mx-1">
                  🏕️
                </span>
                <a className="text-light" href="http://ganleumi.online">ganleumi.online</a>
              </h1>
              <h2>זמינות שמורות טבע, פארקים לאומיים וחניוני לילה</h2>
            </Col>
          </Row>
        </Container>

        <Navbar className="bg-teva-lime">
          <Nav className="mx-auto justify-content-center">
            <Nav.Link href="" className="px-4" onClick={() => this.changeTab("parks")} active={this.state.activeTab === 'parks'}>
              שמורות טבע
            </Nav.Link>
            <Nav.Link href="" className="px-4" onClick={() => this.changeTab("campsites")} active={this.state.activeTab === 'campsites'}>
              <span>חניוני לילה</span>
              <span role="img" aria-label="New" className="mr-1">🆕</span>
            </Nav.Link>
            {/* <Button variant="outline-info" onClick={randomClicked}>הגרל אתר שפנוי היום</Button> */}
          </Nav>
        </Navbar>

        {this.state.activeTab === "campsites" ? (
          <Campsites></Campsites>
        ) : (
          <Parks></Parks>
        )}

        <footer className="mt-auto py-4 bg-light container-fluid text-info">
          <Container>
            <Row>
              <Col>
                <div className="my-2">
                  לכל אתרי התיירות ומידע נוסף -{" "}
                  <a
                    href="https://www.parks.org.il/%D7%94%D7%96%D7%9E%D7%A0%D7%95%D7%AA-%D7%9C%D7%90%D7%AA%D7%A8%D7%99%D7%9D/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    אתר רשות הטבע והגנים{" "}
                  </a>
                </div>
                <div className="my-2">
                  <span>
                    <span role="img" aria-label="Tent Emoji">
                      🏕️
                    </span>{" "}
                    לאן נטייל מחר הוא קצרקוד (פרוייקט מהיר) שנבנה בעקבות{" "}
                  </span>
                  <a
                    href="https://twitter.com/amsterdamski2/status/1319278880281169921"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ציוץ של @amsterdamski2
                  </a>
                </div>
                <div className="my-2">
                  <span>
                    <span role="img" aria-label="Persone Code Emoji">
                      👨‍💻
                    </span>{" "}
                    הפרוייקט בקוד פתוח! מוזמנות ומוזמנים להציע הארות והערות{" "}
                  </span>
                  <a
                    href="https://github.com/NivRichter/park_n_recs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    בעמוד הגיטהאב של הפרוייקט
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    );
  }
}

export default App;
