import {ApiPromise} from '@polkadot/api';
import {EventRecord} from '@polkadot/types/interfaces';

function post(message: string, debug: boolean): void {
	if(!debug)
		AuthenticationRequestSubs.postMessage(message);
}

export type SubscribeEvent = ( isDebug: boolean) => void;
type SubscribeEventPrivate = (api: ApiPromise, isDebug: boolean) => void;
export const subscribe: SubscribeEventPrivate = (api, isDebug) => {
	api.query.system.events((records: EventRecord[]) => {
		try {
			console.log(`\nReceived ${records.length} events:`);

			// Loop through the Vec<EventRecord>
			records.forEach((record) => {
				// Extract the phase, event and the event types
				const {event, phase} = record;
				const types = event.typeDef;
				let eventJson: any = {};
				const eventName = event.method;
				eventJson[eventName] ={};
				event.data.forEach((data, index) => {
					// @ts-ignore
					eventJson[eventName][types[index].type] = data.toString();
					console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
				});
				post(JSON.stringify(eventJson), isDebug);
				console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
				console.log(`\t\t${event.meta.documentation.toString()}`);

				// Loop through each of the parameters, displaying the type and data

			});
		} catch (e) {
			console.log('error is ', e)
		}
	});
};
