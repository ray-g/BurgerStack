// This file is for testing purpose.
// To make 3rd party modules be able to be mocked.
// To make stubs work for:
//  * default exported function
//  * Node.require cached.
// Put any modules in here it makes code hard to test.

export class ThirdPartyModules {
  public static cookieParser() {
    return require('cookie-parser');
  }
}
