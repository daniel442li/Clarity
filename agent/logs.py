import datetime
from colorama import init
from termcolor import colored

# Initialize Colorama
init()

# Define log level colors
LOG_COLORS = {
    'info': 'magenta',
    'warning': 'yellow',
    'error': 'red',
    'critical': 'red',
    'results': 'blue',
    # You can add more categories here
}

# Function to print log messages with color, timestamp, and separators
def log(message, level='info'):
    # Get the current timestamp
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Determine the color based on the log level
    color = LOG_COLORS.get(level, 'white')

    # Construct the log entry
    log_entry = f"[{timestamp}] [{level.upper()}] - {message}"
    
    # Color the log entry and separator
    colored_log_entry = colored(log_entry, color)
    separator = '-' * (len(log_entry) + 10)  # Additional length for color codes

    # Print the colored log entry with a separator line
    print(colored_log_entry)
    print(colored(separator, color))

