import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Response from './QuestionnaireResponse';
import Timeslot from './Timeslot';

export enum DataSharing {
	NO_SEND,
	FULL_SEND_ANONYMOUS,
	FULL_SEND
}

@Table
export default class User extends Model<User> {
	@PrimaryKey
	@Column
	username!: string; // MyMICDS username

	@Default(0)
	@Column(DataType.INTEGER)
	dataSharing!: DataSharing;

	@HasMany(() => Timeslot)
	timeslots!: Timeslot[];

	@HasMany(() => Response)
	responses!: Response[];
}
