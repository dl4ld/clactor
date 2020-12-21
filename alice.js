const cmdArgs = require('command-line-args')
const secureAmqp = require('secureamqp')

const cmdOptions = [
	{ name: 'send', alias: 's', type: String},
	{ name: 'config', alias: 'c', type: String}
]
const options = cmdArgs(cmdOptions)
options.config = options.config || "./config"
const config = require(options.config)
const toAddress = options.send

async function main() {
	await secureAmqp.initSecureAmqp(config)
	const myAddress = secureAmqp.getMyAddress()
	console.log("Actor address: ", myAddress)
	const replyTo = secureAmqp.getMyAddress() + '.foo'
	// subscribe for replies
	secureAmqp.secureSubscribe(replyTo, function(msg) {
		console.log(msg.msg)
	})
	// send message
	if(toAddress) {
		await secureAmqp.securePublish("hello world", toAddress + '.bar', replyTo, false)
		await secureAmqp.securePublish("hello jupiter", toAddress + '.bar', replyTo, true)
		setTimeout(async () => {
			await secureAmqp.securePublish("hello saturn", toAddress + '.bar', replyTo, true)
		}, 1000)
	}
}

main()


