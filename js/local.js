setTimeout(async ()=> {
	console.log("api is", window.api);
	debugger;
	if(window.litentry !== undefined){
		window.litentry.sub(true);
		const tokens =  window.litentry.query.getOwnedIdentities('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY').then(
			(result )=>{
				return result;
			});
		const result = await window.litentry.generic(api.query.litentry.ownedIdentitiesCount, "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
		console.log('alice owned tokens are', tokens);
		console.log('generic query result is ', result);
	}
}, 5000);


