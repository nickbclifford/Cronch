import { Column, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Timeslot from './Timeslot';

@Table
export default class User extends Model<User> {
	@PrimaryKey
	@Column
	username!: string; // MyMICDS username

	@Default(false)
	@Column
	dataSharing!: boolean;

	@HasMany(() => Timeslot)
	timeslots!: Timeslot[];
}
