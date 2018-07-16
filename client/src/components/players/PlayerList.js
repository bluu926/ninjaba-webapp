import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Column } from 'primereact/components/column/Column';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { InputText } from 'primereact/components/inputtext/InputText';
import { MultiSelect } from 'primereact/components/multiselect/MultiSelect';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Grid, Button as SemanticButton, Input as SemanticInput, Header as SemanticHeader,
  Message as SemanticMessage, Image as SemanticImage, List as SemanticList, Modal as SemanticModal} from 'semantic-ui-react'
import { Icon, Message, Table } from 'semantic-ui-react';
import { playersFetchData, playersTransaction } from '../../actions/players';
import * as waiverActions from '../../actions/waivers';
import requireAuth from '../requireAuth';

import playerTeam from '../../data/playerTeam.json';
import playerListColumnsDefault from '../../data/playerListColumnsDefault.json';
import playerListColumns from '../../data/playerListColumns.json';
import owner from '../../data/owners.json';
import ownersEmailToName from '../../data/ownersEmailToName.json';

import unknown from '../../images/avatars/players/unknown.png';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';

class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          owner: null,
          team: null,
          cols: playerListColumnsDefault,
          rows: 25,
          bid: 0
        };

        this.colOptions = [];
        for(let col of playerListColumns) {
            this.colOptions.push({label: col.header, value: col});
        }

        this.onPlayerSelect = this.onPlayerSelect.bind(this);
        this.onTeamChange = this.onTeamChange.bind(this);
        this.onOwnerChange = this.onOwnerChange.bind(this);
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.colOwnerTemplate = this.colOwnerTemplate.bind(this);
    }

    componentDidMount() {
      this.props.fetchData();
    }

    colOwnerTemplate(rowData, column){
      return ownersEmailToName[rowData.owner];
    }

    onPlayerSelect(e){
      this.setState({
          tradeModal:true,
          player: Object.assign({}, e.data)
      });
    }

    closeTradeModal = () => {
      this.setState({
        tradeModal:false,
        bid: 0
      });
    }

    closeWaiverDropModal = () => {
      this.setState({
        waiverDropModal:false,
        bid: 0,
        waiverDropPlayerId:"",
        waiverDropPlayer:"",
        disablePlaceWaiver: false
      });
    }

    onOwnerChange(event) {
      this.dt.filter(event.value, 'owner', 'equals');
      this.setState({owner: event.value});
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

    handleBidChange = e => {
      this.setState({ bid: e.target.value });
    }

    async waiverProceedToDrop(addPlayerId) {
      await this.props.getPlayersToDrop({ bid: this.state.bid });

      if(this.props.waiverAddErrored === "") {
        this.setState({
          tradeModal:false,
          waiverDropModal:true
        });
      }
    }

    addWaiver(addPlayerId, dropPlayerId, bid) {
      this.props.addWaiver({
        addPlayerId,
        dropPlayerId,
        bid
      });

      this.closeWaiverDropModal();
    }

    addPlayer(player) {
      this.props.playersTransaction(player._id,this.props.userEmailAddress,'add');

      this.closeTradeModal();
    }

    dropPlayer(player) {
      this.props.playersTransaction(player._id,this.props.userEmailAddress,'drop');

      this.closeTradeModal();
    }

    getFooter() {
      if (this.state.selectedPlayer) {
        if (this.state.selectedPlayer.owner === '--Free Agent--') {
          return (
            <SemanticModal.Actions>
              <SemanticButton onClick={() => this.closeTradeModal()}>
                <Icon name="cancel"/>Cancel
              </SemanticButton>
              <SemanticInput type='number' min='0' onChange={this.handleBidChange} icon='money bill alternate outline' iconPosition='left' placeholder='0' />
              <SemanticButton primary onClick={() => this.waiverProceedToDrop(this.state.selectedPlayer._id)}>
                Bid<Icon name="arrow right"/>
              </SemanticButton>
              {/* <SemanticButton primary onClick={() => this.addPlayer(this.state.selectedPlayer)}>
                <Icon name="checkmark"/>Add
              </SemanticButton> */}
            </SemanticModal.Actions>
          );
        } else if (this.state.selectedPlayer.owner === this.props.userEmailAddress) {
          return (
            <SemanticModal.Actions>
              <SemanticButton onClick={() => this.closeTradeModal()}>
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
              <SemanticButton onClick={() => this.closeTradeModal()}>
                <Icon name="cancel"/>Cancel
              </SemanticButton>
            </SemanticModal.Actions>
          );
        }
      }
    }

    openTradeModal() {
      if (this.state.selectedPlayer) {
        return (
          <SemanticModal open={this.state.tradeModal} onClose={this.closeTradeModal} closeIcon>
            <SemanticModal.Header>Player Details</SemanticModal.Header>
            <SemanticModal.Content image>
              <SemanticImage wrapped size='medium' src={`https://ninjaba.herokuapp.com/images/headshots/players/${this.state.selectedPlayer.image}`}
                onError={(e)=>{e.target.src=unknown}} />
              <SemanticModal.Description>
                {this.props.waiverAddErrored &&
                <Message negative>
                  <Message.Header>Error!</Message.Header>
                  <p>{this.props.playersTransactionErrored}</p>
                  <p>{this.props.waiverAddErrored}</p>
                </Message>}
                <SemanticHeader>
                  <SemanticHeader as='h2'>
                    {this.state.selectedPlayer.player}
                    <SemanticHeader.Subheader>Owner: {this.state.selectedPlayer.owner}</SemanticHeader.Subheader>
                  </SemanticHeader>
                </SemanticHeader>
                <Grid stackable columns={2}>
                  <Grid.Column width={8}>
                  <Table celled>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell><strong>Team</strong></Table.Cell>
                        <Table.Cell>{this.state.selectedPlayer.tm}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><strong>Pos</strong></Table.Cell>
                        <Table.Cell>{this.state.selectedPlayer.pos}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><strong>PPG</strong></Table.Cell>
                        <Table.Cell>{this.state.selectedPlayer[`ps/g`]}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Table celled>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell><strong>REB</strong></Table.Cell>
                          <Table.Cell>{this.state.selectedPlayer.trb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><strong>AST</strong></Table.Cell>
                          <Table.Cell>{this.state.selectedPlayer.ast}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><strong>BLK</strong></Table.Cell>
                          <Table.Cell>{this.state.selectedPlayer.blk}</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                </Grid>
              </SemanticModal.Description>
            </SemanticModal.Content>
            {this.getFooter()}
          </SemanticModal>
        );
      }
    }

    openWaiverDropModal() {
      if (this.state.selectedPlayer) {
        let players = this.props.waiverPlayersToDrop;

        let dropList = players.map((player, index) => {
          return (
            <SemanticList.Item key={player._id}>
              <SemanticList.Content>
                <SemanticList.Header>
                  <SemanticButton icon onClick={()=>{this.setState({ waiverDropPlayerId:player._id, waiverDropPlayer:player.player, disablePlaceWaiver: true });}}>
                    <Icon name='minus' size='large' verticalAlign='middle' />
                  </SemanticButton>
                  {player.player}
                </SemanticList.Header>
              </SemanticList.Content>
            </SemanticList.Item>
          );
        });
        return (
          <SemanticModal open={this.state.waiverDropModal} onClose={this.closeWaiverDropModal} closeIcon>
            <SemanticModal.Header>Select Player to Drop for Waiver</SemanticModal.Header>
            <SemanticModal.Content>
              <SemanticModal.Description>
                <SemanticHeader>Player to be bid on</SemanticHeader>
                <SemanticMessage
                  color='green'
                  icon='plus'
                  header={this.state.selectedPlayer.player}
                  content={"Place waiver for $" + this.state.bid}
                />
                {this.state.waiverDropPlayer && <div>
                <SemanticHeader>Player to be dropped for</SemanticHeader>
                <SemanticMessage
                  color='orange'
                  icon='minus'
                  header={this.state.waiverDropPlayer}
                  content="Player to drop"
                /></div>}
                <SemanticHeader>Your Players</SemanticHeader>
                <SemanticList divided relaxed>
                  {this.props.waiverPlayersToDropCount < 18 &&
                    <SemanticList.Item key='0'>
                      <SemanticList.Content>
                        <SemanticList.Header>
                          <SemanticButton icon onClick={()=>{this.setState({ waiverDropPlayerId:"", waiverDropPlayer:"Drop No One", disablePlaceWaiver: true });}}>
                            <Icon name='minus' size='large' verticalAlign='middle' />
                          </SemanticButton>
                          Drop No One
                        </SemanticList.Header>
                      </SemanticList.Content>
                    </SemanticList.Item>
                  }
                  {dropList}
                </SemanticList>
              </SemanticModal.Description>
            </SemanticModal.Content>
            <SemanticModal.Actions>
              <SemanticButton onClick={() => this.closeWaiverDropModal()}>
                <Icon name="cancel"/>Cancel
              </SemanticButton>
              <SemanticButton primary disabled={!this.state.disablePlaceWaiver} onClick={() => this.addWaiver(this.state.selectedPlayer._id, this.state.waiverDropPlayerId, this.state.bid)}>
                <Icon name="checkmark"/>Place Waiver
              </SemanticButton>
            </SemanticModal.Actions>
          </SemanticModal>
        );
      }
    }

    renderMessage() {
      if(this.props.playersTransactionSuccess || this.props.waiverAddSuccess) {
          return (
            <Message positive>
              <Message.Header>Success!</Message.Header>
              <p>{this.props.playersTransactionSuccess}</p>
              <p>{this.props.waiverAddSuccess}</p>
            </Message>
          );
      }
    }

    renderAlert() {
      if(this.props.playersTransactionErrored || this.props.waiverAddErrored) {
        return (
          <Message negative>
            <Message.Header>Error!</Message.Header>
            <p>{this.props.playersTransactionErrored}</p>
            <p>{this.props.waiverAddErrored}</p>
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

        let teamFilter = <Dropdown readonly="true" style={{width: '100%'}} className="ui-column-filter"
                value={this.state.team} options={playerTeam} onChange={this.onTeamChange}/>

        let ownerFilter = <Dropdown readonly="true" style={{width: '100%'}} className="ui-column-filter"
                value={this.state.owner} options={owner} onChange={this.onOwnerChange}/>

        let columns = this.state.cols.map((col,i) => {
              if(col.filterElement === 'teamFilter') {
                return <Column key={col.field} field={col.field} header={col.header}
                sortable={true} filter={col.filter} filterMatchMode={col.filterMatchMode}
                filterElement={teamFilter} />;
              } else if (col.filterElement === 'ownerFilter') {
                return <Column key={col.field} field={col.field} header={col.header}
                sortable={true} body={this.colOwnerTemplate} filter={col.filter} filterMatchMode={col.filterMatchMode}
                filterElement={ownerFilter} />;
              } else {
                return <Column key={col.field} field={col.field} header={col.header}
                sortable={true} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
              }
        });

        return (
          <div style={{'margin-top': '30px'}}>
            {this.openTradeModal()}
            {this.openWaiverDropModal()}
            {this.renderAlert()}
    				{this.renderMessage()}
            <DataTable value={this.props.players} ref={(el) => { this.dt = el; }} header={header}
                  paginator={true} responsive={false}
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
        faab: state.auth.faab,
        players: state.players.players,
        userEmailAddress: state.players.ownerEmail,
        playersHasErrored: state.playersHasErrored,
        playersIsLoading: state.playersIsLoading,
        playersTransactionSuccess: state.playersTransactionSuccess,
        playersTransactionErrored: state.playersTransactionErrored,
        waiverAddSuccess: state.waiver.waiverAddSuccess,
        waiverAddErrored: state.waiver.waiverAddErrored,
        waiverPlayersToDrop: state.waiver.waiverPlayersToDrop,
        waiverPlayersToDropCount: state.waiver.waiverPlayersToDropCount
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: () => dispatch(playersFetchData()),
        playersTransaction: (playerId, username, transactionType) => dispatch(playersTransaction(playerId, username, transactionType)),
        addWaiver: ({ addPlayerId, dropPlayerId, bid }) => dispatch(waiverActions.addWaiver({ addPlayerId, dropPlayerId, bid })),
        getPlayersToDrop: ({ bid }) => dispatch(waiverActions.getPlayersToDrop({ bid }))
    };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  requireAuth
)(PlayerList);

//export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);
