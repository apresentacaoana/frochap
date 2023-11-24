const moment = require('moment/moment')
let hoje = new Date()
hoje.toLocaleTimeString()
console.log(moment(hoje).format('DD/MM/YYYY'))