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

export enum TaskType {
	CANVAS_ASSIGNMENT,
	CANVAS_CLASS,
	CUSTOM
}

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

	@Column(DataType.INTEGER)
	taskType!: TaskType;

	@Column(DataType.STRING)
	canvasId!: string | null; // Object ID from MyMICDS

	@Column(DataType.STRING)
	customTitle!: string | null;

	@ForeignKey(() => User)
	@Column
	user!: string;

	@BelongsTo(() => User)
	userObject!: User;
}
