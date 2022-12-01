const csv = require('fast-csv');
const fs = require('fs');
// const axios = require('axios');
const moment = require('moment')

const MARKDOWN_PATH = `${__dirname}/README.md`;
let currentTime = '';

const renderMarkdown =async ({ date, name, url, description }) => {
    
    const week = moment(date).weeksInYear();
    const year = moment(date).year();
    const time = `${year}年 第${week}周`;
    let line = '';
    let userRepo=null;
    if (currentTime !== time) {
        line += `## ${time}</h3>`;
        currentTime = time;
     }
     if(url.match(/github.com/)){
        userRepo=url.split('https://github.com')[1]
     }

    line=line
    + `* [${name}](${url}) <br/>`
    + `${description} <br/>`
        + ` <p><a style="margin-right:4px;" href="#"><img height='13px' src="https://img.shields.io/github/license${userRepo}?display_timestamp=committer"></a>`
    + `<a style="margin-right:4px;" href="#"><img  height='13px'  src="https://img.shields.io/github/stars${userRepo}?style=flat"></a>`
    + `<a  style="margin-right:4px;" href="#"><img  height='13px'  src="https://img.shields.io/github/last-commit${userRepo}?display_timestamp=committer"></a></p>`
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

        // post = `<table><tr>
        // <td width='100'>Name</td>
        // <td width='400'>Description</td>
        // <td>Status</td>
        // </tr>${post}</table>`;
        
        
        const hello = `<div align="center" style="display:flex;flex-direction:column;"><h2>The Weekly Amazing Open-Source.</h2><p>Giving Thanks to Open Source Software Contributors.</p></div>`
        post = 
        `${hello}
            
         \n ${post}`

        if (fs.existsSync(MARKDOWN_PATH)) {
            fs.rmSync(MARKDOWN_PATH)
        }
        fs.writeFileSync(MARKDOWN_PATH, post)
    });
