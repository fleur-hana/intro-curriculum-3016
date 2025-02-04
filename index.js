'use strict';
const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    console.info(' Requested by ' + req.socket.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        //もし http://localhost:8000 が呼び出されたら,topページ用に作成したpugファイルを読み込む
        if (req.url === '/') {
          res.write(
            pug.renderFile('./top-page.pug')
          );
          //もし http://localhost:8000/enquetes が呼び出されたら,indexページ用に作成したpugファイルを読み込む
        } else if (req.url === '/enquetes') {
          res.write(
            pug.renderFile('index-page.pug')
          );
        } else if (req.url === '/enquetes/yaki-shabu') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: '焼き肉',
              secondItem: 'しゃぶしゃぶ'
            })
          );
        } else if (req.url === '/enquetes/rice-bread') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: 'ごはん',
              secondItem: 'パン'
            })
          );
        } else if (req.url === '/enquetes/sushi-pizza') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: '寿司',
              secondItem: 'ピザ'
            })
          );
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const body = answer.get('name') + 'さんは' +
              answer.get('favorite') + 'に投票しました';
            console.info(body);
            res.write(
              pug.renderFile('./answer.pug', {
                body: body
              })
            );
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error('Server Error', e);
  })
  .on('clientError', e => {
    console.error('Client Error', e);
  });
//process.env.環境変数名 とすれば、node.js の processモジュールの envオブジェクトに記述されているその環境変数を参照できる（変数がなければ undefined を返す）
//環境変数PORTがあればそのポートをサーバの待ち受けとして利用し、なければ8000を利用する
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});