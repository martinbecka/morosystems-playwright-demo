# MoroSystems Playwright Demo

Playwright-based automated testing project for the MoroSystems Todo API and web application.

## Setup & Run

```bash
# Clone the repository
git clone https://github.com/martinbecka/morosystems-playwright-demo.git
cd morosystems-playwright-demo

# Install dependencies
npm ci
npx playwright install

# Build and start the backend
docker build -f docker/Dockerfile.backend -t backend .
docker run -d --rm --name todo-backend -p 8080:8080 backend

# Generate OpenAPI client
npm run generate:openapi

# Run tests and show the report
npx playwright test
npx playwright show-report

# Stop the backend
docker stop todo-backend
```

## Dependencies

- Node.js 24+
- Docker Desktop
- Git

> The project is cross-platform and has been tested on Windows 10 and Ubuntu.

## Project Structure

```text
morosystems-playwright-demo/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── docker/
│   └── Dockerfile.backend      # Todo app Docker image
├── fixtures/
│   └── tasks.fixture.ts
├── pages/
│   └── career/
│       └── ...
├── tests/
│   ├── gui/
│   │   └── ...
│   └── rest/
│       └── ...
├── snapshots/                  # Visual testing screenshots
│   ├── linux/
│   └── win32/
├── openapi/                    # Generated, gitignored
├── .gitignore
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md

---

## Test Cases

### Test Case Steps: GUI Testing

- [x] 1. Open the Browser: Launch a browser instance.
- [ ] 2. Navigate to Google: Go to Google search page.
- [ ] 3. Search for "MoroSystems": Type "MoroSystems" into the Google search bar and submit the search.
- [ ] 4. Display Search Results: Validate that the search results page is displayed.
- [ ] 5. Navigate to MoroSystems Website: Click on the link to the MoroSystems website.
- [x] 6. Visit the "Kariéra" Page: Navigate to the "Kariéra" page on the MoroSystems domain.
- [x] 7. Filter Available Positions Results: Select your preferred city as a filtering criterion from the select box and validate the results.

### Test Case Steps: API Testing

- [x] 1. Start Backend Application: Checkout and install and run our Backend application. Instructions can be found here: GitHub - morosystems/todo-be: Simple backend for todo app.
- [x] 2. Retrieve Task List: Send a GET request to your API endpoint that retrieves a list of tasks.
- [x] 3. Create New Task: Send a POST request to your API endpoint to create a new task.
- [x] 4. Update Task Information: Send a PUT request to update an existing task's information.
- [x] 5. Delete Task: Send a DELETE request to remove a task.

### Complexity Additions:

- [ ] 1. Validate Search Results Content: Ensure that the link to the MoroSystems website is present in the search results.
- [x] 2. Validate API Responses: Ensure that correct data and response statuses are sent by the API.
- [x] 3. Cross-Browser Testing: Ensure that all tests run seamlessly across Chrome, Firefox, and Edge or Safari.
- [x] 4. Responsive Design Check: Validate that the MoroSystems website and "Kariéra" page display correctly on different screen resolutions.
- [x] 5. Reporting: Generate a detailed test report that includes pass/fail status, screenshots on failure, and logs.

### Optional Challenges:

- [x] 1. Parallel Execution: Configure the tests for parallel execution to improve efficiency.
- [x] 2. Visual Testing: Implement visual testing to compare the current state of the website with a baseline image.
- [x] 3. OpenAPI/Swagger codegen: Generate API connector with OpenAPI/Swagger codegen.
- [x] 4. CI/CD Pipeline Integration: Integrate your tests into a CI/CD pipeline using a tool like GitHub Actions, Jenkins, or another CI tool.
