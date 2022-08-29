
import { setInterval } from 'node:timers/promises';
import { ReadableStream, ReadableStreamBYOBReader, ReadableStreamErrorCallback, UnderlyingByteSource } from 'node:stream/web';
import { ReadableByteStreamController, ReadableByteStreamControllerCallback } from 'stream/web';


test("Create readable stream w/ async iterators", async () => {

    let inputStream = new ReadableStream({
        async start(controller){
            let count = 0;
            for await (const date of setInterval(new Date().getTime(), 100)){
                controller.enqueue(new Date().getTime());
            }
        }
    })


    let count = 0;
    for await (const chunk of inputStream){
        console.log(chunk);
        count++;
        if(count == 10){
            break;
        }
    }
})


class Source implements UnderlyingByteSource {
    
    private data : string;

    constructor (data : string) {
        this.data = data;
    }

    type: 'bytes' = 'bytes';

    async start(controller : ReadableByteStreamController) {
        let buffer = Buffer.from(this.data);
        let actualBuffer = Buffer.alloc(buffer.byteLength);
        actualBuffer.write(this.data);
        controller.enqueue(actualBuffer);
    }

    autoAllocateChunkSize = undefined;
}

test("Create readable byte stream", async () => {

    let stream = new ReadableStream(new Source("testdata"));
    // @ts-ignore
    let reader : any = stream.getReader({mode : "byob"});
    
    let result = await reader.read(Buffer.alloc(8));

    expect(result.value.toString()).toBe("testdata");

})