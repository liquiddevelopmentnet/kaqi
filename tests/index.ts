import { expect } from 'chai'
import { mockApi } from './mockapi'
import { TestService, secureTestService, testService } from './services'

mockApi()

describe('Utility Decorators', () => {
	it('Transient', async () => {
		const result = await testService.transient()
		expect(result).to.equal('transient function')
	})

	it('UrlSuffix', () => {
		expect(TestService.prototype._pre_p_props.suffix).to.equal('/api')
	})

	it('Hook', async () => {
		const result = await testService.john()
		expect(result).to.deep.equal({ foo: 'bar' })
	})
})

describe('HTTP Methods', () => {
	it('GET', async () => {
		const result = await testService.get()
		expect(result).to.deep.equal({ foo: 'get1' })
	})

	it('POST', async () => {
		const result = await testService.post()
		expect(result).to.deep.equal({ foo: 'post' })
	})

	it('PUT', async () => {
		const result = await testService.put()
		expect(result).to.deep.equal({ foo: 'put' })
	})

	it('PATCH', async () => {
		const result = await testService.patch()
		expect(result).to.deep.equal({ foo: 'patch' })
	})

	it('DELETE', async () => {
		const result = await testService.delete()
		expect(result).to.deep.equal({ foo: 'delete' })
	})

	it('HEAD', async () => {
		const result = await testService.head()
		expect(result).to.deep.equal({ foo: 'head' })
	})

	it('OPTIONS', async () => {
		const result = await testService.options()
		expect(result).to.deep.equal({ foo: 'options' })
	})

	it('TRACE', async () => {
		const result = await testService.trace()
		expect(result).to.deep.equal({ foo: 'trace' })
	})

	it('CONNECT', async () => {
		const result = await testService.connect()
		expect(result).to.deep.equal({ foo: 'connect' })
	})

	it('Custom Method', async () => {
		const result = await testService.custom()
		expect(result).to.deep.equal({ foo: 'custom' })
	})
})

describe('HTTPS', () => {
	it('GET', async () => {
		const result = await secureTestService.get()
		expect(result).to.deep.equal({ foo: 'get1-secure' })
	})
})
