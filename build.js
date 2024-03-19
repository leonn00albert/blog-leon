const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const fm = require('front-matter');

// Directory containing Markdown files
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
    const pages = [
        { template: 'index.ejs', output: 'index.html', data: {posts} },
    ];

    for (const page of pages) {
        const templatePath = path.join(__dirname, 'src', page.template);
        const outputPath = path.join(__dirname, 'build', page.output);

        // Render template
        const html = await renderTemplate(templatePath, page.data);

        // Write HTML to file
        fs.writeFileSync(outputPath, html);
        console.log(`Generated: ${outputPath}`);
    }
}

// Generate static pages
generateStaticPages().catch(err => console.error(err));
