for dir in use*/; do (cd "$dir" && npm test -- --watchAll=false); done
