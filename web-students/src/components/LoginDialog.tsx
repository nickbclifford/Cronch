import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	InputAdornment,
	TextField
} from '@material-ui/core';
import bind from 'bind-decorator';
import React, { ChangeEvent } from 'react';
import MyMICDS from '../common/sdk';

export interface LoginDialogProps {
	open: boolean;
	onClose(): void;
}

interface LoginState {
	user: string;
	password: string;
	remember: boolean;
}

export default class LoginDialog extends React.Component<LoginDialogProps, LoginState> {

	state = {
		user: '',
		password: '',
		remember: true
	};

	@bind
	private onUserChange({ target: { value: user } }: ChangeEvent<HTMLInputElement>) {
		this.setState({ user });
	}

	@bind
	private onPasswordChange({ target: { value: password } }: ChangeEvent<HTMLInputElement>) {
		this.setState({ password });
	}

	@bind
	private onRememberToggle({ target: { checked: remember } }: ChangeEvent<HTMLInputElement>) {
		this.setState({ remember });
	}

	@bind
	private onSubmit() {
		MyMICDS.auth.login({
			user: this.state.user,
			password: this.state.password,
			remember: this.state.remember,
			comment: 'Cronchalytics'
		}).subscribe(
			loginRes => {
				if (loginRes.success) {
					this.props.onClose();
				} else {
					alert(`Login Error! ${loginRes.message}`);
					this.setState({ user: '', password: '', remember: true });
				}
			}
		);
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.props.onClose}>
				<DialogTitle>Login with MyMICDS</DialogTitle>
				<DialogContent>
					<FormGroup>
						<TextField
							variant='outlined'
							label='Username'
							value={this.state.user}
							onChange={this.onUserChange}
							InputProps={{
								endAdornment: <InputAdornment position='end'>@micds.org</InputAdornment>
							}}
							fullWidth={true}
							margin='dense'
						/>
						<TextField
							variant='outlined'
							label='Password'
							type='password'
							value={this.state.password}
							onChange={this.onPasswordChange}
							fullWidth={true}
							margin='dense'
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.remember}
									onChange={this.onRememberToggle}
									color='primary'
								/>
							}
							label='Remember me'
						/>
					</FormGroup>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.onClose} color='primary'>
						Cancel
					</Button>
					<Button onClick={this.onSubmit} color='primary'>
						Login
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

}
