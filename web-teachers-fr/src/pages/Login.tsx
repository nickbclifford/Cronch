import bind from 'bind-decorator';
import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import MyMICDS from '../common/MyMICDS';
import styles from './Login.module.scss';

interface LoginState {
	user: string;
	password: string;
	remember: boolean;
}

export default class Login extends React.Component<RouteComponentProps, LoginState> {

	constructor(props: any) {
		super(props);
		this.state = { user: '', password: '', remember: true };
	}

	componentDidMount() {
		if (MyMICDS.auth.isLoggedIn) {
			this.props.history.push('/');
		}
	}

	@bind
	private changeUser({ target: { value: user } }: ChangeEvent<HTMLInputElement>) {
		this.setState({ user });
	}

	@bind
	private changePassword({ target: { value: password } }: ChangeEvent<HTMLInputElement>) {
		this.setState({ password });
	}

	@bind
	private changeRemember({ target: { checked: remember } }: ChangeEvent<HTMLInputElement>) {
		this.setState({ remember });
	}

	@bind
	private login(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		MyMICDS.auth.login({
			user: this.state.user,
			password: this.state.password,
			remember: this.state.remember,
			comment: 'Cronchalytics'
		}).subscribe(
			loginRes => {
				if (loginRes.success) {
					this.props.history.push('/');
				} else {
					alert(`Login Error! ${loginRes.message}`);
				}
			}
		);
	}

	render() {
		return (
			<div className={styles.container}>
				<h2 className={styles.title}>Login with</h2>
				<h1 className={styles.title}>MyMICDS.net</h1>
				<form className={styles.form} onSubmit={this.login}>
					<div className={styles.usernameGroup}>
						<input
							className={`cronch-text-input ${styles.usernameGroupInput}`}
							value={this.state.user}
							onChange={this.changeUser}
							placeholder='Username'
							required={true}
						/>
						<div className={styles.usernameGroupLabel}>@micds.org</div>
					</div>
					<input
						type='password'
						className={`cronch-text-input ${styles.password}`}
						value={this.state.password}
						onChange={this.changePassword}
						placeholder='Password'
						required={true}
					/>
					<label className={styles.rememberContainer}>
						<input
							type='checkbox'
							className={styles.rememberInput}
							checked={this.state.remember}
							onChange={this.changeRemember}
						/>
						Remember Me
					</label>
					<button className={`cronch-button ${styles.login}`}>Login</button>
				</form>
			</div>
		);
	}
}
