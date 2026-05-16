const https = require('https');

const getWikiImg = (title, cb) => {
  https.get(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=500`, res => {
    let d='';
    res.on('data', c => d+=c);
    res.on('end', () => {
      try {
        const p = Object.values(JSON.parse(d).query.pages)[0];
        cb(p.thumbnail ? p.thumbnail.source : null);
      } catch(e){ cb(null); }
    });
  }).on('error', ()=>cb(null));
};

const titles = ['Kalki 2898 AD', 'Salaar: Part 1 – Ceasefire', 'Devara: Part 1', 'Hanu-Man', 'Guntur Kaaram', 'Ala Vaikunthapurramuloo', 'Eega'];

let resMap={};
let p = titles.map(t => new Promise(r => getWikiImg(t, url => {
  resMap[t] = url;
  r();
})));

Promise.all(p).then(()=>console.log(JSON.stringify(resMap, null, 2)));
