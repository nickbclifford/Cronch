import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export default class NotificationToken extends Model<NotificationToken> {
	@PrimaryKey
	@Column
	expoToken!: string;

	// TODO: More data?
}
