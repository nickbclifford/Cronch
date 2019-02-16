import { MyMICDS, MyMICDSOptions } from '@mymicds/sdk';
import { AsyncStorage } from 'react-native';

export const jwtKey = '@MyMICDS:jwt';

const mymicdsConfig: MyMICDSOptions = {
	baseURL: 'https://api.mymicds.net/v3',
	async jwtGetter() {
		return await AsyncStorage.getItem(jwtKey);
	},
	async jwtSetter(jwt) {
		await AsyncStorage.setItem(jwtKey, jwt);
	},
	async jwtClear() {
		await AsyncStorage.removeItem(jwtKey);
	},
	updateBackground: false,
	updateUserInfo: true
};

export default new MyMICDS(mymicdsConfig);
export * from '@mymicds/sdk';
