# Workspace Packages
```mermaid
graph
	API
	DB
	Playwright
	Router
	Schemas
	SDK
	Web

	Web --> SDK
	Web --> Router
	SDK --> Schemas
	Playwright --> API
	Playwright --> Web
	API --> Schemas
	API --> Router
	API --> DB
```

# Direct Dependencies
- Omitting `@types/*` packages, as they do not add any functionality.
- Omitting `typescript` package, as everything would depend on it.
- Uses dashed lines for `devDependencies`.
```mermaid
graph
	trace-api
	trace-db
	trace-playwright
	trace-router
	trace-schemas
	trace-sdk
	trace-web

	trace-api --> zod
	trace-api --> trace-schemas
	trace-api --> trace-router
	trace-api --> trace-db
	trace-api --> jose

	trace-playwright --> dotenv
	trace-playwright --> trace-api
	trace-playwright --> trace-web
	trace-playwright --> playwright["@playwright/test"]

	trace-schemas --> zod

	trace-sdk -.-> trace-api
	trace-sdk --> trace-schemas

	trace-web --> jose
	trace-web --> oidc-client-ts
	trace-web --> react
	trace-web --> react-dom
	trace-web --> trace-sdk
    trace-web --> trace-router
    trace-web -.-> happy-dom["@happy-dom/global-registrator"]
    trace-web -.-> testing-library-jest-dom["@testing-library/jest-dom"]
    trace-web -.-> testing-library-react["@testing-library/react"]
```
