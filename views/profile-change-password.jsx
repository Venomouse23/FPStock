import React from 'react';

class ProfileChangePassword extends React.Component {
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
                    <h3>Change password</h3>
                    <div className="line">
                        <label for="oldPassword">Old password:</label>
                        <input type="password" name="oldPassword" id="oldPassword"/>
                        <span className="err-msg"></span>
                    </div>
                    <div className="line">
                        <label for="newPassword">New password:</label>
                        <input type="password" name="newPassword" id="newPassword"/>
                        <span className="err-msg"></span>
                    </div>
                    <div className="line">
                        <label for="newPasswordConfirm">Re-type new password:</label>
                        <input type="password" name="newPasswordConfirm" id="newPasswordConfirm"/>
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
module.exports = ProfileChangePassword;