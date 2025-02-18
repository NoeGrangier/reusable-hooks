#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Display usage
usage() {
    echo "Usage: $0 <package_dir> [npm_username]"
    echo "  package_dir    : Directory of the package to publish"
    echo "  npm_username   : (Optional) NPM username to publish under"
    echo ""
    echo "Examples:"
    echo "  $0 useDebounce         # Publish under @noeg namespace"
    echo "  $0 useDebounce myuser  # Publish under @myuser namespace"
    exit 1
}

# Check if package directory is provided
if [ "$#" -lt 1 ]; then
    echo -e "${RED}Error: Package directory is required${NC}"
    usage
fi

PACKAGE_DIR="$1"
NPM_USERNAME=""

# Check if username is provided as second argument
if [ "$#" -eq 2 ]; then
    NPM_USERNAME="$2"
    echo -e "${YELLOW}NPM username provided. Will publish package under @${NPM_USERNAME}${NC}"
else
    echo -e "${YELLOW}No NPM username provided. Will publish package under @noeg${NC}"
fi

# Function to modify package.json, README.md and source files
modify_package_files() {
    local package_dir=$1
    local username=$2
    local action=$3  # 'replace' or 'restore'
    
    # If no username provided, skip modification
    if [ -z "$username" ]; then
        return 0
    fi
    
    local package_json="${package_dir}/package.json"
    local readme="${package_dir}/README.md"
    
    if [ ! -f "$package_json" ]; then
        echo -e "${RED}package.json not found in ${package_dir}${NC}"
        return 1
    fi
    
    if [ "$action" = "replace" ]; then
        # Save original content for later restoration
        cp "$package_json" "${package_json}.backup"
        if [ -f "$readme" ]; then
            cp "$readme" "${readme}.backup"
        fi
        
        # Create a list of files to modify
        local source_files=()
        # Find all TypeScript and JavaScript files in src and tests directories
        if [ -d "${package_dir}/src" ]; then
            while IFS= read -r file; do
                source_files+=("$file")
                cp "$file" "${file}.backup"
            done < <(find "${package_dir}/src" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \))
        fi
        if [ -d "${package_dir}/tests" ]; then
            while IFS= read -r file; do
                source_files+=("$file")
                cp "$file" "${file}.backup"
            done < <(find "${package_dir}/tests" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \))
        fi
        
        # Replace @noeg/ with @username/ in package.json
        sed -i '' "s/@noeg\//@${username}\//g" "$package_json"
        
        # Increment patch version when publishing under different username
        if [ -n "$username" ]; then
            # Extract current version
            local version=$(node -p "require('./package.json').version")
            # Increment patch version
            local new_version=$(echo "$version" | awk -F. '{$NF = $NF + 1;} 1' OFS=.)
            # Update version in package.json
            sed -i '' "s/\"version\": \"${version}\"/\"version\": \"${new_version}\"/g" "$package_json"
            echo -e "${YELLOW}Incrementing version from ${version} to ${new_version}${NC}"
        fi
        
        # Replace @noeg/ with @username/ in README.md if it exists
        if [ -f "$readme" ]; then
            sed -i '' "s/@noeg\//@${username}\//g" "$readme"
            # Also replace installation instructions
            sed -i '' "s/npm install @noeg\//npm install @${username}\//g" "$readme"
            sed -i '' "s/yarn add @noeg\//yarn add @${username}\//g" "$readme"
        fi
        
        # Replace @noeg/ with @username/ in all source files
        for file in "${source_files[@]}"; do
            if [ -f "$file" ]; then
                echo "Updating imports in $file"
                sed -i '' "s/@noeg\//@${username}\//g" "$file"
                # Also handle require statements
                sed -i '' "s/require('@noeg\//require('@${username}\//g" "$file"
            fi
        done
        
    elif [ "$action" = "restore" ]; then
        # Restore from backup
        if [ -f "${package_json}.backup" ]; then
            mv "${package_json}.backup" "$package_json"
        fi
        if [ -f "${readme}.backup" ]; then
            mv "${readme}.backup" "$readme"
        fi
        
        # Restore all source files from backup
        while IFS= read -r backup_file; do
            original_file="${backup_file%.backup}"
            if [ -f "$backup_file" ]; then
                mv "$backup_file" "$original_file"
            fi
        done < <(find "$package_dir" -type f -name "*.backup")
    fi
}

# Check if package directory exists
if [ ! -d "$PACKAGE_DIR" ]; then
    echo -e "${RED}Error: Package directory '${PACKAGE_DIR}' not found${NC}"
    exit 1
fi

# Get absolute path of the workspace root
WORKSPACE_ROOT=$(pwd)

# Navigate to package directory
cd "$PACKAGE_DIR" || exit 1

echo -e "\n${YELLOW}Publishing ${PACKAGE_DIR}...${NC}"

# Modify package files with new username
modify_package_files "." "$NPM_USERNAME" "replace"

# Install dependencies
echo "Installing dependencies..."
npm install || { 
    modify_package_files "." "$NPM_USERNAME" "restore"
    echo -e "${RED}Failed to install dependencies for ${PACKAGE_DIR}${NC}"
    cd "$WORKSPACE_ROOT"
    exit 1
}

# Build the package
echo "Building package..."
npm run build || { 
    modify_package_files "." "$NPM_USERNAME" "restore"
    echo -e "${RED}Failed to build ${PACKAGE_DIR}${NC}"
    cd "$WORKSPACE_ROOT"
    exit 1
}

# Publish the package
echo "Publishing to npm..."
npm publish --access public || { 
    modify_package_files "." "$NPM_USERNAME" "restore"
    echo -e "${RED}Failed to publish ${PACKAGE_DIR}${NC}"
    cd "$WORKSPACE_ROOT"
    exit 1
}

# Restore original package files
modify_package_files "." "$NPM_USERNAME" "restore"

echo -e "${GREEN}Successfully published ${PACKAGE_DIR}${NC}"

# Return to workspace root
cd "$WORKSPACE_ROOT" 
