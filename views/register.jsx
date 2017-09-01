import React from "react";
//const view = document.getElementById('view');

class Register extends React.Component {
	registerNewUser() {
	}
	render () {
		return (
			<form action="register" className="register" method="POST" onSubmit={this.registerNewUser.bind(this)}>
				<div className="line">
					<label for="firstName">First name:</label>
					<input type="text" name="firstName" id="firstName" />
					<span className="err-msg"></span>
				</div>
				<div className="line">
					<label for="lastName">Last name:</label>
					<input type="text" name="lastName" id="lastName" />
				</div>
				<div className="line">
					<label for="username">Username:</label>
					<input type="text" name="username" id="username" />
				</div>
				<div className="line">
					<label for="email">E-mail:</label>
					<input type="email" name="email" id="email" />
				</div>
				<div className="line">
					<label for="password">Password:</label>
					<input type="password" name="password" id="password" />
				</div>
				<div className="line">
					<label for="passwordConfirm">Confirm password:</label>
					<input type="password" name="passwordConfirm" id="passwordConfirm" />
				</div>
				<div className="line">
					<input type="submit" value="Register" />
				</div>
			</form>
		);
	}
};

module.exports = Register;