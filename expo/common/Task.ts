import moment from 'moment';
import { Block, ClassType, DefaultCanvasClass, MyMICDSClass } from './MyMICDS';

export default interface Task {
	_id: string;
	class: MyMICDSClass | DefaultCanvasClass;
	title: string;
	start: moment.Moment;
	end: moment.Moment;
	link?: string;
	checked: boolean;
	desc: string;
	descPlaintext: string;
}

export const breakTask: Task = {
	_id: 'Break',
	class: {
		_id: 'Break',
		user: '',
		name: 'Custom Task',
		teacher: {
			_id: null,
			prefix: '',
			firstName: '',
			lastName: ''
		},
		type: ClassType.OTHER,
		block: Block.OTHER,
		color: '#34444F',
		textDark: false
	},
	title: 'Break',
	start: moment().startOf('day'),
	end: moment().endOf('day'),
	checked: false,
	desc: '',
	descPlaintext: ''
};
