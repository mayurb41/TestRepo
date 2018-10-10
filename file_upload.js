var { Writable } = require("stream");
var request = require("request");
var url = "http://adn-static1.nykaa.com/media/catalog/product/cache/4/image/800x800/9df78eab33525d08d6e5fb8d27136e95/8/0/800897832049_01.jpg";

file_download(url, function(data) {
    console.log('data : ', typeof data);
    // fs.writeFileSync("./files/download/test3.jpg", data);
    // filec.write(data);
    var config = {
        projectId: 'kult-2',
        keyFilename: '../serviceAccountKey.json'
    }
    // var gcloud = require('gcloud');
    const {Storage} = require('@google-cloud/storage');
    const projectId = 'kult-2';
    const storage = new Storage(config)
    
    // var storage = gcloud.storage(config);
    // var bucket = storage.bucket("kult-2.appspot.com")

    const bucket = storage.bucket('kult-2.appspot.com');
    
    const file = bucket.file("productVariants/testimage10.jpg");
    
    const stream = file.createWriteStream({
        metadata: {
            contentType: "img/jpg"
        },
        resumable: false
    }).on('error', (err) => {
        console.log("err : ", err);
    }).on('finish', () => {
        console.log("finish...");
    }).end(data);
})

function file_download(url, cb) {
    var final_chunk = "";
    var buffer_arr = [];
    var outStream = new Writable({
        write(chunk, encoding, callback) {
            var new_buf = Buffer.from(chunk);
            buffer_arr.push(new_buf);
            callback();
        }
    });
    request(url).pipe(outStream);
    outStream.on("finish", function () {
        console.log("finish write", Buffer.concat(buffer_arr));
        cb(Buffer.concat(buffer_arr));
    })
}