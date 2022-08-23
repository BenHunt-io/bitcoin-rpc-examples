import Transaction from "../util/Transaction";





test('Parse Transaction', () => {

    let rawTx = "020000000001011c0660454e23c9c28089c2642435a7b4a4e4a115051a6b01420a900f3e9db9270100000000ffffffff020065cd1d000000001600149e99c1cf8402f0e28934c0caa07b81211bac22050000000000000000036a01990247304402205e783972da1e5f59c40004b1b772caf5d9381c6c2c800f9ef1b41f788f0f67310220318d980e36af59521dc687fbc0eb51e5bfe6758bd31b2ca7871833c28705035f012103ec9d1988a492ece0632c7dfb79c1d414b45d7f99c694ddbc2d8932d70910ffb900000000";

    let tx = new Transaction(rawTx);

    expect(tx.getVersion()).toBe(2);
    expect(tx.isWitnessFlagPresent()).toBe(true);
    
    // Parse Inputs
    expect(tx.getInputCount()).toBe(1);
    let txInputs = tx.getTransactionInputs();
    expect(txInputs[0].txId).toBe("27b99d3e0f900a42016b1a0515a1e4a4b4a7352464c28980c2c9234e4560061c");
    expect(txInputs[0].vOut).toBe(1);
    expect(txInputs[0].scriptSigSize).toBe(0);
    expect(txInputs[0].scriptSig).toBe("");
    expect(txInputs[0].sequence).toBe("ffffffff")

    // Parse Outputs
    let txOutputs = tx.getTransactionOutputs();
    expect(tx.getOutputCount()).toBe(2);
    expect(txOutputs[0].value).toBe(500_000_000n);
    expect(txOutputs[0].scriptPubKeySize).toBe(22);
    expect(txOutputs[0].scriptPubKey).toBe('00149e99c1cf8402f0e28934c0caa07b81211bac2205');

    expect(txOutputs[1].value).toBe(0n);
    expect(txOutputs[1].scriptPubKeySize).toBe(3);
    expect(txOutputs[1].scriptPubKey).toBe('6a0199');

    // SegWit
    let witnesses = tx.getWitnesses();
    expect(witnesses[0].size).toBe(71);
    expect(witnesses[0].witness).toBe('304402205e783972da1e5f59c40004b1b772caf5d9381c6c2c800f9ef1b41f788f0f67310220318d980e36af59521dc687fbc0eb51e5bfe6758bd31b2ca7871833c28705035f01');

    expect(witnesses[1].size).toBe(33);
    expect(witnesses[1].witness).toBe('03ec9d1988a492ece0632c7dfb79c1d414b45d7f99c694ddbc2d8932d70910ffb9')

    expect(tx.getLockTime()).toBe(0);

})
