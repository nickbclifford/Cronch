import { MyMICDS, MyMICDSOptions } from '@mymicds/sdk';
import { AsyncStorage } from 'react-native';

const mymicdsConfig: MyMICDSOptions = {
	baseURL: 'https://api.mymicds.net/v3',
	async jwtGetter() {
		return await AsyncStorage.getItem('@MyMICDS:jwt');
	}
};
