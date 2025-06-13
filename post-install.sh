#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Creating required directories for Cuppet..."

# Create directories
mkdir -p jsonFiles
mkdir -p reports
mkdir -p screenshots

# Print success messages
echo -e "${GREEN}✓${NC} Created directory: jsonFiles (for test data storage)"
echo -e "${GREEN}✓${NC} Created directory: reports (for test post-run reports)"
echo -e "${GREEN}✓${NC} Created directory: screenshots (for test failure screenshots)"

echo -e "\n${GREEN}All required directories have been created successfully!${NC}" 