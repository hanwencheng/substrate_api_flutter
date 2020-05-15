import {ApiPromise} from '@polkadot/api';
import {Init} from './main';
import {GenericQuery} from './query';
import {SubscribeEvent} from './sub';
import {GetUnsignedPayload, Submit} from './tx';

export {}

declare global {
	const AuthenticationRequestSubs: {
		postMessage: (message: string)=> void;
	};
	const QuerySubs: {
		postMessage: (message: string)=> void;
	};
	const Verbose: {
		postMessage: (message: string)=> void;
	};
	const TxSubs: {
		postMessage: (message: string)=> void;
	}
}

declare global {
	interface Window {
		init: Init;
		api: ApiPromise;
		query: GenericQuery;
		tx: {
			getRaw: GetUnsignedPayload,
			submit: Submit
		},
		sub: SubscribeEvent;
	}
}
