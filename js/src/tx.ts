import {ApiPromise} from '@polkadot/api';
import {ExtrinsicStatus} from '@polkadot/types/interfaces/author';
import {Extrinsic, ExtrinsicPayload} from '@polkadot/types/interfaces/extrinsics'
import Decorated from '@polkadot/metadata/Decorated';
import { Metadata, TypeRegistry } from '@polkadot/types';
import {AccountInfo} from '@polkadot/types/interfaces/system';
import { hexToU8a, u8aToHex} from '@polkadot/util';
import { SignedBlock } from '@polkadot/types/interfaces/runtime';

function prefixSignature (signatureRaw: string): string {
	const u8aSignature = hexToU8a(signatureRaw);
	const u8aHeader = new Uint8Array([1]);
	const signature = new Uint8Array(65);
	signature.set(u8aHeader);
	signature.set(u8aSignature, 1);
	return '0x'+u8aToHex(signature, -1, false);
}

function createDecorated(
	registry: TypeRegistry,
	metadata: string
): Decorated {
	return new Decorated(registry, new Metadata(registry, metadata));
}

interface TxInfo {
	address: string;
	blockHash: string;
	blockNumber: number;
	nonce: number;
	tip: number;
	method: string;
}

function createPayloadJson (api:ApiPromise, info: TxInfo) {
	const extrinsicVersion = api.extrinsicVersion;
	const registry = api.registry;
	const metadataObject = api.runtimeMetadata;
	return {
		address: info.address,
		blockHash: info.blockHash,
		blockNumber: registry.createType('BlockNumber', info.blockNumber).toHex(),
		era: registry
			.createType('ExtrinsicEra', {
				current: info.blockNumber,
				period: 20,
			})
			.toHex(),
		genesisHash: api.genesisHash.toHex(),
		metadataRpc: metadataObject,
		method: info.method,
		nonce: registry.createType('Compact<Index>', info.nonce).toHex(),
		specVersion: registry.createType('u32', api.extrinsicVersion).toHex(),
		tip: registry
			.createType('Compact<Balance>', info.tip)
			.toHex(),
		version: extrinsicVersion,
	};
}


type GetUnsignedPayloadPrivate = (api: ApiPromise, metaDataHex: string, txFunction: (argument?: any) => any, args: [any?], address: string, txId: string) => void
export type GetUnsignedPayload = (txFunction: (argument?: any) => any, args: [any?], address: string, txId: string) => void
export const getRaw : GetUnsignedPayloadPrivate = async (api, metaDataHex, txFunction, args, address, txId) => {
	try {
		const registry = api.registry;
		const currentBlock = await api.rpc.chain.getBlock() as SignedBlock;
		const { nonce } = await api.query.system.account(address) as AccountInfo;
		const unsignedTx = txFunction.apply(api, args);
		const header = await api.rpc.chain.getHeader();
		const metadata = createDecorated(registry as TypeRegistry, metaDataHex);
		const methodFunction = metadata.tx.litentry.registerIdentity().toHex();
		const anotherMethod = api.tx.litentry.registerIdentity;
		const txInfoRaw: TxInfo = {
			address,
			blockHash: currentBlock.block.hash.toString(),
			blockNumber: currentBlock.block.header.number.toNumber(),
			nonce: nonce.toNumber(),
			tip: 0,
			method: methodFunction
		};
		const payloadJson = createPayloadJson(api, txInfoRaw);
		const payload:ExtrinsicPayload = registry.createType('ExtrinsicPayload', payloadJson, { version: payloadJson.version });
		// const payloadHex = payload.toHex();
		const payloadHex = u8aToHex(payload.toU8a(true), -1, false);
		TxSubs.postMessage(JSON.stringify({
			json: txInfoRaw,
			hex: payloadHex,
			id: txId
		}));
	}catch (e){
		// Verbose.postMessage('error in creating tx' + e.toString());
	}
};

function submitPreSignedTx (api: ApiPromise, extrinsic: Extrinsic): void {
	api.rpc.author.submitAndWatchExtrinsic(extrinsic, (result: ExtrinsicStatus) => {
		Verbose.postMessage('__submitted__');
		TxSubs.postMessage('__submitted__');
		console.log(JSON.stringify(result.toHuman(), null, 2));
		Verbose.postMessage("send result is"+ JSON.stringify(result.toHuman()));
	});
}


export type Submit = (signature: string, txInfoJson: string) => Promise<void>;
export type SubmitPrivate = (api: ApiPromise, metaData: string, signature: string, txInfoJson: string) => Promise<void>;
export const submit: SubmitPrivate = async (api, metadata, signature, txInfoJson) => {
	try {
		Verbose.postMessage('receive submit request');
		const registry = api.registry;
		const txInfoRaw = JSON.parse(txInfoJson).json;
		const payloadJson = createPayloadJson(api, txInfoRaw);
		Verbose.postMessage('submit payload is '+ payloadJson);
		const extrinsicWrapper:Extrinsic = registry.createType(
			'Extrinsic',
			{method: payloadJson.method},
			{version: payloadJson.version}
		);
		Verbose.postMessage('raw signature is' +  hexToU8a(signature).toString());
		extrinsicWrapper.addSignature(payloadJson.address, prefixSignature(signature), payloadJson);
		submitPreSignedTx(api, extrinsicWrapper);
	} catch	(e){
		Verbose.postMessage("error in submit"+ e.toString());
	}
}
