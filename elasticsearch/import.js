const elasticsearch = require('elasticsearch')
const csv = require('csv-parser')
const fs = require('fs')

const esClient = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'error'
})

/* Data structure :
Row {
lat: '40.1004231',
lng: '-75.2070644',
desc: 'CHURCH RD & RAMP RT73 TO RT309 SB; SPRINGFIELD; 2017-01-08 @ 18:12:41;',
zip: '',
title: 'Traffic: DISABLED VEHICLE -',
timeStamp: '2017-01-08 18:12:41',
twp: 'SPRINGFIELD',
addr: 'CHURCH RD & RAMP RT73 TO RT309 SB',
e: '1'
}
*/
const createIndex = () => esClient.indices.create({
	index : '911-calls',
	body : {
		// settings : {
		// 	"analysis": {
		// 		"normalizer": {
		// 			"uppercase_trim": {
		// 				"type": "custom",
		// 				"char_filter": [],
		// 				"filter": ["uppercase", "trim"]
		// 			}
		// 		}
		// 	}
		// },
		mappings : {
			call : {
				properties : {
					category : {
						type : 'keyword'
					},
					town : {
						type : 'keyword'
					},
					date : {type : 'date', format : 'yyy-MM-dd HH:mm:ss'},
					location : {type : 'geo_point'}
				}
			}
		}
	}
})

const creationRequest = { index : {
	_index: '911-calls',
	_type: 'call'
}}

const formatData = data => {
	const {lat, lng: lon, title, timeStamp: date, zip, twp : town, addr} = data
	const splitPoint = title.indexOf(':')
	const category = title.substring(0, splitPoint)
	const description = title.substring(splitPoint + 1, title.length)
	return {
		category, description, date,
		location : {lat, lon}, addr, town, zip
	}
}

const calls = []
fs.createReadStream('../911.csv')
	.pipe(csv())
	.on('data', data => calls.push(creationRequest, formatData(data)))
	.on('end', () =>
		//*
		createIndex()
		.then(console.log)
		/*/
		Promise.resolve()
		//*/
		.then(() => esClient.bulk({ body : calls }))
		.then(console.log)
		.catch(console.error)
	)
