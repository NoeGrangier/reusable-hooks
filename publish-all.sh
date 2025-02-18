#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to publish a package
publish_package() {
    local package_dir=$1
    echo -e "\n${YELLOW}Publishing ${package_dir}...${NC}"
    
    # Navigate to package directory
    cd "$package_dir" || exit 1
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install || { echo -e "${RED}Failed to install dependencies for ${package_dir}${NC}"; return 1; }
    
    # Build the package
    echo "Building package..."
    npm run build || { echo -e "${RED}Failed to build ${package_dir}${NC}"; return 1; }
    
    # Publish the package
    echo "Publishing to npm..."
    npm publish --access public || { echo -e "${RED}Failed to publish ${package_dir}${NC}"; return 1; }
    
    echo -e "${GREEN}Successfully published ${package_dir}${NC}"
    
    # Return to root directory
    cd ..
    return 0
}

# Main script
echo "Starting publication of all packages..."

# Array of package directories
packages=(
    "useDebounce"
    "useLocalStorage"
    "useOnScreen"
    "usePolling"
    "useScrollable"
    "useTheme"
)

# Counter for successful and failed publications
success_count=0
failed_count=0
failed_packages=()

# Loop through each package
for package in "${packages[@]}"; do
    if publish_package "$package"; then
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
