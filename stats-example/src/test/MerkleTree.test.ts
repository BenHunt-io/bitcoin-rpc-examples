import MerkleTree from '../util/MerkleTree';

test('Compute hashes', () => {

    let txIds = ["1","2","3"];

    let merkleRootHash = MerkleTree.computeHash(txIds);

    expect(merkleRootHash)
        .toBe("f3f1917304e3af565b827d1baa9fac18d5b287ae97adda22dc51a0aef900b787");
})

// Recompute the merkle tree hash that was computed by my bitcoin node.
test("Recompute blockchain merkleTreeHash", () => {

    // bens-wallet: bcrt1qp2yqlrfqhnhz4pw6lhmw9pec52lnmwajj9dwqn
    // toms-wallet: bcrt1qn6vurnuyqtcw9zf5cr92q7upyyd6cgs9y3z8n2

    let txIdsBE = 
        [
            "d70593b1b688fb92738e6f12e56475b22dfe52fcd7e03b4b10fd37dae5838984",
            "27b99d3e0f900a42016b1a0515a1e4a4b4a7352464c28980c2c9234e4560061c"
        ];

    let txIdsLE = txIdsBE.map(txId => Buffer.from(txId, 'hex').reverse().toString('binary'));
    
    
    let merkleRootBinaryLE = MerkleTree.computeHash(txIdsLE);
    let merkleRootHexBE = Buffer.from(merkleRootBinaryLE, 'binary').reverse().toString('hex');
    expect(merkleRootHexBE)
        .toBe("49b083c0bed905f3d658576e6f74c6aa9bd2253051ce524e73305fff136108b7");

})


// For non-segwit transactions, this is the txID
test("Creation Transaction Hash", () => {

    let rawTx = "020000000001011c0660454e23c9c28089c2642435a7b4a4e4a115051a6b01420a900f3e9db9270100000000ffffffff020065cd1d000000001600149e99c1cf8402f0e28934c0caa07b81211bac22050000000000000000036a01990247304402205e783972da1e5f59c40004b1b772caf5d9381c6c2c800f9ef1b41f788f0f67310220318d980e36af59521dc687fbc0eb51e5bfe6758bd31b2ca7871833c28705035f012103ec9d1988a492ece0632c7dfb79c1d414b45d7f99c694ddbc2d8932d70910ffb900000000";

    let txIdLE = MerkleTree.hashTwice(rawTx);
    let txIdBE = Buffer.from(txIdLE, 'hex').reverse().toString('hex');

    expect(txIdBE).toBe("a1afe339e596a194c2720cb696777139621b1ed997d4533f27114629dd27ae29")
})

