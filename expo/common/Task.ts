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

export const defaultColor = '#34444F';
export const defaultTextDark = false;

export function createCustomTask(taskName: string): Task {
	return {
		_id: taskName,
		class: {
			_id: taskName,
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
			color: defaultColor,
			textDark: defaultTextDark
		},
		title: taskName,
		start: moment().startOf('day'),
		end: moment().endOf('day'),
		checked: false,
		desc: '',
		descPlaintext: ''
	};
}

export const breakTask = createCustomTask('Break');
