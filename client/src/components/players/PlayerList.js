import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Button } from 'primereact/components/button/Button';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { DataTable } from 'primereact/components/datatable/DataTable';

import { Button as SemanticButton, Header as SemanticHeader, Image as SemanticImage, Modal as SemanticModal} from 'semantic-ui-react'
import { Icon, Label, Menu, Table } from 'semantic-ui-react';
import { playersFetchData } from '../../actions/players';
import requireAuth from '../requireAuth';

import unknown from '../../images/avatars/players/unknown.png';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';

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
        //alert(e.data.image);
        this.setState({
            open:true,
            player: Object.assign({}, e.data)
        });
    }

    closeModal = () => {
      this.setState({
        open:false
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

    getFooter() {
      if (this.state.selectedPlayer) {
        if (this.state.selectedPlayer.owner === '--Free Agent--') {
          return (
            <SemanticModal.Actions>
              <SemanticButton onClick={() => this.closeModal()}>
                <Icon name="cancel"/>Cancel
              </SemanticButton>
              <SemanticButton primary onClick={() => this.addPlayer(this.state.selectedPlayer)}>
                <Icon name="checkmark"/>Add
              </SemanticButton>
            </SemanticModal.Actions>
          );
        } else if (this.state.selectedPlayer.owner === 'Ben') {
          return (
            <SemanticModal.Actions>
              <SemanticButton onClick={() => this.closeModal()}>
                <Icon name="cancel"/>Cancel
              </SemanticButton>
              <SemanticButton negative onClick={() => this.addPlayer(this.state.selectedPlayer)}>
                <Icon name="trash alternate"/>Drop
              </SemanticButton>
            </SemanticModal.Actions>
          );
        } else {
          return (
            <SemanticModal.Actions>
              <SemanticButton onClick={() => this.closeModal()}>
                <Icon name="cancel"/>Cancel
              </SemanticButton>
            </SemanticModal.Actions>
          );
        }
      }
    }

    openModal() {
      if (this.state.selectedPlayer) {
      return (
        <SemanticModal open={this.state.open} onClose={this.closeModal} closeIcon>
          <SemanticModal.Header>Player Details</SemanticModal.Header>
          <SemanticModal.Content image>
            <SemanticImage wrapped size='medium' src={`http://localhost:3090/images/headshots/players/${this.state.selectedPlayer.image}`}
              onError={(e)=>{e.target.src=unknown}} />
            <SemanticModal.Description>
              <SemanticHeader>{this.state.selectedPlayer.player}</SemanticHeader>
              <Table celled>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Team</Table.Cell>
                    <Table.Cell>{this.state.selectedPlayer.tm}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </SemanticModal.Description>
          </SemanticModal.Content>
          {this.getFooter()}
        </SemanticModal>
      );}
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
            {this.openModal()}
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
