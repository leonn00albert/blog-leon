const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const { marked } = require('marked');
const directoryPath = '_posts';

const categories = [
    'Technology',
    'Robotics',
    'Programming',
    'Projects', 
    'Miscellaneous' 
];


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
    const datesSet = new Set();
    const collection = [];

    posts.forEach((p) => {
        p.metadata.link = 'pages/' + p.metadata.slug + '.html';
        p.content = marked(p.content);

        const timestamp = new Date(p.metadata.date);
        const month = timestamp.toLocaleString('en-us', { month: 'long' });
        const year = timestamp.getFullYear();
        const postDate = `${month} ${year}`;
        datesSet.add(postDate);
        if(   collection[postDate]) {
            collection[postDate].push(p);
        }else{
            collection[postDate] = [];
            collection[postDate].push(p);
        }
   

        pages.push({ template: 'pages/page.ejs', output: p.metadata.link, data: { post: p, categories: categories } });
    });

    let dates = Array.from(datesSet);

    dates.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA;
    });

    const formattedDates = dates.map(function(date) {
        const d = {};
        d.text = date;
        d.metadata = {};
        const [month, year] = d.text.split(' ');
        d.metadata.slug = month.toLowerCase() + '-' + year;
        d.metadata.link = 'collection/' + d.metadata.slug + '.html';
        return d;
    });
    
    formattedDates.forEach(d => {
        pages.push({ 
            template: 'collection/collection.ejs', 
            output: d.metadata.link, 
            data: { 
                posts: collection[d.text], 
                categories: categories, 
                dates: formattedDates 
            } 
        });
    });
    
    dates = formattedDates;
   

    pages.push({ template: 'index.ejs', output: 'index.html', data: { posts, categories, dates } });

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
