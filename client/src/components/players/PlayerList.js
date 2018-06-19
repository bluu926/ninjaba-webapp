import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Column } from 'primereact/components/column/Column';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { playersFetchData } from '../../actions/players';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';

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
