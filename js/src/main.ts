import {ApiPromise, WsProvider} from '@polkadot/api';
import {ApiOptions} from '@polkadot/api/types';
import {genericQuery} from './query'
import {
	subscribe
} from './sub'
import _ from 'lodash';
import {getRaw, submit} from './tx';

let api: ApiPromise;

export type Init = (endPointer: string, option?: ApiOptions) => Promise<ApiPromise>;
export const init:Init = async (endPointer, options) => {
	api = await ApiPromise.create({
		provider: new WsProvider(endPointer),
		...options
	}) as ApiPromise;
	const metadataRpc: string = await api.runtimeMetadata.asCallsOnly.toHex();
	window.api = api;
	window.query = _.curry(genericQuery)(api);
	window.sub = _.curry(subscribe)(api);
	window.tx = {
		getRaw: _.curry(getRaw)(api)(metadataRpc),
		submit: _.curry(submit)(api)(metadataRpc)
	};
	Verbose.postMessage('__init__');
	return api
};

window.init = init;


