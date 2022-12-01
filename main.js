const csv = require('fast-csv');
const fs = require('fs');
// const axios = require('axios');
const moment = require('moment')

const MARKDOWN_PATH = `${__dirname}/index.html`;
let currentTime = '';

const renderMarkdown = async ({ date, name, url, description }) => {

    const week = moment(date).weeksInYear();
    const year = moment(date).year();
    const time = `${year}年 第${week}周 \n`;
    let line = '';
    let userRepo = null;
    if (currentTime !== time) {
        line += `<h2>${time}</h2>`;
        currentTime = time;
    }
    if (url.match(/github.com/)) {
        userRepo = url.split('https://github.com')[1]
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
    .on('data', async row => {
        const convertedLine = await renderMarkdown(row);
        post = post + convertedLine;
    })
    .on('end', async rowCount => {
        // console.log(`Parsed ${rowCount} rows`)
        const template = (html) => {
            return `
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Weekly Amazing Open-Source.</title>
    <style>
        body{
            max-width: 880px;
            margin: 0 auto;
            padding: 24px 0;
        }

        .header>img {
            width: 100%;
        }

        .header>div {
            position: relative;
            top: -40px;
            border: 1px solid #fff;
            width: calc(100% - 80px);
            height: 100%;
            background-color: #fff;
            margin: 0 40px;
        }
        .body{
            width: calc(100% - 80px);
            margin: 0 auto;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src='./images/open-source.jpeg' alt="" srcset="">
        <div>
            <h2 style="width:100%;font-family: Arial,sans-serif;text-align:center;font-weight:700;font-size:44px;">
                The Weekly Amazing Open-Source.
            </h2>
            <span
                style="display: inline-block; width:100%;font-family: Arial,sans-serif;text-align:center;font-weight:700;font-size:20px;">Giving
                Thanks to Open Source Software Contributors.</span>
        </div>
    </div>
    <div class="body">
        ${html}
    </div>
</body>
</html>
            `
        }

        if (fs.existsSync(MARKDOWN_PATH)) {
            fs.rmSync(MARKDOWN_PATH)
        }
        fs.writeFileSync(MARKDOWN_PATH, template(post))
    });
