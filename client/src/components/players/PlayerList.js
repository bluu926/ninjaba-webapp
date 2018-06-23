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
import { playersFetchData, playerTransaction } from '../../actions/players';
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
          cols: playerListColumnsDefault
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
      alert(player._id);
      alert(this.props.userEmailAddress);
      this.props.playerTransaction(player._id,this.props.userEmailAddress,'add');

      this.setState({
        open:false
      })
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

    renderMessage() {
      // if(this.props.message) {
          return (
            <Message positive>
              <Message.Header>Success!</Message.Header>
              <p>
                You have added <b>Stephen Curry</b>.
              </p>
            </Message>
          );
      }
    // }

    renderAlert() {
        // if(this.props.errorMessage) {
          return (
            <Message negative>
              <Message.Header>Error!</Message.Header>
              <p>Someone has added before you.</p>
            </Message>
          );
      // }
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
                        <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Global Search" size="50"/>
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
          <div>
            {this.openModal()}
            {this.renderAlert()}
    				{this.renderMessage()}
            <DataTable value={this.props.players} ref={(el) => { this.dt = el; }} header={header}
                  paginator={true} paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                  rows={25} selectionMode="single" rowsPerPageOptions={[1,2,3,5,10,20]} sortMode="multiple"
                  selection={this.state.selectedPlayer} onSelectionChange={(e)=>{this.setState({selectedPlayer:e.data});}}
                  onRowSelect={this.onPlayerSelect} globalFilter={this.state.globalFilter}>

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
        fetchData: (url) => dispatch(playersFetchData(url)),
        playerTransaction: (playerId, username, transactionType) => dispatch(playerTransaction(playerId, username, transactionType))
    };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  requireAuth
)(PlayerList);

//export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);
