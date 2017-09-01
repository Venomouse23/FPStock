import React from "react";

class Home extends React.Component {
	render () {
		return (
			<form className="login-box" method="POST" action="login">
				<div className="line">
					<label for="username">Login:</label>
					<input type="text" id="username" name="username" />
				</div>
				<div className="line">
					<label for="password">Password:</label>
					<input type="password" id="password" name="password" />
				</div>
				<div className="line">
					<a href="register">Register</a>
					<input type="submit" value="Log in" />
				</div>
			</form>
		);
	}
};

module.exports = Home;