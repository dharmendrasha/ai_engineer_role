#!/bin/bash

# AI-Powered Incident Triage Assistant - Submission Test Script
# This script verifies that all components are working correctly

echo "🚀 Starting Submission Verification..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test Results
TESTS_PASSED=0
TESTS_FAILED=0

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to test if port is open
test_port() {
    nc -z localhost $1 >/dev/null 2>&1
}

echo -e "${BLUE}1. Testing Project Structure...${NC}"
echo "-------------------------------"

# Check if required directories exist
if [ -d "backend" ] && [ -d "frontend" ]; then
    log_success "Project directory structure is correct"
else
    log_error "Missing backend or frontend directories"
fi

# Check for required files
required_files=(
    "README.md"
    "SUBMISSION_GUIDE.md"
    "backend/pom.xml"
    "backend/src/main/java/com/itsm/incident/IncidentTriageApplication.java"
    "frontend/package.json"
    "frontend/src/App.tsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        log_success "Found required file: $file"
    else
        log_error "Missing required file: $file"
    fi
done

echo -e "\n${BLUE}2. Testing Backend Server...${NC}"
echo "----------------------------"

# Check if backend is running on port 8080
if test_port 8080; then
    log_success "Backend server is running on port 8080"
    
    # Test API endpoints
    log_info "Testing API endpoints..."
    
    # Test GET /api/incidents
    if curl -s -f "http://localhost:8080/api/incidents" >/dev/null; then
        log_success "GET /api/incidents endpoint is working"
    else
        log_error "GET /api/incidents endpoint is not responding"
    fi
    
    # Test POST /api/incidents
    response=$(curl -s -w "%{http_code}" -X POST "http://localhost:8080/api/incidents" \
        -H "Content-Type: application/json" \
        -d '{"title":"Test Incident","description":"Test database connection issue","affectedService":"Test Service"}' \
        -o /tmp/test_response.json)
    
    if [ "$response" = "201" ] || [ "$response" = "200" ]; then
        log_success "POST /api/incidents endpoint is working (HTTP $response)"
        
        # Check if AI analysis is working
        if grep -q "aiSeverity" /tmp/test_response.json && grep -q "aiCategory" /tmp/test_response.json; then
            log_success "AI analysis is working (severity and category assigned)"
        else
            log_warning "AI analysis may not be working properly"
        fi
    else
        log_error "POST /api/incidents endpoint failed (HTTP $response)"
    fi
    
    # Test H2 Console
    if curl -s -f "http://localhost:8080/h2-console" >/dev/null; then
        log_success "H2 Database console is accessible"
    else
        log_warning "H2 Database console may not be accessible"
    fi
    
else
    log_error "Backend server is not running on port 8080"
    log_info "To start backend: cd backend && mvn spring-boot:run"
fi

echo -e "\n${BLUE}3. Testing Frontend Application...${NC}"
echo "-----------------------------------"

# Check if frontend is running on port 3000
if test_port 3000; then
    log_success "Frontend server is running on port 3000"
    
    # Test if frontend serves content
    if curl -s -f "http://localhost:3000" >/dev/null; then
        log_success "Frontend application is serving content"
    else
        log_error "Frontend application is not serving content properly"
    fi
    
    # Check if React build artifacts exist
    if [ -f "frontend/build/index.html" ]; then
        log_success "Frontend production build exists"
    else
        log_warning "Frontend production build not found (development mode is fine)"
    fi
    
else
    log_error "Frontend server is not running on port 3000"
    log_info "To start frontend: cd frontend && npm start"
fi

echo -e "\n${BLUE}4. Testing Backend Build...${NC}"
echo "----------------------------"

cd backend
if mvn clean compile -q; then
    log_success "Backend compiles successfully"
else
    log_error "Backend compilation failed"
fi

# Test if target directory has compiled classes
if [ -d "target/classes/com/itsm/incident" ]; then
    log_success "Java classes compiled successfully"
else
    log_error "Java classes not found in target directory"
fi

cd ..

echo -e "\n${BLUE}5. Testing Frontend Build...${NC}"
echo "-----------------------------"

cd frontend
if npm run build >/dev/null 2>&1; then
    log_success "Frontend builds successfully"
    
    if [ -d "build" ] && [ -f "build/index.html" ]; then
        log_success "Frontend production build created"
    else
        log_error "Frontend production build files not found"
    fi
else
    log_error "Frontend build failed"
fi

cd ..

echo -e "\n${BLUE}6. Testing Documentation...${NC}"
echo "----------------------------"

# Check README.md content
if grep -q "AI Code Assistant Usage Log" README.md; then
    log_success "README contains AI usage log section"
else
    log_error "README missing AI usage log section"
fi

if grep -q "Setup Instructions" README.md; then
    log_success "README contains setup instructions"
else
    log_error "README missing setup instructions"
fi

if grep -q "SOLID" README.md; then
    log_success "README discusses SOLID principles"
else
    log_error "README missing SOLID principles discussion"
fi

# Check for required sections
required_sections=(
    "Technology Stack"
    "Database Schema"
    "API Design"
    "Assumptions Made"
    "Potential Improvements"
)

for section in "${required_sections[@]}"; do
    if grep -q "$section" README.md; then
        log_success "README contains '$section' section"
    else
        log_warning "README may be missing '$section' section"
    fi
done

echo -e "\n${BLUE}7. Integration Testing...${NC}"
echo "-------------------------"

if test_port 8080 && test_port 3000; then
    log_info "Testing end-to-end workflow..."
    
    # Create a test incident via API
    test_incident='{"title":"Integration Test","description":"Testing end-to-end workflow with database connectivity issues","affectedService":"Integration Service"}'
    
    response=$(curl -s -X POST "http://localhost:8080/api/incidents" \
        -H "Content-Type: application/json" \
        -d "$test_incident")
    
    if echo "$response" | grep -q '"id"'; then
        incident_id=$(echo "$response" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
        log_success "End-to-end incident creation successful (ID: $incident_id)"
        
        # Verify the incident can be retrieved
        if curl -s "http://localhost:8080/api/incidents/$incident_id" | grep -q "Integration Test"; then
            log_success "End-to-end incident retrieval successful"
        else
            log_error "Cannot retrieve created incident"
        fi
        
    else
        log_error "End-to-end incident creation failed"
    fi
else
    log_warning "Skipping integration tests - servers not running"
fi

echo -e "\n${BLUE}8. Code Quality Checks...${NC}"
echo "-------------------------"

# Check for common Java best practices in backend
if grep -r "@Service\|@Repository\|@Controller" backend/src/ >/dev/null; then
    log_success "Spring annotations are used correctly"
else
    log_warning "Spring annotations may not be used consistently"
fi

if grep -r "private final" backend/src/ >/dev/null; then
    log_success "Dependency injection with final fields is used"
else
    log_warning "May not be using proper dependency injection patterns"
fi

# Check for TypeScript usage in frontend
if grep -q "typescript" frontend/package.json; then
    log_success "TypeScript is configured in frontend"
else
    log_error "TypeScript not found in frontend configuration"
fi

echo -e "\n${BLUE}Summary${NC}"
echo "======="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}All tests passed! Your submission is ready.${NC}"
    exit 0
elif [ $TESTS_FAILED -le 3 ]; then
    echo -e "\n⚠️  ${YELLOW}Most tests passed with minor issues. Review the failed tests.${NC}"
    exit 1
else
    echo -e "\n❌ ${RED}Multiple tests failed. Please address the issues before submission.${NC}"
    exit 1
fi
