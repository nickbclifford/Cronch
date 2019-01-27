import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export default class Timeslot extends Model<Timeslot> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@Column(DataType.DATE)
	start!: Date;

	@Column(DataType.DATE)
	end!: Date; // TODO: Should this be nullable?

	@Column
	canvasId!: string; // Object ID from MyMICDS
}
