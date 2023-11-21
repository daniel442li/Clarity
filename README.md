# LLM Unit Testing Framework

## Introduction

Real world software code generation w/ unit tests

# To-Do

Run tests on the cloud without need for docker files, etc. 
Make more unit tests + code scenarios

## Installation

### Prerequisites

- Node.js and npm
- Docker
- Python 3.11

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
   python3.11 -m venv venv
   source venv/bin/activate
   ``` 

6. **Set up .env**

   ```bash
   Rename env.example to .env and add your OpenAI api key
   ```bash
   
8. **Start the agent:**

   ```bash
   cd agent
   python agent/main.py
   ``````
