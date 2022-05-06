import * as fs from 'node:fs';
import https from 'node:https';

const path = './new-Directory';
const options = {
  hostname: 'memegen-link-examples-upleveled.netlify.app',
  port: 443,
  path: '/',
  method: 'GET',
};

let html = '';
const req = https.request(options, (res) => {
  res
    .on('data', (d) => {
      html += d;
    })
    .on('end', () => {
      const body1 = html.replace(/\s/g, '');
      const url = body1
        .match(/<img[^>]*src="[^"]*"[^>]*>/gm)
        .map((x) => x.replace(/.*src="([^"]*)".*/, '$1'));
      console.log(url);
      fs.access(path, (error) => {
        if (error) {
          fs.mkdir(path, (Error) => {
            if (Error) {
              console.log(Error);
            } else {
              console.log('New Directory created successfully !!');
            }
          });
        } else {
          console.log('Given Directory already exists !!');
        }
      });
      for (let i = 1; i < 11; i++) {
        https.get(url[i], (Res) => {
          const imagePath = './new-Directory/0' + i + '.jpg';
          const stream = fs.createWriteStream(imagePath);
          Res.pipe(stream);

          stream
            .on('finish', () => {
              stream.close();
              console.log('Image downloaded');
            })
            .on('error', (err) => {
              // handle error
              console.log(err);
            });
        });
      }
    });
});

req.on('error', (error) => {
  console.log(error);
});
req.end();
