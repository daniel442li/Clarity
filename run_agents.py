import subprocess
import re
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

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
        print(f"Number of tests passed: {passing_tests}")
        
    else:
        # If there is no match, output an error message
        print("Could not extract the number of passing tests.")
        print(f"Error output: {stderr.decode('utf-8')}")

    passing_tests_num = int(passing_tests) if passing_tests else None
    return passing_tests_num


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
    result = chain.run(main_file=editable_file, files=files)

    match = pattern.search(result)
    if match:
        edited_code = match.group(1)
    else:
        print("No JavaScript code block found.")

    # Reading the entire content of the .cjs file at once# Specify the path to the file
    file_path = './src/server/api/v1/user.cjs'

    # Check if the file exists and delete it
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Deleted the file: {file_path}")
    else:
        print(f"The file does not exist: {file_path}")

    content = editable_file.replace("//WRITE YOUR CODE HERE", edited_code)

    print(content)
    # Now create a new file at the same location
    with open(file_path, 'w') as file:
        file.write(content)
        print(f"Created a new file: {file_path}")


    passing_tests = run_tests()

    return passing_tests

print("No supporting files")
generate_oneshot_code("", "")


# print("Using test files")
# supporting_files = ""
# with open('./test/api/user.cjs', 'r', encoding='utf-8') as file:
#     test_file = file.read()

# supporting_files += "\n" + "test/api/user.cjs" + "\n" + test_file
# generate_code(supporting_files, test_file)


# print("Using validation files")
# with open('./src/shared/validation.js', 'r', encoding='utf-8') as file:
#     shared_validation = file.read()

# supporting_files += ("\n" + "src/shared/validation.js" + "\n" + shared_validation)
# generate_code(supporting_files, test_file)
