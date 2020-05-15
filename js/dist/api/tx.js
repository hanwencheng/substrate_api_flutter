var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const api = window.api;
import { Keyring } from '@polkadot/api';
function sendTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');
        const BOB = '5GFEpUgkDpQz682Vch1UpWVLUeghiiJPGbZAzEteTUXZxEMa';
        // Make a transfer from Alice to BOB, waiting for inclusion
        const unsub = yield api.tx.balances
            .transfer(BOB, 12345)
            .signAndSend(alice, (result) => {
            console.log(`Current status is ${result.status}`);
            if (result.status.isInBlock) {
                console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
            }
            else if (result.status.isFinalized) {
                console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                unsub();
            }
        });
    });
}
