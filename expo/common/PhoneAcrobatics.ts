// @ts-ignore
import { DangerZone } from 'expo';
const { DeviceMotion } = DangerZone;
import { BehaviorSubject } from 'rxjs';

const flipped$ = new BehaviorSubject(false);

DeviceMotion.setUpdateInterval(150);
DeviceMotion.addListener((result: any) => {
	if (typeof result.rotation === 'undefined') { return; }
	const { alpha, beta, gamma } = result.rotation;
	const flipped = Math.abs(gamma) > 2.7;
	if (flipped$.value !== flipped) {
		flipped$.next(flipped);
	}
});

export default flipped$;
