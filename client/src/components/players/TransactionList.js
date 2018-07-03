import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Column } from 'primereact/components/column/Column';
import { DataTable } from 'primereact/components/datatable/DataTable';

import * as transactionActions from '../../actions/transactions';

class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 25
    };
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

        <Column field="username" header="Managers" />
        <Column field="transactionType" header="Type" />
        <Column field="addPlayerName" header="Adds" />
        <Column field="dropPlayerName" header="Drops" />
        <Column field="waiverAmount" header="Bid Amount" />
        <Column field="createdAt" header="Timestamp" />
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
