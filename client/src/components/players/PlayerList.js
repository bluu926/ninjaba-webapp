import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Button } from 'primereact/components/button/Button';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { DataTable } from 'primereact/components/datatable/DataTable';

import { playersFetchData } from '../../actions/players';
import requireAuth from '../requireAuth';

import unknown from '../../images/avatars/players/unknown.png';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';

const imgStyle = {
  'width': '260px',
  'height': '190px'
}

class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onPlayerSelect = this.onPlayerSelect.bind(this);
    }

    componentDidMount() {
        //this.props.fetchData('http://599167402df2f40011e4929a.mockapi.io/items');
        this.props.fetchData('http://localhost:3090/players');
    }

    onPlayerSelect(e){
        //alert(e.data.Image);
        this.setState({
            displayDialog:true,
            player: Object.assign({}, e.data)
        });
    }

    reset() {
      //console.log(this.dt);
      //this.dt.exportCSV();
    }

    addPlayer(player) {
      alert(player.id);
      alert(this.props.userEmailAddress);
    }

    dropPlayer(player) {
      if (player.owner === 'Ben') {
        alert('test');
      }
    }

    cancelDialog() {
      this.setState({
        displayDialog:false
      });
    }

    getFooter() {
      if (this.state.selectedPlayer) {
        if (this.state.selectedPlayer.owner === '--Free Agent--') {
          return (<div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button icon="fa fa-close" label="Cancel" onClick={() => this.cancelDialog()} />
                <Button label="Add" icon="pi pi-check" onClick={() => this.addPlayer(this.state.selectedPlayer)} />
            </div>
          );
        } else if (this.state.selectedPlayer.owner === 'Ben') {
          return (<div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button icon="fa fa-close" label="Cancel" onClick={() => this.cancelDialog()} />
                <Button label="Drop" icon="pi pi-check" onClick={() => this.dropPlayer(this.state.selectedPlayer)} />
            </div>
          );
        } else {
          return (<div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button icon="fa fa-close" label="Cancel" onClick={() => this.cancelDialog()} />
            </div>
          );
        }
      }
    }

    render() {
        if (this.props.hasErrored) {
            return <p>Sorry! There was an error loading the items</p>;
        }

        if (this.props.isLoading) {
            return <p>Loading…</p>;
        }

        let paginatorLeft = <Button icon="pi pi-refresh" onClick={this.reset}/>;
        let paginatorRight = <Button icon="fa fa-cloud-upload"/>;

        return (
          <div>
            <ul>
                {this.props.players.map((players) => (
                    <li key={players.id}>
                        {players.tm}
                        {players.player}
                        {players.age}
                        {players.image}
                        {players.owner}
                    </li>
                ))}
            </ul>
            <DataTable value={this.props.players} ref={(el) => { this.dt = el; }}
                  paginator={true} paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                  rows={10} selectionMode="single" rowsPerPageOptions={[1,2,3,5,10,20]} sortMode="multiple"
                  selection={this.state.selectedPlayer} onSelectionChange={(e)=>{this.setState({selectedPlayer:e.data});}}
                  onRowSelect={this.onPlayerSelect}>

                {/* <Column field="id" header="id" /> */}
                <Column field="tm" header="Team" sortable={true} filter={true} />
                <Column field="player" header="Player" sortable={true} filter={true} />
                <Column field="age" header="Age" sortable={true} filter={true} />

            </DataTable>

            <Dialog visible={this.state.displayDialog} header="Player Details" modal={true} footer={this.getFooter()} onHide={() => this.setState({displayDialog: false})}>
              {this.state.player && <div className="ui-grid ui-grid-responsive ui-fluid">
                  <div className="ui-grid-row">
                    <div className="ui-grid-col-12" style={{padding:'4px 10px'}}>
                        <img style={imgStyle} src={`http://localhost:3090/images/headshots/players/${this.state.player.image}`}
                            onError={(e)=>{e.target.src=unknown}}
                          alt={this.state.player.image}/>
                    </div>
                  </div>
                  <div className="ui-grid-row">
                    <div className="ui-grid-col-6" style={{padding:'4px 10px'}}><label htmlFor="team">Team</label></div>
                    <div className="ui-grid-col-6" style={{padding:'4px 10px'}}>
                        {this.state.player.tm}
                    </div>
                  </div>
                  <div className="ui-grid-row">
                    <div className="ui-grid-col-6" style={{padding:'4px 10px'}}><label htmlFor="year">Player</label></div>
                    <div className="ui-grid-col-6" style={{padding:'4px 10px'}}>
                        {this.state.player.player}
                    </div>
                  </div>
                  <div className="ui-grid-row">
                    <div className="ui-grid-col-6" style={{padding:'4px 10px'}}><label htmlFor="brand">Owner</label></div>
                    <div className="ui-grid-col-6" style={{padding:'4px 10px'}}>
                        {this.state.player.owner}
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
        userEmailAddress: state.auth.userEmailAddress,
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  // requireAuth
)(PlayerList);

//export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);
