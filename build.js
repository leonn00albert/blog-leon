const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');
const fm = require('front-matter');
const { marked } = require('marked');

const directoryPath = '_posts';
const configFilePath = 'config.json';

async function getConfig() {
    try {
        const data = await fs.readFile(configFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing config file:', error);
        throw error;
    }
}

async function getPosts() {
    try {
        const files = await fs.readdir(directoryPath);
        const posts = [];

        for (const file of files) {
            if (path.extname(file).toLowerCase() === '.md') {
                const filePath = path.join(directoryPath, file);
                const mdContent = await fs.readFile(filePath, 'utf8');
                const { attributes, body } = fm(mdContent);
                const markdownObject = {
                    metadata: attributes,
                    content: body
                };
                posts.push(markdownObject);
            }
        }

        return posts;
    } catch (error) {
        console.error('Error reading directory or files:', error);
        throw error;
    }
}

function renderTemplate(templatePath, data) {
    return ejs.renderFile(templatePath, data);
}

async function generateStaticPages() {
    try {
        const config = await getConfig();
        const posts = await getPosts();
        const pages = [];
        const datesSet = new Set();
        const collection = {};

        posts.forEach((p) => {
            p.metadata.link = 'pages/' + p.metadata.slug + '.html';
            p.content = marked(p.content);
            p.metadata.date = convertDate(p.metadata.date);
            const timestamp = new Date(p.metadata.date);
            const month = timestamp.toLocaleString('en-us', { month: 'long' });
            const year = timestamp.getFullYear();
            const postDate = `${month} ${year}`;

            datesSet.add(postDate);
            if (!collection[postDate]) {
                collection[postDate] = [];
            }
            collection[postDate].push(p);

            pages.push({ template: 'pages/page.ejs', output: p.metadata.link, data: { post: p } });
        });

        const dates = Array.from(datesSet).sort((a, b) => new Date(b) - new Date(a));

        const formattedDates = dates.map((date) => {
            const [month, year] = date.split(' ');
            return {
                text: date,
                metadata: {
                    slug: month.toLowerCase() + '-' + year,
                    link: 'collection/' + month.toLowerCase() + '-' + year + '.html'
                }
            };
        });

        formattedDates.forEach((d) => {
            pages.push({ template: 'collection/collection.ejs', output: d.metadata.link, data: { posts: collection[d.text], dates: formattedDates } });
        });

        pages.push({ template: 'index.ejs', output: 'index.html', data: { posts, dates: formattedDates } });

        for (const page of pages) {
            const templatePath = path.join(__dirname, 'src', page.template);
            const outputPath = path.join(__dirname, 'docs', page.output);
            page.data.core = config;
            const html = await renderTemplate(templatePath, page.data);
            await fs.writeFile(outputPath, html);
            console.log(`Generated: ${outputPath}`);
        }
    } catch (error) {
        console.error('Error generating static pages:', error);
    }
}

function convertDate(date) {
    var timestamp = new Date(date);
    var day = timestamp.toLocaleString('en-us', { weekday: 'long' });
    var month = timestamp.toLocaleString('en-us', { month: 'long' });
    var date = timestamp.getDate();
    var year = timestamp.getFullYear();
    var humanReadableDate = day + ', ' + month + ' ' + date + ', ' + year ;
    return humanReadableDate;
}

generateStaticPages();
