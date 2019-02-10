import moment from 'moment';
import { DefaultCanvasClass, MyMICDSClass } from './MyMICDS';

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
