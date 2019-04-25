export interface MockPromiseChainCall {
  arguments: any[];
}

export interface MockPromiseCall {
  arguments: any[];
  thenCalls: MockPromiseChainCall[];
  catchCalls: MockPromiseChainCall[];
}

export class MockPromise extends Promise<any> {
  public call: MockPromiseCall;

  public constructor(call: MockPromiseCall) {
    super(resolve => {
      return resolve();
    });

    this.call = call;
  }

  public then(...args: any[]) {
    const call: MockPromiseChainCall = {
      arguments: args,
    };

    this.call.thenCalls.push(call);
    return new MockPromise(this.call);
  }

  public catch(...args: any[]) {
    const call: MockPromiseChainCall = {
      arguments: args,
    };

    this.call.catchCalls.push(call);
    return new MockPromise(this.call);
  }
}
