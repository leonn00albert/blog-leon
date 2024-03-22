# Instructions for Using the Static Website Builder

## Prerequisites

- Node.js installed on your machine ([Download Node.js](https://nodejs.org/))
- Basic knowledge of the command line

## Installation

1. Clone or download this repository to your local machine.

2. Navigate to the root directory of the project in your terminal.

3. Run the following command to install dependencies:

   ```bash
   npm install
   ```

## Usage

### Creating Content

1. Create your Markdown content files (`.md`) inside the `_posts` directory. You can also use the CMS (cmspages)[https://app.pagescms.org/]

2. Each Markdown file should follow the Front Matter format for metadata. For example:

   ```markdown
   ---
   title: Your Post Title
   date: 2024-03-22
   slug: your-post-slug
   ---
   Your Markdown content goes here.
   ```

### Generating Static Pages

1. Make sure your Markdown files are properly set up in the `_posts` directory.

2. Run the following command in your terminal to generate static HTML pages:

   ```bash
   npm run build
   ```

3. Static HTML pages will be generated based on your Markdown files and EJS templates. You can find the generated pages in the `docs` directory.

### Viewing the Website Locally

1. After generating static pages, you can view the website locally by opening the `index.html` file in a web browser.

## Using CMS to Create Content

You can use any Content Management System (CMS) to create and manage your Markdown content files. Follow these steps:

1. Set up your preferred CMS to create Markdown files with Front Matter metadata.

2. Save the generated Markdown files into the `_posts` directory of this project.

3. Follow the steps mentioned above to generate static pages using the static website builder.

## Customization

You can customize the templates and styles of your website by modifying the EJS templates located in the `src` directory. Additionally, you can adjust the CSS styles by modifying the CSS files in the `public/css` directory.

## Conclusion

This static website builder simplifies the process of generating static websites from Markdown content using EJS templates. Feel free to explore and modify the codebase to suit your specific requirements. If you encounter any issues or have questions, don't hesitate to reach out for assistance.
