function post(message, debug) {
    if (!debug)
        AuthenticationRequestSubs.postMessage(message);
}
export const subscribe = (api, isDebug) => {
    api.query.system.events((records) => {
        try {
            console.log(`\nReceived ${records.length} events:`);
            // Loop through the Vec<EventRecord>
            records.forEach((record) => {
                // Extract the phase, event and the event types
                const { event, phase } = record;
                const types = event.typeDef;
                let eventJson = {};
                const eventName = event.method;
                if (event.section === 'litentry') {
                    eventJson[eventName] = {};
                    event.data.forEach((data, index) => {
                        // @ts-ignore
                        eventJson[eventName][types[index].type] = data.toString();
                        console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
                    });
                }
                post(JSON.stringify(eventJson), isDebug);
                console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
                console.log(`\t\t${event.meta.documentation.toString()}`);
                // Loop through each of the parameters, displaying the type and data
            });
        }
        catch (e) {
            console.log('error is ', e);
        }
    });
};
