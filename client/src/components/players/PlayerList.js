import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Column } from 'primereact/components/column/Column';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { playersFetchData } from '../../actions/players';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

class PlayerList extends Component {
    componentDidMount() {
        //this.props.fetchData('http://599167402df2f40011e4929a.mockapi.io/items');
        this.props.fetchData('http://localhost:3090/players');
    }

    render() {
        if (this.props.hasErrored) {
            return <p>Sorry! There was an error loading the items</p>;
        }

        if (this.props.isLoading) {
            return <p>Loading…</p>;
        }

        return (
          <div>
            <ul>
                {this.props.players.map((players) => (
                    <li key={players.id}>
                        {players.Tm}
                        {players.Player}
                        {players.Age}
                    </li>
                ))}
            </ul>
            <DataTable value={this.props.players}>
                <Column field="id" header="id" />
                <Column field="Tm" header="Team" sortable={true} />
                <Column field="Player" header="Player" sortable={true} />
                <Column field="Age" header="Age" sortable={true} />
            </DataTable>

            <Dialog visible={this.state.displayDialog} header="Car Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
              {this.state.car && <div className="ui-grid ui-grid-responsive ui-fluid">
                  <div className="ui-grid-row">
                    <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="vin">Vin</label></div>
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                      {/* <InputText id="vin" onChange={(e) => {this.updateProperty('vin', e.target.value)}} value={this.state.car.vin}/> */}
                    </div>
                  </div>
                  <div className="ui-grid-row">
                    <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="year">Year</label></div>
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                      {/* <InputText id="year" onChange={(e) => {this.updateProperty('year', e.target.value)}} value={this.state.car.year}/> */}
                    </div>
                  </div>
                  <div className="ui-grid-row">
                    <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="brand">Brand</label></div>
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                      {/* <InputText id="brand" onChange={(e) => {this.updateProperty('brand', e.target.value)}} value={this.state.car.brand}/> */}
                    </div>
                  </div>
                  <div className="ui-grid-row">
                    <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="color">Color</label></div>
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                      {/* <InputText id="color" onChange={(e) => {this.updateProperty('color', e.target.value)}} value={this.state.car.color}/> */}
                    </div>
                  </div>
              </div>}
            </Dialog>
          </div>
        );
    }
}

PlayerList.propTypes = {
    fetchData: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    playersHasErrored: PropTypes.bool.isRequired,
    playersIsLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        players: state.players,
        playersHasErrored: state.playersHasErrored,
        playersIsLoading: state.playersIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => dispatch(playersFetchData(url))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);
