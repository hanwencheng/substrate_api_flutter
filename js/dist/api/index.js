var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiPromise, WsProvider } from '@polkadot/api';
import constants from '../constants';
import { getIdentityTokens, getTokenIdentity, getOwnedIdentities, genericQuery } from './query';
import { subscribe } from './sub';
import _ from 'lodash';
const wsProvider = new WsProvider(constants.litentry);
let api;
export function init() {
    return __awaiter(this, void 0, void 0, function* () {
        api = (yield ApiPromise.create({
            provider: wsProvider,
            types: constants.litentryTypes
        }));
        window.api = api;
        window.litentry = {
            query: {
                getIdentityTokens: _.curry(getIdentityTokens)(api),
                getTokenIdentity: _.curry(getTokenIdentity)(api),
                getOwnedIdentities: _.curry(getOwnedIdentities)(api),
            },
            generic: _.curry(genericQuery)(api),
            sub: _.curry(subscribe)(api),
            tx: {}
        };
        return api;
    });
}
// @ts-ignore
export default api;
