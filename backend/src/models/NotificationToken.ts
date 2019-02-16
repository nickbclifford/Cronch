import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import User from './User';

@Table
export default class NotificationToken extends Model<NotificationToken> {
	@PrimaryKey
	@Column
	expoToken!: string;

	@ForeignKey(() => User)
	@Column
	user!: string;

	@BelongsTo(() => User)
	userObject!: User;
}
