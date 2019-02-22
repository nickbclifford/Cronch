import { MyMICDS, MyMICDSOptions } from '@mymicds/sdk';

const mymicdsConfig: Partial<MyMICDSOptions> = {
	baseURL: 'https://api.mymicds.net/v3',
	updateBackground: false,
	updateUserInfo: true
};

export default new MyMICDS(mymicdsConfig);
export * from '@mymicds/sdk';
