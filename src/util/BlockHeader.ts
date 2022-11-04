



export default class BlockHeader {

    private rawHeader : string

    constructor(rawHeader: string){
        this.rawHeader = rawHeader;
    }

}


// function createByteReader() : ReadableStream {

//     let readableStream = new ReadableStream();
//     let reader = readableStream.getReader(["byob"]);
// }