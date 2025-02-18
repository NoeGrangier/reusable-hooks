#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Display usage
usage() {
    echo "Usage: $0 [npm_username]"
    echo "  npm_username   : (Optional) NPM username to publish under"
    echo ""
    echo "Examples:"
    echo "  $0         # Publish all packages under @noeg namespace"
    echo "  $0 myuser  # Publish all packages under @myuser namespace"
    exit 1
}

# Check if help is requested
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    usage
fi

NPM_USERNAME=""
if [ "$#" -eq 1 ]; then
    NPM_USERNAME="$1"
    echo -e "${YELLOW}NPM username provided. Will publish packages under @${NPM_USERNAME}${NC}"
else
    echo -e "${YELLOW}No NPM username provided. Will publish packages under @noeg${NC}"
fi

# Main script
echo "Starting publication of all packages..."

# Find all directories starting with "use"
packages=($(find . -maxdepth 1 -type d -name "use*" -exec basename {} \;))

if [ ${#packages[@]} -eq 0 ]; then
    echo -e "${RED}No packages found starting with 'use'${NC}"
    exit 1
fi

echo "Found packages to publish: ${packages[*]}"

# Counter for successful and failed publications
success_count=0
failed_count=0
failed_packages=()

# Loop through each package
for package in "${packages[@]}"; do
    if ./publish-package.sh "$package" "$NPM_USERNAME"; then
        ((success_count++))
    else
        ((failed_count++))
        failed_packages+=("$package")
    fi
done

# Print summary
echo -e "\n${YELLOW}Publication Summary:${NC}"
echo -e "${GREEN}Successfully published: ${success_count} packages${NC}"
if [ $failed_count -gt 0 ]; then
    echo -e "${RED}Failed to publish: ${failed_count} packages${NC}"
    echo -e "${RED}Failed packages: ${failed_packages[*]}${NC}"
    exit 1
fi

echo -e "${GREEN}All packages published successfully!${NC}" 
