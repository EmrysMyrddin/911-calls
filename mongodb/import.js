const mongodb = require('mongodb')
const csv = require('csv-parser')
const fs = require('fs')

const MongoClient = mongodb.MongoClient
const mongoUrl = 'mongodb://localhost:27017/911-calls'

const formatData = data => {
	const {lat, lng, title, timeStamp: date, zip, twp : town, addr} = data
	const splitPoint = title.indexOf(':')
	const category = title.substring(0, splitPoint).toUpperCase()
	const description = title.substring(splitPoint + 1, title.length).trim()
	return {
		category, description, date,
		location : [parseFloat(lat), parseFloat(lng)], addr, town, zip
	}
}

const insertCalls = function(db, callback) {
	const collection = db.collection('calls')

	const calls = []
	fs.createReadStream('../simple-911.csv')
		.pipe(csv())
		.on('data', data => calls.push(formatData(data)))
		.on('end', () => {
			collection.insertMany(calls, (err, result) => {
				if(err) console.error(err)
				else callback(result)
			})
		})
}

MongoClient.connect(mongoUrl, (err, db) => {
	insertCalls(db, result => {
		console.log(`${result.insertedCount} calls inserted`)
		db.close()
	})
})
