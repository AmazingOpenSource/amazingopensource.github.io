const csv = require('fast-csv');
const fs = require('fs');
// const axios = require('axios');
const moment = require('moment')

const MARKDOWN_PATH = `${__dirname}/README.md`;
let currentTime = '';

const renderMarkdown =async ({ date, name, url, description }) => {
    
    const week = moment(date).weeksInYear();
    const year = moment(date).year();
    const time = `${year}年 第${week}周 \n`;
    let line = '';
    let userRepo=null;
    if (currentTime !== time) {
        line += `<h2>${time}</h2>`;
        currentTime = time;
     }
     if(url.match(/github.com/)){
        userRepo=url.split('https://github.com')[1]
     }
    // const response = await axios.get(`https://api.github.com/repos${userRepo}`);
    // console.log(response.data.description)
    line += `<div style='display:flex;flex-direction:column;border-bottom:1px solid dashed;'><a href='${url}' target="_blank" style='font-size:16px;display:block;font-weight:bold;'>${name}</a>`;
    line += `<span style='font-size:12px;'>${description}</span>`
    line += `<div style=''>
    <a href="#"><img height='14' alt="GitHub stars" src="https://img.shields.io/github/license${userRepo}?display_timestamp=committer"></a>
    <a href="#"><img height='14' alt="GitHub stars" src="https://img.shields.io/github/stars${userRepo}?style=flat"></a>
    <a href="#"><img height='14' alt="GitHub stars" src="https://img.shields.io/github/last-commit${userRepo}?display_timestamp=committer"></a>
    </div></div>`;
    return line;
}

let post = '';

csv.parseFile("./repositories.csv", { headers: true })
    .on('error', error => console.error(error))
    .on('data',async row => {
        const convertedLine = await renderMarkdown(row);
        post = post + convertedLine;
    })
    .on('end', async rowCount => {
        // console.log(`Parsed ${rowCount} rows`)

        post = `<div style="background:url('./images/open-source.jpeg') no-repeat;background-size:cover;height:280px;width:100%;background-position: center;"><div style="width:100%;height:100%;background-color:rgba(0,0,0,0.5);"><h2 style="line-height:280px;width:100%;text-align:center;font-weight:700;color:#fff;font-size:42px;">THE WEEKLY OPEN-SOURCE PROJECT</h2></div></div> <br> ${post}`;

        if (fs.existsSync(MARKDOWN_PATH)) {
            fs.rmSync(MARKDOWN_PATH)
        }
        fs.writeFileSync(MARKDOWN_PATH, post)
    });
