from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import TerminalFormatter

# Initialize colorama

# Sample Python code
code = '''import os

def greet(name):
    print(f"Hello, {name}!")

greet('World')'''

# Print with syntax highlighting
print(highlight(code, PythonLexer(), TerminalFormatter()))