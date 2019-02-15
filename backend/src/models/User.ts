import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import BattlePlanTask from './BattlePlanTask';
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

	@Column(DataType.INTEGER)
	dataSharing!: DataSharing;

	@HasMany(() => Timeslot)
	timeslots!: Timeslot[];

	@HasMany(() => Response)
	responses!: Response[];

	@Column(DataType.INTEGER)
	alarmSelection!: number;

	@HasMany(() => BattlePlanTask)
	battlePlanTasks!: BattlePlanTask[];
}
