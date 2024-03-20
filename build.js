const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const { marked } = require('marked');
const directoryPath = '_posts';

async function getPosts() {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                reject(err);
                return;
            }

            const posts = [];

            files.forEach(file => {
                const filePath = path.join(directoryPath, file);

                if (path.extname(file).toLowerCase() === '.md') {
                    const mdContent = fs.readFileSync(filePath, 'utf8');

                    const { attributes, body } = fm(mdContent);

                    const markdownObject = {
                        metadata: attributes,
                        content: body
                    };
                    posts.push(markdownObject);
                }
            });

            resolve(posts);
        });
    });
}



function renderTemplate(templatePath, data) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}

async function generateStaticPages() {
    const posts = await getPosts();

    const pages = [];

    posts.forEach((p) => {
        p.metadata.link = 'pages/' + p.metadata.slug + '.html';
        p.content = marked(p.content);
        p.metadata.date = convertDate(p.metadata.date)
        pages.push({ template: 'pages/page.ejs', output: p.metadata.link, data: { post: p } })
    });
    pages.push({ template: 'index.ejs', output: 'index.html', data: { posts } });

    for (const page of pages) {
        const templatePath = path.join(__dirname, 'src', page.template);
        const outputPath = path.join(__dirname, 'docs', page.output);

        const html = await renderTemplate(templatePath, page.data);

        fs.writeFileSync(outputPath, html);
        console.log(`Generated: ${outputPath}`);
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

generateStaticPages().catch(err => console.error(err));
