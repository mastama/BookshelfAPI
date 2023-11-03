const winston = require('winston');
const moment = require('moment-timezone');
// Cetak timestamp dan zona waktu saat aplikasi dijalankan
// console.log('Timestamp saat ini:', moment().format());
// console.log('Zona waktu saat ini:', moment.tz.guess());

// Atur zona waktu sesuai dengan zona waktu lokal
moment.tz.setDefault('Asia/Jakarta');

//buat format timestamp khusu dengan moment-timezone
const customTimestampFormat = winston.format((info) => {
    info.timestamp = moment().format();
    return info;
})

const logger = winston.createLogger({
    level: "info",
    // format: winston.format.json(),
    format: winston.format.combine(
        winston.format.colorize(), //menambahkan warna ke log
        customTimestampFormat(),
        winston.format.printf(({
            level, message, timestamp, ...metadata
        }) => {
            // Menambahkan nomor baris kode saat ini ke pesan log
            const stackInfo = (new Error()).stack.split('\n')[2];
            // const lineNumber = stackInfo.indexOf("at ") > -1 ? stackInfo.substring(stackInfo.indexOf(":") + 1, stackInfo.lastIndexOf(":")) : null;

            // return `${timestamp} [${level}] (${lineNumber}): ${message} ${metadata ? JSON.stringify(metadata) : ''}`;
            return `${timestamp} [${level}] : ${message} ${metadata ? JSON.stringify(metadata) : ''}`;
        })
        // winston.format.simple(), //format teks biasa
    ),
    // defaultMeta: {service: "submission"},
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: "error.log", level: "error" }),
        // new winston.transports.File({ filename: "combined.log" })
    ],
});

module.exports = logger;