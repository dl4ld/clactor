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
	console.log("Actor address: " + myAddress)
	// Subscribe for messages
	secureAmqp.secureSubscribe(myAddress + '.bar', function(msg) {
		console.log(msg.msg)
		const reply = msg.header.replyTo
		secureAmqp.securePublish("hello mars", reply, false)
	})
}

main()


