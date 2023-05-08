import { expect } from 'chai'
import { mockApi } from './mockapi'
import { TestService, testService } from './services'

mockApi()

describe('Utility Decorators', () => {
	it('UrlSuffix', () => {
		expect(TestService.prototype._pre_p_props.suffix).to.equal('/api')
	})

	it('Hook', async () => {
		const result = await testService.test2()
		expect(result).to.deep.equal({ foo: 'bar' })
	})
})

describe('HTTP Methods', () => {
	it('GET', async () => {
		const result = await testService.test()
		expect(result).to.deep.equal({ foo: 'get1' })
	})

	it('POST', async () => {
		const result = await testService.test3()
		expect(result).to.deep.equal({ foo: 'post' })
	})

	it('PUT', async () => {
		const result = await testService.test4()
		expect(result).to.deep.equal({ foo: 'put' })
	})

	it('PATCH', async () => {
		const result = await testService.test5()
		expect(result).to.deep.equal({ foo: 'patch' })
	})

	it('DELETE', async () => {
		const result = await testService.test6()
		expect(result).to.deep.equal({ foo: 'delete' })
	})

	it('HEAD', async () => {
		const result = await testService.test7()
		expect(result).to.deep.equal({ foo: 'head' })
	})

	it('OPTIONS', async () => {
		const result = await testService.test8()
		expect(result).to.deep.equal({ foo: 'options' })
	})

	it('TRACE', async () => {
		const result = await testService.test9()
		expect(result).to.deep.equal({ foo: 'trace' })
	})

	it('CONNECT', async () => {
		const result = await testService.test10()
		expect(result).to.deep.equal({ foo: 'connect' })
	})

	it('Custom Method', async () => {
		const result = await testService.test11()
		expect(result).to.deep.equal({ foo: 'custom' })
	})
})