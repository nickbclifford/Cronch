import { AutoIncrement,	BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import User from './User';

@Table
export default class Timer extends Model<Timer> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@Column
	work!: number;

	@Column
	break!: number;

	@ForeignKey(() => User)
	@Column
	user!: string;

	@BelongsTo(() => User)
	userObject!: User;
}
