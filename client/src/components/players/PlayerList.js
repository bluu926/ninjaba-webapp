import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Button } from 'primereact/components/button/Button';
import { Column } from 'primereact/components/column/Column';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { InputText } from 'primereact/components/inputtext/InputText';
import { MultiSelect } from 'primereact/components/multiselect/MultiSelect';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Button as SemanticButton, Header as SemanticHeader, Image as SemanticImage, Modal as SemanticModal} from 'semantic-ui-react'
import { Icon, Message, Table } from 'semantic-ui-react';
import { playersFetchData, playersTransaction } from '../../actions/players';
import * as waiverActions from '../../actions/waivers';
import requireAuth from '../requireAuth';

import playerTeam from '../../data/playerTeam.json';
import playerListColumnsDefault from '../../data/playerListColumnsDefault.json';
import playerListColumns from '../../data/playerListColumns.json';

import unknown from '../../images/avatars/players/unknown.png';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';

class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          team: null,
          cols: playerListColumnsDefault,
          rows: 25
        };

        this.colOptions = [];
        for(let col of playerListColumns) {
            this.colOptions.push({label: col.header, value: col});
        }

        this.onPlayerSelect = this.onPlayerSelect.bind(this);
        this.onTeamChange = this.onTeamChange.bind(this);
        this.onColumnToggle = this.onColumnToggle.bind(this);
    }

    componentDidMount() {
        this.props.fetchData();
    }

    onPlayerSelect(e){
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

    onTeamChange(event) {
      this.dt.filter(event.value, 'tm', 'equals');
      this.setState({team: event.value});
    }

    onColumnToggle(event) {
      this.setState({cols: event.value});
    }

    reset = () => {
      this.dt.exportCSV();
    }

    addPlayer(player) {
      // this.props.playersTransaction(player._id,this.props.userEmailAddress,'add');
      this.props.addWaiver({ email: this.props.userEmailAddress, playerId: player._id, bid: 50 })

      this.setState({
        open:false
      })
    }

    dropPlayer(player) {
      this.props.playersTransaction(player._id,this.props.userEmailAddress,'drop');

      this.setState({
        open:false
      })
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
        } else if (this.state.selectedPlayer.owner === this.props.userEmailAddress) {
          return (
            <SemanticModal.Actions>
              <SemanticButton onClick={() => this.closeModal()}>
                <Icon name="cancel"/>Cancel
              </SemanticButton>
              <SemanticButton negative onClick={() => this.dropPlayer(this.state.selectedPlayer)}>
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
            <SemanticImage wrapped size='medium' src={`https://ninjaba.herokuapp.com/images/headshots/players/${this.state.selectedPlayer.image}`}
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

    renderMessage() {
      if(this.props.playersTransactionSuccess) {
          return (
            <Message positive>
              <Message.Header>Success!</Message.Header>
              <p>Your transaction was a success!</p>
            </Message>
          );
      }
    }

    renderAlert() {
      if(this.props.playersTransactionErrored) {
        return (
          <Message negative>
            <Message.Header>Error!</Message.Header>
            <p>Your transaction has failed.</p>
          </Message>
        );
      }
    }

    onPageChange(e) {
      this.setState({
        rows: e.rows
      });
    }

    render() {
        if (this.props.hasErrored) {
            return <p>Sorry! There was an error loading the items</p>;
        }

        if (this.props.isLoading) {
            return <p>Loading…</p>;
        }

        var header = <div>
                      <div style={{'textAlign':'left'}}>
                        <h1>Players Dashboard</h1>
                        <i className="fa fa-search" style={{margin:'4px 4px 0 0'}}></i>
                        <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Global Search" size="30"/>
                      </div>
                      <div style={{'textAlign':'right'}}>
                        <MultiSelect value={this.state.cols} options={this.colOptions} onChange={this.onColumnToggle} style={{width:'400px'}}/>
                      </div>
                    </div>;

        let paginatorLeft = <Button icon="pi pi-refresh" onClick={this.reset}/>;
        let paginatorRight = <Button icon="fa fa-cloud-upload"/>;

        let teamFilter = <Dropdown style={{width: '100%'}} className="ui-column-filter"
                value={this.state.team} options={playerTeam} onChange={this.onTeamChange}/>

        let columns = this.state.cols.map((col,i) => {
              if(col.filterElement === 'teamFilter') {
                return <Column key={col.field} field={col.field} header={col.header}
                sortable={true} filter={col.filter} filterMatchMode={col.filterMatchMode}
                filterElement={teamFilter} />;
              } else {
                return <Column key={col.field} field={col.field} header={col.header}
                sortable={true} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
              }
        });

        return (
          <div style={{'margin-top': '30px'}}>
            {this.openModal()}
            {this.renderAlert()}
    				{this.renderMessage()}
            <DataTable value={this.props.players} ref={(el) => { this.dt = el; }} header={header}
                  paginator={true} paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                  rows={this.state.rows} selectionMode="single" rowsPerPageOptions={[10,25,50,100]} sortMode="multiple"
                  selection={this.state.selectedPlayer} onSelectionChange={(e)=>{this.setState({selectedPlayer:e.data});}}
                  onRowSelect={this.onPlayerSelect} globalFilter={this.state.globalFilter}
                  onPage={(e) => {this.onPageChange(e)}}>

                {columns}

                {/* <Column field="id" header="id" /> */}
                {/* <Column field="tm" header="Team" sortable={true} filter={true} filterMatchMode="contains" filterElement={teamFilter} />
                <Column field="player" header="Player" sortable={true} filter={true} filterMatchMode="contains" />
                <Column field="age" header="Age" sortable={true} filter={true} filterMatchMode="contains" />
                <Column field="fg" header="fg" sortable={true} filter={true} filterMatchMode="contains" />
                <Column field="fga" header="fga" sortable={true} filter={true} filterMatchMode="contains" />
                <Column field="fg%" header="fg%" sortable={true} filter={true} filterMatchMode="contains" /> */}

            </DataTable>
          </div>
        );
    }
}

PlayerList.propTypes = {
    fetchData: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    playersHasErrored: PropTypes.bool.isRequired,
    playersIsLoading: PropTypes.bool.isRequired,
    playersTransactionSuccess: PropTypes.bool.isRequired,
    playersTransactionErrored: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        userEmailAddress: state.auth.userEmailAddress,
        players: state.players,
        playersHasErrored: state.playersHasErrored,
        playersIsLoading: state.playersIsLoading,
        playersTransactionSuccess: state.playersTransactionSuccess,
        playersTransactionErrored: state.playersTransactionErrored,
        waiverAddSuccess: state.waiverAddSuccess,
        waiverAddErrored: state.waiverAddErrored
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => dispatch(playersFetchData()),
        playersTransaction: (playerId, username, transactionType) => dispatch(playersTransaction(playerId, username, transactionType)),
        addWaiver: (email, playerId, bid) => dispatch(waiverActions.addWaiver(email, playerId, bid))
    };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  requireAuth
)(PlayerList);

//export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);
