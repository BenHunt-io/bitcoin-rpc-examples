import {getMaxMemPoolSizeMb} from "../Mempool";


test("Mempool size in mb", async () => {
    let maxMemPoolMb = await getMaxMemPoolSizeMb();
    expect(maxMemPoolMb).toBe(300);
})

