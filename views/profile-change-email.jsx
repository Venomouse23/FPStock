import React from 'react';

class ProfileChangeEmail extends React.Component {
    render() {
        return (
        <div className="container">
            <div className="menu">
                <div className="name">
                    <h2>John Doe</h2>
                </div>
                <ul>
                    <li><a href="/profile/wallet">Wallet</a></li>
                    <li><a href="/profile/change-email">Change e-mail</a></li>
                    <li><a href="/profile/change-password">Change password</a></li>
                </ul>
            </div>
            <div className="content">
                <form action="" className="change">
                    <h3>Change e-mail</h3>
                    <div className="line">
                        <label for="newemail">New e-mail:</label>
                        <input type="email" name="newemail" id="newemail"/>
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
module.exports = ProfileChangeEmail;