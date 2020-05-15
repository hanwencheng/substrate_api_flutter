import {ApiPromise} from '@polkadot/api';

function postQueryResult(message: string): void {
	QuerySubs.postMessage(message);
}

export type GenericQuery = (queryFunction: (argument?: any)=> any, argument: any, id: string) => Promise<String>
type GenericQueryPrivate = (api: ApiPromise, queryFunction: (argument?: any)=> any, argument: any, id: string) => Promise<String>
export const genericQuery: GenericQueryPrivate = async (api, queryFunction, argument, id)=> {
	const result = await queryFunction.bind(api)(argument);
	postQueryResult(JSON.stringify({
		result: JSON.stringify(result),
		id
	}));
	return JSON.stringify(result);
};
