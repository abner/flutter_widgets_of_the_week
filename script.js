const fs = require("fs");
const youtubedl = require("youtube-dl");
const slug = require('slug');
const path = require('path');

const promisify = require('util').promisify;
// var videos = [
//   "https://www.youtube.com/watch?v=b_sQ9bMltGU&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=2&t=0s",
//   "https://www.youtube.com/watch?v=lkF0TQJO0bA&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=3&t=0s",
//   "https://www.youtube.com/watch?v=_rnZaagadyo&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=4&t=0s",
//   "https://www.youtube.com/watch?v=z5iw2SeFx2M&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=5&t=0s",
//   "https://www.youtube.com/watch?v=yI-8QHpGIP4&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=6&t=0s",
//   "https://www.youtube.com/watch?v=9hltevOHQBw&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=7&t=0s",
//   "https://www.youtube.com/watch?v=ek8ZPdWj4Qo&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=8&t=0s",
//   "https://www.youtube.com/watch?v=rLwWVbv3xDQ&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=9&t=0s",
//   "https://www.youtube.com/watch?v=2uaoEDOgk_I&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=10&t=0s",
//   "https://www.youtube.com/watch?v=J1gE9xvph-A&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=11&t=0s",
//   "https://www.youtube.com/watch?v=_lbE0wsVZSw&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=12&t=0s",
//   "https://www.youtube.com/watch?v=R9C5KMJKluE&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=13&t=0s",
//   "https://www.youtube.com/watch?v=ORiTTaVY6mM&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=14&t=0s",
//   "https://www.youtube.com/watch?v=pK738Pg9cxc&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=15&t=0s",
//   "https://www.youtube.com/watch?v=MkKEWHfy99Y&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=16&t=0s",
//   "https://www.youtube.com/watch?v=ml5uefGgkaA&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=17&t=0s",
//   "https://www.youtube.com/watch?v=eI43jkQkrvs&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=18&t=0s",
//   "https://www.youtube.com/watch?v=Be9UH1kXFDw&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=19&t=0s",
//   "https://www.youtube.com/watch?v=kp14Y4uHpHs&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=20&t=0s",
//   "https://www.youtube.com/watch?v=EeEfD5fI-5Q&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=21&t=0s",
//   "https://www.youtube.com/watch?v=T4Uehk3_wlY&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=22&t=0s",
//   "https://www.youtube.com/watch?v=IYDVcriKjsw&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=23&t=0s",
//   "https://www.youtube.com/watch?v=65HoWqBboI8&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=24&t=0s",
//   "https://www.youtube.com/watch?v=9z_YNlRlWfA&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=25&t=0s",
//   "https://www.youtube.com/watch?v=dYRs7Q1vfYI&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=26&t=0s",
//   "https://www.youtube.com/watch?v=g2E7yl3MwMk&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=27&t=0s",
//   "https://www.youtube.com/watch?v=EgtPleVwxBQ&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=28&t=0s",
//   "https://www.youtube.com/watch?v=N-RiyZlv8v8&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=29&t=0s",
//   "https://www.youtube.com/watch?v=iEMgjrfuc58&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=30&t=0s",
//   "https://www.youtube.com/watch?v=EHPu_DzRfqA&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=31&t=0s",
//   "https://www.youtube.com/watch?v=s-ZG-jS5QHQ&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=32&t=0s",
//   "https://www.youtube.com/watch?v=QzA4c4QHZCY&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=33&t=0s",
//   "https://www.youtube.com/watch?v=ZtfItHwFlZ8&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=34&t=16s",
//   "https://www.youtube.com/watch?v=CI7x0mAZiY0&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=35&t=0s",
//   "https://www.youtube.com/watch?v=A3WrA4zAaPw&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=36&t=0s",
//   "https://www.youtube.com/watch?v=7FJgd7QN1zI&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=37&t=0s",
//   "https://www.youtube.com/watch?v=1t-8rBCGBYw&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=38&t=0s",
//   "https://www.youtube.com/watch?v=pJcbh8pbvJs&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=39&t=0s",
//   "https://www.youtube.com/watch?v=XcnP3_mO_Ms&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=40&t=0s",
//   "https://www.youtube.com/watch?v=uVki2CIzBTs&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=41&t=0s",
//   "https://www.youtube.com/watch?v=LPe56fezmoo&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=42&t=0s",
//   "https://www.youtube.com/watch?v=rykDVh-QFfw&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=43&t=0s",
//   "https://www.youtube.com/watch?v=3fB1mxOsqJE&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=44&t=0s",
//   "https://www.youtube.com/watch?v=2W7POjFb88g&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=45&t=0s",
//   "https://www.youtube.com/watch?v=hC3s2YdtWt8&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=46&t=0s",
//   "https://www.youtube.com/watch?v=PY2m0fhGNz4&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=47&t=0s",
//   "https://www.youtube.com/watch?v=_O0PPD1Xfbk&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=48&t=0s",
//   "https://www.youtube.com/watch?v=NvtMt_DtFrQ&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=49&t=0s",
//   "https://www.youtube.com/watch?v=o2KveVr7adg&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=50&t=0s",
//   "https://www.youtube.com/watch?v=liEGSeD3Zt8&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=51&t=0s",
//   "https://www.youtube.com/watch?v=QZAvjqOqiLY&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=52&t=0s",
//   "https://www.youtube.com/watch?v=PEsY654EGZ0&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=53&t=0s",
//   "https://www.youtube.com/watch?v=KJpkjHGiI5A&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=54&t=0s",
//   "https://www.youtube.com/watch?v=l8dj0yPBvgQ&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=55&t=0s",
//   "https://www.youtube.com/watch?v=c1xLMaTUWCY&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=56&t=0s",
//   "https://www.youtube.com/watch?v=ZSU3ZXOs6hc&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=57&t=0s",
//   "https://www.youtube.com/watch?v=ktTajqbhIcY&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=58&t=0s",
//   "https://www.youtube.com/watch?v=ufb4gIPDmEs&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=59&t=0s",
//   "https://www.youtube.com/watch?v=75CsnyRXf5I&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=60&t=0s",
//   "https://www.youtube.com/watch?v=PGK2UUAyE54&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=61&t=0s",
//   "https://www.youtube.com/watch?v=Hgw819mL_78&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=62&t=0s",
//   "https://www.youtube.com/watch?v=F7Cll22Dno8&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=63&t=0s",
//   "https://www.youtube.com/watch?v=kVEguaQWGAY&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=64&t=0s",
//   "https://www.youtube.com/watch?v=U-ao8p4A82k&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=65&t=0s",
//   "https://www.youtube.com/watch?v=l9uHB8VXZOg&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=66&t=0s",
//   "https://www.youtube.com/watch?v=7oIAs-0G4mw&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=67&t=31s",
//   "https://www.youtube.com/watch?v=POtoEH-5l40&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=68&t=0s",
//   "https://www.youtube.com/watch?v=WRj86iHihgY&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=69&t=0s",
//   "https://www.youtube.com/watch?v=zpO6n_oZWw0&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=70&t=0s"
// ];

var videos = [
  "https://www.youtube.com/watch?v=b_sQ9bMltGU&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&index=2&t=0s"
];

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const youtubeGetInfo = promisify(youtubedl.getInfo);
videos.forEach(async videoUrl => {
  try {
    console.log(`Starting to download ${videoUrl}`);
    const info = await youtubeGetInfo(videoUrl);

    console.log('JSON:' + JSON.stringify(info));
    const targetFileName = slug(path.basename(info._filename));

    console.log(`Going to write to ${targetFileName}`);
    const videoDownload = youtubedl(
      videoUrl,
      // Optional arguments passed to youtube-dl.
      ["--format=18", "--no-check-certificate"],
      // Additional options can be given for calling `child_process.execFile()`.
      {
        cwd: __dirname
      }
    );

    var filename = '';
    // Will be called when the download starts.
    videoDownload.on("info", function (info) {
      console.log("Download started");
      console.log("filename: " + info._filename);
      console.log("size: " + info.size);
    });

    videoDownload.pipe(fs.createWriteStream(`${targetFileName}.mp4`));

  } catch (e) {
    console.error(`ERROR: ${e.message}`);
  }
});