const http = require('http')
const https = require('https')

class Request {
    static async Get(url) {
        return new Promise((resolve, reject) => {
            if (url.startsWith('http://'))
                var api = http;
            else if (url.startsWith('https://'))
                var api = https;
            else
                resolve(null);
    
            api.get(url, function (result) {
                let data = "";
                result.on("data", function (buffer) {
                    data += buffer;
                });
                result.on("end", function () {
                    var json = null;
    
                    try { json = JSON.parse(data) }
                    catch { }
    
                    resolve(json);
                });
    
                result.on('error', (err) => {
                    console.log(err);
                    resolve(null)
                })
            });
        });
    }
    static async Post(url, data) {
        if (typeof data == 'object')
            data = JSON.stringify(data);
    
        const dataString = data;
    
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length,
            }
        }
    
        return new Promise((resolve, reject) => {
            if (url.startsWith('http://'))
                var api = http;
            else if (url.startsWith('https://'))
                var api = https;
            else
                resolve(null);
    
            const req = api.request(url, options, (res) => {
                const body = []
                res.on('data', (chunk) => body.push(chunk))
                res.on('end', () => {
                    const resString = Buffer.concat(body).toString()
                    var json = null;
    
                    try { json = JSON.parse(resString) }
                    catch { }
    
                    resolve(json);
                })
            })
    
            req.on('error', (err) => {
                resolve(null)
            })
    
            req.write(dataString)
            req.end()
        })
    }
}

module.exports = Request;