import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import BattlePlanTask from './BattlePlanTask';
import NotificationToken from './NotificationToken';
import Response from './QuestionnaireResponse';
import Timer from './Timer';
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

	@Default(0)
	@Column(DataType.INTEGER)
	alarmSelection!: number;

	@Default(0)
	@Column(DataType.INTEGER)
	timerSelection!: number;

	@HasMany(() => Timer)
	timers!: Timer[];

	@HasMany(() => BattlePlanTask)
	battlePlanTasks!: BattlePlanTask[];

	@HasMany(() => NotificationToken)
	notificationTokens!: NotificationToken[];
}
