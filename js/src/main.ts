import {ApiPromise, WsProvider, Keyring} from '@polkadot/api';
import {ApiOptions} from '@polkadot/api/types';
import {genericQuery} from './query'
import {
	subscribe
} from './sub'
import _ from 'lodash';
import {getRaw, submit} from './tx';
import { KeyringPair } from '@polkadot/keyring/types';
import { stringCamelCase , hexToU8a, u8aToHex, compactFromU8a, hexStripPrefix, u8aConcat} from '@polkadot/util';
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

	const suri = "ability cave solid soccer gloom thought response hard around minor want welcome//substrate_dev";
	const keyring = new Keyring({ss58Format: 42, type: 'sr25519'});
	const signer:KeyringPair = keyring.addFromUri(suri);
	const rawPayload = '0x0600c401000004000000004db9e47072af71639ed82c43fef1972d324178cb23330a04eac5c3a19b74f81b86af6d9239e1609f59bda6af5717b88e378978d559f571fd9e10fc7c250ba1';
	const signature = '0xf4ff7384609aca844d1b55c33b6a7ce7342683994f362617b8fc883eb2e4392aacdeb9be67f33f0a9f9a6a7047726491c6ac4c1caca2c9d7d57954b0fb441e80';
	const isValidProof = signer.verify(hexToU8a(rawPayload), hexToU8a(signature));
	console.log('isValidProof: '+isValidProof);
	return api
	return api
};

window.init = init;


