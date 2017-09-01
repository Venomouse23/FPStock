import React from 'react';

class Profile extends React.Component {
    render () {
        return(
            <div className="container">
                <div className="menu">
                    <div className="name">
                        <h2>Welcome</h2>
                    </div>
                    {/* <ul>
                        <li><a href="/profile/wallet">Wallet</a></li>
                        <li><a href="/profile/change-email">Change e-mail</a></li>
                        <li><a href="/profile/change-password">Change password</a></li>
                    </ul> */}
                </div>
                <div className="content">
                    <form action="" className="change">
                        <h3>Add money</h3>
                        <div className="line">
                            <label for="amount">Amount:</label>
                            <input type="number" name="amount" id="amount" min="0" step="10"/>
                            <span className="err-msg"></span>
                        </div>
                        <div className="line">
                            <label for="password">Password:</label>
                            <input type="password" name="password" id="password"/>
                            <span className="err-msg"></span>
                        </div>
                        <div className="line">
                            <input type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

module.exports = Profile;