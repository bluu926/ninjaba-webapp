import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Column } from 'primereact/components/column/Column';
import { DataTable } from 'primereact/components/datatable/DataTable';

import * as transactionActions from '../../actions/transactions';

import ownersEmailToName from '../../data/ownersEmailToName.json';

const ownerNames = {
   "Ben" : "TEST"
}

class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 25
    };

    this.colTemplate = this.colTemplate.bind(this);
  }

  colTemplate(rowData, column){
    return ownersEmailToName[rowData.username];
  }

  onPageChange(e) {
    this.setState({
      rows: e.rows
    });
  }

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    return (
      <DataTable value={this.props.transactions} paginator={true} rows={this.state.rows}
        rowsPerPageOptions={[10,25,50,100]} onPage={(e) => {this.onPageChange(e)}} >

        <Column field="username" body={this.colTemplate} header="Managers" />
        <Column field="transactionType" header="Type" />
        <Column field="addPlayerName" header="Adds" />
        <Column field="dropPlayerName" header="Drops" />
        <Column field="waiverAmount" header="Bid Amount" />
        {/* waiverLosers: {
      		ownerEmail: String,
      		player: String,
      		bid: Number
      	} */}
      </DataTable>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        transactionsSuccess: state.transaction.transactionsSuccess,
        transactionsErrored: state.transaction.transactionsErrored,
        transactions: state.transaction.transactions
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: () => dispatch(transactionActions.getTransactions()),
    };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)//,
  // requireAuth
)(TransactionList);
