import subprocess
import re
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
import os
from dotenv import load_dotenv, find_dotenv
from pyfiglet import figlet_format
from termcolor import colored, cprint
from logs import log
import questionary
from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import TerminalFormatter

load_dotenv(find_dotenv())

def clear(): 
    if os.name == 'nt': 
        _ = os.system('cls') 
    else: 
        _ = os.system('clear') 


def run_tests():
    # Define the path to your shell script
    shell_script = './run_tests.sh'

    # Run the shell script with subprocess.Popen and capture the output
    proc = subprocess.Popen(shell_script, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)

    # Wait for the process to terminate and get the stdout and stderr
    stdout, stderr = proc.communicate()

    # Decode the stdout to string from bytes, if necessary
    output = stdout.decode('utf-8')
    # Use a regular expression to search for the number of passing tests in the output
    match = re.search(r'Number of tests passed: (\d+)', output)

    if match:
        # Extract the number of passing tests
        passing_tests = match.group(1)
        
        
    else:
        # If there is no match, output an error message
        print("Could not extract the number of passing tests.")
        print(f"Error output: {stderr.decode('utf-8')}")

    passing_tests_num = int(passing_tests) if passing_tests else None
    return output, passing_tests_num


llm = ChatOpenAI(temperature=0, model="gpt-4")

template = """
You are a software engineer writing a function to pass some unit tests. Do not redefine the function name or change the parameters.

The file you will be working in is called `user.cjs`. You will write this function in the `user.cjs` file. You will write code that will replace //WRITE YOUR CODE HERE.
{main_file}

Relevant files inside of the code base (tests, additional functions)
{files}


"""

prompt = PromptTemplate(
    input_variables=["main_file", "files"],
    template=template
)

chain = LLMChain(llm=llm, prompt=prompt)
pattern = re.compile(r'```javascript\s*([\s\S]+?)\s*```')

# Reading the entire content of the .cjs file at once
with open('./src/server/api/v1/example_user.cjs', 'r', encoding='utf-8') as file:
    editable_file = file.read()


def generate_oneshot_code(files):
    cprint(figlet_format('Running AI on Codebase', font='digital'), 'magenta')
    supporting_files = ""

    log("Using these files: " + str(files), "info")
    for file_path in files: 
        if file_path == 'No Context':
            continue
        with open(file_path, 'r', encoding='utf-8') as file:
            supporting_files += "\n" + file_path + "\n" + file.read()

    
    log("Sending context to AI", "info")
    result = chain.run(main_file=editable_file, files=files)

    match = pattern.search(result)
    if match:
        log("Code created by AI", "info")
        edited_code = match.group(1)
    else:
        log("Code errored out. Please check logs", "info")

    # Reading the entire content of the .cjs file at once# Specify the path to the file
    file_path = './src/server/api/v1/user.cjs'

    # Check if the file exists and delete it
    if os.path.exists(file_path):
        os.remove(file_path)

    content = editable_file.replace("//WRITE YOUR CODE HERE", edited_code)

    # Now create a new file at the same location
    with open(file_path, 'w') as file:
        file.write(content)
        log(f"Created a new file: {file_path}", "info")

    
    output, passing_tests = run_tests()

    print(output)
    print(passing_tests)

    log(f"Number of tests passed: {passing_tests}", "results")

    while True:
        choice = questionary.select(
        "Additional Actions",
            choices=["Print Testing Output", "Print Generated Code", "Return to Main Menu"],
        ).ask()
        
        if choice == "Print Testing Output":
            print(highlight(output, PythonLexer(), TerminalFormatter()))
        if choice == "Print Generated Code":
            print(highlight(content, PythonLexer(), TerminalFormatter()))

        if choice == "Return to Main Menu":
            clear()
            break


        
    return passing_tests


