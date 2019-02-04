// @ts-ignore
import { DangerZone } from 'expo';
const { DeviceMotion } = DangerZone;
import { BehaviorSubject } from 'rxjs';

const flipped$ = new BehaviorSubject(false);

DeviceMotion.setUpdateInterval(150);
DeviceMotion.addListener((result: any) => {
	const { alpha, beta, gamma } = result.rotation;
	flipped$.next(Math.abs(gamma) > 2.7);
});

export default flipped$;
