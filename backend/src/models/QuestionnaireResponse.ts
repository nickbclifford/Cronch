import {
	AutoIncrement,
	BelongsTo,
	Column,
	CreatedAt,
	ForeignKey,
	Model,
	PrimaryKey,
	Table
} from 'sequelize-typescript';
import User from './User';

@Table
export default class QuestionnaireResponse extends Model<QuestionnaireResponse> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@Column
	questionnaire!: number;

	@Column
	question!: number;

	@Column
	answer!: number;

	@ForeignKey(() => User)
	@Column
	user!: string;

	@BelongsTo(() => User)
	userObject!: User;

	@CreatedAt
	answeredAt!: Date;
}
