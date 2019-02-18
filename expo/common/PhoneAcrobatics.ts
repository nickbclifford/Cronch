// @ts-ignore
import { DangerZone } from 'expo';
const { DeviceMotion } = DangerZone;
import { BehaviorSubject } from 'rxjs';

const flipped$ = new BehaviorSubject(false);

DeviceMotion.setUpdateInterval(150);
DeviceMotion.addListener((result: any) => {
	if (typeof result.rotation === 'undefined') { return; }
	// gamma corresponds to rotation perpendicular to phone screen
	const flipped = Math.abs(result.rotation.gamma) > 2.7;
	if (flipped$.value !== flipped) {
		flipped$.next(flipped);
	}
});

export default flipped$;
