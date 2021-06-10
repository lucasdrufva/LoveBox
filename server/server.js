const http = require('http');
const fs = require('fs')
const Jimp = require('jimp');

const width = 40
const height = 60

//latest: 0 = img, 1 = text
//id increments by one every time
let state = JSON.parse(fs.readFileSync('./state.json'))

function requestListener(req, res) {
    console.log(req.url.split("/"))
    switch (req.url.split("/")[1]) {
        case "update":
            handleUpdate(req, res)
            break;
        case "upload":
            handleUpload(req, res)
            break;
        case "download":
            handleDownload(req, res)
            break;
        default:
            res.end("200");
            break;

    }
}

http.createServer(requestListener).listen(5000);

function handleUpdate(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(state));
}

function handleUpload(req, res) {
    let writeStream = fs.createWriteStream('store/upload.png')
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('Uploaded' + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
    req.on('finish', () => {
        writeStream.end()
    })
    req.pipe(writeStream)

    state.id++
    state.latest = 0;
    fs.writeFileSync('state.json', JSON.stringify(state));
}

function handleDownload(req, res) {
    let index = Number(req.url.split("/")[2])
    console.log(index)
    let invalid = index > 31 || index < 0 || isNaN(index)
    if (invalid) {
        res.writeHead(404);
        res.end("Image not found");
        return;
    }

    let x = index % 8
    let y = (index - (index % 8)) / 8

    console.log(x, y)

    Jimp.read('store/upload.png', (err, img) => {
        if (err) throw err;
        img.resize(320, 240) // resize
        console.log(Jimp.intToRGBA(img.getPixelColor(0, 0)))

        let buffer = new ArrayBuffer(4800);

        let pixelView = new Uint16Array(buffer);
        let currentPixel = 0

        for (var i = y * height; i < (y + 1) * height; i++) {
            for (var j = x * width; j < (x + 1) * width; j++) {
                let colors = Jimp.intToRGBA(img.getPixelColor(j, i))
                //console.log(colors)
                pixelView[currentPixel] = ((colors.r >> 3) << 11) + ((colors.g >> 2) << 5) + (colors.b >> 3)
                currentPixel++
            }
        }

        /*res.writeHead(200, {
            'Content-Type': 'application/octet-stream'
        });*/

        res.write(new Uint8Array(buffer));
        res.end();

    });




    /*let readStream = fs.createReadStream('store/upload.png')
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    readStream.pipe(res)
    readStream.on('finish', () => {
        res.end()
    })*/
}