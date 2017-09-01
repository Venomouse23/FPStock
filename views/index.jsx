import React from "react";
// import {Helmet} from "react-helmet";

class Index extends React.Component {
	render () {
		return (
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta http-equiv="X-UA-Compatible" content="ie=edge" />
					<title>Document</title>
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" />
					<link rel="stylesheet" href="/css/style.min.css" />
				</head>
				<body>
					<div className="wrap">
						<header>
							<a href="./" className="logo"><h1>Stocks</h1></a>
							{this.props.props.isLoggedIn == true ? <UserBox /> : ""}
						</header>
						<main className={ this.props.props.mainClass } id='view' dangerouslySetInnerHTML={{__html: this.props.body}} />
					</div>
					<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js"></script>
					<script src="/js/app.js"></script>
				</body>
			</html>
		);
	}
};

class UserBox extends React.Component {
	render () {
		return (
			<div>
				<a href="/profile"><img src="img/settings.svg" alt="" /></a> <a href="/logout"><img src="img/app.svg" alt="" /></a>
			</div>
		)
	}
}

module.exports = Index;