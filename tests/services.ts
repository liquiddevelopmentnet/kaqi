import { Service, GET, UrlSuffix, Hook, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, TRACE, CONNECT, CUSTOM, ServiceBuilder } from '..'

@UrlSuffix('/api')
export class TestService extends Service {
    @GET('/get')
    async test() { }

    @GET('/get2')
    async test2() { }

    @Hook('test2')
    private hook() {
        return {
            foo: 'bar'
        }
    }

    @POST('/post')
    async test3() { }

    @PUT('/put')
    async test4() { }

    @PATCH('/patch')
    async test5() { }

    @DELETE('/delete')
    async test6() { }

    @HEAD('/head')
    async test7() { }

    @OPTIONS('/options')
    async test8() { }

    @TRACE('/trace')
    async test9() { }

    @CONNECT('/connect')
    async test10() { }

    @CUSTOM('CUSTOM', '/custom')
    async test11() { }
}

const testService = new ServiceBuilder()
    .setEndpoint('api.com')
    .setSecure(false)
    .build(TestService)

export { testService }