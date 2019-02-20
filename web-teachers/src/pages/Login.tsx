import React from 'react';

export default class Login extends React.Component {

	render() {
		return (
			<h1>Login with MyMICDS.net</h1>
			<form>
				<div class="input-group">
					<input class="form-control" [(ngModel)]="loginModel.user" name="username" placeholder="Username" required>
					<div class="input-group-addon">@micds.org</div>
				</div>
				<input type="password" class="form-control" [(ngModel)]="loginModel.password" name="password" placeholder="Password" required>
				<label>
					<input type="checkbox" [(ngModel)]="loginModel.remember" name="remember">
					Remember Me
				</label>
				<a class="forgot-password" routerLink="/forgot-password">Forgot Password?</a>
				<button class="btn btn-success btn-lg btn-block">Login</button>
			</form>
		);
	}
}
