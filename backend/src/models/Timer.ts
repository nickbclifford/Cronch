import {
	AutoIncrement,
	BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import User from './User';

@Table
export default class Timer extends Model<Timer> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@Column(DataType.INTEGER)
	work!: number;

	@Column(DataType.INTEGER)
	break!: number;

	@Column(DataType.BOOLEAN)
	selected!: boolean;

	@ForeignKey(() => User)
	@Column
	user!: string;

	@BelongsTo(() => User)
	userObject!: User;
}
