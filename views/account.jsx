import React from 'react';

class Account extends React.Component {
    render() {
        return (
            <div>
                <div className="column">
                    <div className="header">
                        <h2>Stock prices</h2>
                    </div>
                    <table data-can-buy={this.props.canIBuy}>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Value</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.prices.map(function(obj) {
								return <tr><td>{obj.code}</td><td>{obj.price}</td><td><button data-code={obj.code} className="buy-item">Buy</button></td></tr>
							})}
                        </tbody>
                    </table>
                </div>

                <div className="column">
                    <div className="header">
                        <h2>My wallet</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Unit price</th>
                                <th>Amount</th>
                                <th>Value</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
							{this.props.stocks.map(function(val, index) {
								{/* return <tr><td>{this.props.prices[index].code}</td><td>{this.props.prices[index].price * value.amount}</td><td>{value.amount}</td><td><button>Sell</button></td></tr> */}
								return <tr><td>{this.prices[index].code}</td><td>{this.prices[index].price}</td><td>{val.amount}</td><td>{this.prices[index].price * val.amount}</td><td><button data-company={val.companyID} data-wallet={val.walletID} className="sell-btn">Sell</button></td></tr>
							}, this.props)}
                        </tbody>
                    </table>
                    <div className="money">
                        <p>Available money: <strong>{this.props.wallet.cashAmount} PLN</strong></p>
                    </div>
                </div>
            </div>        
        );
    }
}
module.exports = Account;