import { Worker } from 'worker_threads'

export interface WorkerData {
	console?: boolean
	file?: string
}

let worker: Worker

export const startLogger = (data: WorkerData) => {
	worker = new Worker(__dirname + '/worker.js', {
		workerData: data
	})
}

export const stopLogger = () => new Promise(resolve => {
	worker.on('exit', resolve)

	worker.postMessage('exit')
})

export const log = async (level: 'i' | 'w' | 'e', message: string) => {
	worker.postMessage({ level, message })
}