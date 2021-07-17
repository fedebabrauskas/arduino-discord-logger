const EventEmitter = require("events");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

const port = new SerialPort(process.env.SERIAL_PORT, { autoOpen: false });

const bus = new EventEmitter();

const delimiter = process.platform === "win32" ? "\r\n" : "\n";
const parser = port.pipe(new Readline({ delimiter }));

parser.once("data", (data) => {
    if (data === "ready") {
        bus.emit("ready");
    }
});

const writeMessage = (message) => {
    return new Promise((resolve, reject) => {
        port.write(message, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

const closeConnection = () => {
    return new Promise((resolve, reject) => {
        port.close((err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

exports.createConnection = () => {
    return new Promise((resolve, reject) => {
        if (port.isOpen) {
            return reject(new Error("Serial port is already open!"));
        }
        port.open((err) => {
            if (err) {
                return reject(err);
            }
            bus.once("ready", () => {
                resolve({ writeMessage, closeConnection });
            });
        });
    });
};
