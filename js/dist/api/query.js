var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function postQueryResult(message) {
    QuerySubs.postMessage(message);
}
export const genericQuery = (api, queryFunction, argument, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield queryFunction.bind(api)(argument);
    postQueryResult(JSON.stringify({
        result: JSON.stringify(result),
        id
    }));
    return JSON.stringify(result);
});
export const getIdentityTokens = (api, identityId) => __awaiter(void 0, void 0, void 0, function* () {
    if (identityId === null || identityId === '')
        return [];
    try {
        const totalNumbers = yield api.query.litentry.identityAuthorizedTokensCount(identityId);
        if (totalNumbers.words) {
            const a = new Array(totalNumbers.words[0]).fill(null);
            const promises = a.map((_, i) => {
                return api.query.litentry.identityAuthorizedTokensArray([identityId, i]);
            });
            console.log('promises are', promises);
            let results = yield Promise.all(promises);
            const unwrappedResult = results.map(wrappedItem => wrappedItem.toString());
            console.log('result Array is', results, 'call result is', unwrappedResult);
            return unwrappedResult;
        }
    }
    catch (e) {
        return [];
    }
    return [];
});
export const getTokenIdentity = (api, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield api.query.litentry.authorizedTokenIdentity(token);
        console.log('get result', result);
        if (result.toString() !== '') {
            return result.toString();
        }
    }
    catch (e) {
        return '';
    }
    return '';
});
export const getOwnedIdentities = (api, account) => __awaiter(void 0, void 0, void 0, function* () {
    if (account === null || account === '')
        return [];
    try {
        const totalNumbers = yield api.query.litentry.ownedIdentitiesCount(account);
        if (totalNumbers.words) {
            const a = new Array(totalNumbers.words[0]).fill(null);
            const promises = a.map((_, i) => {
                return api.query.litentry.ownedIdentitiesArray([account, i]);
            });
            console.log('promises are', promises);
            let results = yield Promise.all(promises);
            const unwrappedResult = results.map(wrappedItem => wrappedItem.toString());
            console.log('result Array is', results, 'call result is', unwrappedResult);
            return unwrappedResult;
        }
    }
    catch (e) {
        return [];
    }
    return [];
});
