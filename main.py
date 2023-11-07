from colorama import init, Fore, Back, Style
from termcolor import colored, cprint
import os
from pyfiglet import figlet_format
from datetime import datetime, date, timedelta, timezone
from run_agents import generate_oneshot_code
import questionary

from prompt_toolkit.styles import Style

custom_style_fancy = Style([
    ('qmark', 'fg:#e770ff bold'),       # token in front of the question
    ('question', 'bold'),               # question text
    ('answer', 'fg:#e770ff bold'),      # submitted answer text behind the question
    ('pointer', 'fg:#e770ff bold'),     # pointer used in select and checkbox prompts
    ('highlighted', 'fg:#e770ff bold'), # pointed-at choice in select and checkbox prompts
    ('selected', 'fg:#e770ff'),         # style for a selected item of a checkbox
    ('separator', 'fg:#e770ff'),        # separator in lists
    ('instruction', ''),                # user instructions for select, rawselect, checkbox
    ('text', ''),                       # plain text
    ('disabled', 'fg:#e770ff italic')   # disabled choices for select and checkbox prompts
])  

def clear(): 
    if os.name == 'nt': 
        _ = os.system('cls') 
    else: 
        _ = os.system('clear') 

results = {}

# List to store the paths of the files
file_paths = []
blacklist_path = os.path.normpath('./src/server/api/v1/')
# Walk through the directory
for root, dirs, files in os.walk('./src'):
    for file in files:
        if os.path.normpath(root).startswith(blacklist_path):
            continue 

        # Construct the file path
        path = os.path.join(root, file)
        file_paths.append(path)

# Walk through the directory
for root, dirs, files in os.walk('./test'):
    for file in files:
        
        # Construct the file path
        path = os.path.join(root, file)
        file_paths.append(path)

file_paths.append('No Context')
file_paths.append('Return to Select Screen')

if __name__ == "__main__": 
    while True:
        cprint(figlet_format('Clarity', font='slant'), 'magenta', attrs=['bold'])
        menu = questionary.select(
        "Main Menu", style = custom_style_fancy,
        choices=[
            'Run Context Tasks',
            'View Results'
        ]).ask()

        if menu == 'Run Context Tasks':
            
            output = questionary.checkbox(
                "Change Output:", style = custom_style_fancy,
                choices=file_paths).ask()
            
            if 'Return to Select Screen' in output or output == []:
                continue
            else:
                if 'No Context' in output:
                    output = ['No Context']
                print(output)
                
                clear()
                generate_oneshot_code(output)
                
                # time.sleep(3) 
            
        if menu == 'View Results':
            pass