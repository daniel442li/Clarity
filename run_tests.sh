#!/bin/bash
# Filename: run_tests.sh

TEST_FILE="./test/api/user.cjs"

# Run the tests and capture the output
output=$(npx mocha $TEST_FILE)

# Use grep to find the line containing "passing" and then use awk to print the first part before "passing"
passing_tests=$(echo "$output" | grep "passing" | awk '{print $1}')

# Print the tested file
echo "Tested file: $TEST_FILE"

# print out the full output
echo "$output"

# Print the number of passing tests
echo "Number of tests passed: $passing_tests"

