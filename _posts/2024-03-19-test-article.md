---
published: false
title: PDF download scraper
slug: test
category: coding
description: sadasd
author: asdasd
date: 2024-03-19
---
## Python Web Scraper to Download PDF Files

## Introduction

When choosing a website for this tutorial, we decided to use the Survivor Library (https://www.survivorlibrary.com) as our target. The Survivor Library is a valuable resource that provides a vast collection of survival-related books and documents, covering topics such as wilderness survival, homesteading, self-sufficiency, and more. With its extensive collection of PDF files covering various survival topics, the Survivor Library offers an ideal scenario for practising web scraping techniques. By automating the process of downloading PDF files from specific categories on the Survivor Library website, you can build a valuable tool for collecting and organizing survival-related resources. By the end of this tutorial, you'll have a functional Python script that can scrape PDF files from the Survivor Library based on user-selected categories, demonstrating the power and versatility of web scraping for data collection and automation tasks. Now, let's dive into the implementation details.

In this tutorial, you'll learn how to create a Python web scraper using the `requests` and `BeautifulSoup` libraries to download PDF files from a website. The script will allow users to select a category, navigate to the corresponding page, and download all PDF files associated with that category.

### Step 1: Setup

First, ensure you have Python installed on your system. You'll also need to install the `requests` and `beautifulsoup4` libraries. You can install them using pip:



```bash
pip install requests beautifulsoup4
```

### Step 2: Import Libraries

Create a new Python script and import the necessary libraries:


```python
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
```

### Step 3: Define Helper Functions

Define two helper functions: `download_pdf` to download PDF files and `select_category` to display category options and prompt the user to select one.


```python
# Function to download a PDF file
def download_pdf(url, category):
    # Implementation

# Function to select a category
def select_category(categories):
    # Implementation
```

### Step 4: Send a GET Request and Parse HTML

Send a GET request to the URL of the website, parse the HTML content using BeautifulSoup, and find all category links.



```python
# Send a GET request to the URL
url = "https://www.survivorlibrary.com/index.php/8-category"
response = requests.get(url)

# Parse the HTML content
soup = BeautifulSoup(response.content, 'html.parser')

# Find all category links
category_links = soup.select(".parent a")
```

### Step 5: Extract Category Names

Extract category names from the category links.



```python

# Extract category names from the links
categories = [link.text.strip() for link in category_links]
```

### Step 6: Display Category Selection Menu

Display the category selection menu and prompt the user to select a category.



```python
# Display the category selection menu and get the selected category
selected_category = select_category(categories)
```

### Step 7: Navigate to Selected Category URL

Navigate to the URL of the selected category, find all links starting with "/library", and download PDF files.


```python
# Find the corresponding link for the selected category
selected_category_link = category_links[categories.index(selected_category)]

# Navigate to the URL of the selected category
selected_category_url = urljoin(url, selected_category_link['href'])
selected_category_response = requests.get(selected_category_url)
selected_category_soup = BeautifulSoup(selected_category_response.content, 'html.parser')

# Find all links starting with "/library"
library_links = selected_category_soup.find_all('a', href=lambda href: href and href.startswith("/library"))

# Download and save PDF files
for link in library_links:
    pdf_url = urljoin(selected_category_url, link['href'])
    download_pdf(pdf_url, selected_category)
```

### Step 8: Run the Script

Run the Python script and follow the prompts to select a category. The script will then download PDF files associated with the selected category.

That's it! You've created a Python web scraper to download PDF files