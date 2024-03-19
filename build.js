const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Function to render EJS template to HTML
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
    const pages = [
        { template: 'index.ejs', output: 'index.html', data: { /* Add data if needed */ } },
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
