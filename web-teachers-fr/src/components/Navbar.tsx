import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import MyMICDS from '../common/MyMICDS';
import styles from './Navbar.module.scss';

export const routes = [
	{
		name: 'Analytics',
		link: '/analytics',
		requireAuth: true
	},
	{
		name: 'Meta',
		link: '/meta',
		requireAuth: true
	}
];

export interface NavbarProps {
	className: string;
}

export default class Navbar extends React.Component<NavbarProps> {

	render() {
		return (
			<nav className={`${styles.navbar} ${this.props.className ? this.props.className : ''}`}>
				<div className={styles.navbarBrand}>
					<img src='/favicon/favicon-32x32.png' className={styles.navbarLogo} />
					<span className={styles.navbarTitle}>Cronchalytics</span>
				</div>
				<div className={styles.navbarLinks}>
					{routes.filter(route => MyMICDS.auth.isLoggedIn || !route.requireAuth).map((route, i) => (
						<NavLink key={i} className={styles.navbarLink} to={route.link} activeClassName={styles.active}>{route.name}</NavLink>
					))}
				</div>
				{MyMICDS.auth.isLoggedIn && (
					<Link to='/logout' className={`${styles.navbarLink} ${styles.navbarLogout}`}>Logout</Link>
				)}
			</nav>
		);
	}
}
