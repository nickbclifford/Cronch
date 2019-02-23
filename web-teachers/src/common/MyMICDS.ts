import { MyMICDS, MyMICDSOptions } from '@mymicds/sdk';

export const jwtKey = '@MyMICDS:jwt';

const mymicdsConfig: Partial<MyMICDSOptions> = {
	baseURL: 'https://api.mymicds.net/v3',
	updateBackground: false,
	updateUserInfo: true
};

export default new MyMICDS(mymicdsConfig);
export * from '@mymicds/sdk';
