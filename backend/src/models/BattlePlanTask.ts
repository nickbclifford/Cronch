import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import User from './User';

@Table
export default class BattlePlanTask extends Model<BattlePlanTask> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@ForeignKey(() => User)
	@Column
	user!: string;

	@Column
	planOrder!: number;

	@Column
	@Unique
	taskId!: string; // Object ID or task title

	@BelongsTo(() => User)
	userObject!: User;
}
