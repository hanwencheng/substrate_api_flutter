const constants = {
    kusama: 'wss://cc3-5.kusama.network/',
    litentry: 'wss://ws.litentry.com',
    litentryTypes: {
        "Address": "AccountId",
        "LookupSource": "AccountId",
        "IdentityOf": {
            "id": "Hash"
        },
        "AuthorizedTokenOf": {
            "id": "Hash",
            "cost": "Balance",
            "data": "u64",
            "datatype": "u64",
            "expired": "u64"
        }
    },
    litentryRPCs: {
        litentry: {
            ownedIdentitiesCount: {
                description: 'get owned identities',
                params: [
                    {
                        name: 'accountId',
                        type: 'AccountId'
                    }
                ],
                type: 'u64'
            },
            registerIdentity: {
                description: 'register identity',
                params: [
                    {
                        name: 'index',
                        type: 'u64'
                    },
                    {
                        name: 'at',
                        type: 'Hash',
                        isOptional: true
                    }
                ],
                type: 'Balance'
            }
        }
    }
};
export default constants;
