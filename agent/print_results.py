import json
from colorama import init, Fore, Style

init()

def print_results(): 
    with open('./agent/results.json', 'r') as json_file:
        result_dict = json.load(json_file)

    sorted_data = sorted(result_dict.items(), key=lambda item: sum(item[1])/len(item[1]) if len(item[1]) > 0 else 0, reverse=True)

    print(Fore.GREEN + f"Scores are based on the average number of tests passed out of 15.")
    # Iterate through each key and print the key and the sum of the associated array
    for key, values in sorted_data:
        average = sum(values) / len(values) if len(values) > 0 else 0
        print(Fore.RED + f"{key}: {average:.2f}")
