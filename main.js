const csv = require('fast-csv');
const fs = require('fs');
const moment = require('moment')

const MARKDOWN_PATH = `${__dirname}/README.md`;
let currentTime = '';

const renderMarkdown = ({ date, name, url, description }) => {
    const week = moment(date).weeksInYear();
    const year = moment(date).year();
    const time = `${year}年 第${week}周 \n`;
    let line = '';
    if (currentTime !== time) {
        line += `## ${time}`;
        currentTime = time;
    }
    line += `* [${name}](${url}) ${description} \n`

    return line;
}

let post = '';

csv.parseFile("./repositories.csv", { headers: true })
    .on('error', error => console.error(error))
    .on('data', row => {
        const convertedLine = renderMarkdown(row);
        post = post + convertedLine;
    })
    .on('end', async rowCount => {
        console.log(`Parsed ${rowCount} rows`)
        if (fs.existsSync(MARKDOWN_PATH)) {
            fs.rmSync(MARKDOWN_PATH)
        }
        fs.writeFileSync(MARKDOWN_PATH, post)
    });
