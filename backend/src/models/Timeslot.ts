import {
	AutoIncrement,
	BelongsTo,
	Column,
	DataType,
	Default,
	ForeignKey,
	Model,
	PrimaryKey,
	Table
} from 'sequelize-typescript';
import User from './User';

@Table
export default class Timeslot extends Model<Timeslot> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@Column
	start!: Date;

	@Column(DataType.DATE)
	end!: Date | null;

	@Column(DataType.STRING)
	classId!: string | null; // Object ID from MyMICDS

	@ForeignKey(() => User)
	@Column
	user!: string;

	@BelongsTo(() => User)
	userObject!: User;
}
