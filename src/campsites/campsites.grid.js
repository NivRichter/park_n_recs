import React, { Component } from "react";
import {Container, Row, Col} from 'react-bootstrap';

class CampsitesGrid extends Component {
    constructor(props) {
        super(props);
        this.state = { campsites: props.campsites };
        console.log(this.state.campsites);
        for (let site of this.state.campsites) {
            // console.log(typeof site);
            // console.log(site.length);
        }
    }

    render() {
        return (
            <div>
                { Object.keys(this.state.campsites).map((campsiteId) => {
                    return (
                        <Row key={campsiteId} style={{ flexWrap: 'nowrap' }}>
                            <Col style={{ minWidth: '250px' }}>{`אתר ${campsiteId}`}</Col>
                            { Object.keys(this.state.campsites[campsiteId]).map((dayDate) => {
                                return (
                                    <Col key={`${campsiteId}-${dayDate}`} style={{ minWidth: '70px' }}>{this.state.campsites[campsiteId][dayDate].SumRoomsForSale}</Col>
                                )
                            })}
                            
                        </Row>
                    )
                })}
            </div>
        )
    }
}

export default CampsitesGrid;