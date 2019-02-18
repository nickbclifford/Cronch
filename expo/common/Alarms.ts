import { PlaybackSource } from 'expo';

export interface CronchAlarm {
	file: PlaybackSource;
	displayName: string;
}

export const alarmList: CronchAlarm[] = [{
	file: require('../assets/alarm-sounds/2001-A-Space-Odyssey.mp3'),
	displayName: 'Space Odyssey Theme'
}, {
	file: require('../assets/alarm-sounds/samsung-loop.mp3'),
	displayName: 'Bright and Cheery :)'
}, {
	file: require('../assets/alarm-sounds/chime.wav'),
	displayName: 'Light Chimes'
}, {
	file: require('../assets/alarm-sounds/harp.mp3'),
	displayName: 'Beautiful Harps'
}, {
	file: require('../assets/alarm-sounds/analog-watch-alarm_daniel-simion.mp3'),
	displayName: 'Analog Watch'
}, {
	file: require('../assets/alarm-sounds/Temple-Bell.mp3'),
	displayName: 'Temple Bells'
}];
