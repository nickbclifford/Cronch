import { Gyroscope } from 'expo';
import { Observable } from 'rxjs';

const gyro$ = new Observable<boolean>(subscriber => {
	Gyroscope.setUpdateInterval(250);
	Gyroscope.addListener(result => {
		if (result.y > 5.11 || result.y < -5.11) { // this value is the threshold of a 'flip'
			subscriber.next(true);
		} else {
			subscriber.next(false);
		}
	});
});

export default gyro$;
