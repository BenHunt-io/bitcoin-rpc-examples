import crypto from 'node:crypto';

export default class MerkleTree {

    static computeHash(txIds : string[]) : string {

        // Make an even number of hashes, duplicate last hash if needed.
        if(txIds.length % 2 != 0){
            txIds.push(txIds[txIds.length-1]);
        }

        let hashes = txIds;

        // Keep hashing pairs of hashes until we are left with one final hash
        while(hashes.length > 1){

            let hash : string = hashes.shift()!;
            let hashOther : string = hashes.shift()!;

            const hashResult = MerkleTree.hashTwice(hash+hashOther);

            hashes.push(hashResult);
        }

        return hashes.pop()!;
    }

    static hashTwice(input : string) : string {
        let hasher = crypto.createHash('sha256');
        hasher.update(input, 'hex');
        let firstHash = hasher.digest('hex');

        let secondHasher = crypto.createHash('sha256');
        secondHasher.update(firstHash, 'hex');
        let secondHash = secondHasher.digest('hex');

        return secondHash;
    }
}