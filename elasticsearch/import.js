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
		mapping : {
			total_fields : {limit : 3},
			depth : {limit : 1},
			nested_fields : {limit : 0}
		},
		mappings : {
			call : {
				_all : {enabled : false},
				properties : {
					type : {type : 'keyword'},
					date : {type : 'date', format : 'yyy-MM-dd HH:mm:ss'},
					location : {type : 'geo_point'}
				}
			}
		}
	}
})

createIndex().then(console.log, console.error)


// fs.createReadStream('../911.csv')
//     .pipe(csv())
//     .on('data', data => {
// 		// TODO extract one line from CSV
//     })
//     .on('end', () => {
//       // TODO insert data to
//     })
