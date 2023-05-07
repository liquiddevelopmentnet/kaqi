import { GET, Service, ServiceBuilder, UrlSuffix, Hook } from '..'

@UrlSuffix('/test')
class TestService extends Service {
	@GET('/ping')
	async ping(): Promise<{ status: string }> {
		return <never>{}
	}

	@Hook('ping')
	private hook_ping(data: { status: string }) {
		console.log('This is in the hook, data before: ', data)
		data.status = data.status.split('').reverse().join('')
		return data
	}
}

class TodoService extends Service {
	@GET('/todos')
	async getTodos(): Promise<{ id: number; title: string; completed: boolean }[]> {
		return <never>{}
	}
}

const builder = new ServiceBuilder()
	.setEndpoint('liquidev.free.beeceptor.com') // Mock API
	.setBasePath('/api/v1')

const testService = builder.build(TestService)
const todoService = builder.build(TodoService)

todoService.getTodos().then(console.log)
testService.ping().then(result => console.log('Data After: ', result))
