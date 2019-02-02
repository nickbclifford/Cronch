import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import User from './User';

@Table
export default class QuestionnaireResponse extends Model<QuestionnaireResponse> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@Column
	question!: string;

	@Column
	answer!: string;

	@ForeignKey(() => User)
	@Column
	user!: string;

	@BelongsTo(() => User)
	userObject!: User;
}
