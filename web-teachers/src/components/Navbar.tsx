import bind from 'bind-decorator';
import React from 'react';
import { NavLink } from 'react-router-dom';

import MyMICDS from '../common/MyMICDS';
import styles from './Navbar.module.scss';

export const routes = [
	{
		name: 'Classes List',
		link: '/classes-list'
	},
	{
		name: 'Heatmap',
		link: '/heatmap'
	}
];

export default class Navbar extends React.Component {

	render() {
		return (
			<nav className={styles.navbar}>
				<div className={styles.navbarBrand}>
					<img src='/favicon/favicon-32x32.png' className={styles.navbarLogo} />
					<span className={styles.navbarTitle}>Cronchalytics</span>
				</div>
				{routes.map(route => (
					<NavLink className={styles.navbarLink} to={route.link} activeClassName={styles.active}>{route.name}</NavLink>
				))}
			</nav>
		);
	}
}
