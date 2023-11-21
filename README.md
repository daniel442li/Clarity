# LLM Unit Testing Framework

## Introduction

LLM Unit Testing Framework is an innovative unit testing solution designed for modern software development. Leveraging language learning models (LLMs), it offers intuitive test creation and efficient test execution, ensuring robustness and reliability in software applications.

## Features

- Easy-to-write test cases with LLM integration.
- Automated test generation and evaluation.
- Support for a wide range of programming languages.
- Detailed test execution reports.

## Installation

### Prerequisites

- Node.js and npm
- Docker
- Python 3.x

### Setting up the Environment

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/Clarity.git
   cd Clarity

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Build the Docker Image:**

   ```bash
   docker run --name mongodb -p 55000:27017 -d mongo
    ```

4. **Start the Server:**

   ```bash
   npm run start-test
   ```

5. **Set up venv & Start the agent:**

   ```bash
   python -m venv venv
   source venv/bin/activate
   ``` 

6. **Set up .env**
   Rename env.example to .env and add your OpenAI api key

7. **Start the agent:**

   ```bash
   cd agent
   python agent/main.py
   ``````
