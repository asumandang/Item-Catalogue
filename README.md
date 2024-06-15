# Item Catalogue

This is an application that displays list of items. Depending if authenticated, you can create or delete items.

## Table of Contents

- [Features](#features)
- [Tech Used](#tech-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Visualization](#project-visualization)

## Features

- Simple login and API key authentication/authorization
- View items for guest users
- Create, update, and delete items for admin users
- Open swagger for api endpoint documentation
- View NX graph for project visualization

## Tech Used

This application uses the following technologies/tools

- Frontend: Angular, Bootstrap, Material
- Backend: C#, .NET
- Monorepo Management: NX
- State management: RxAngular
- Containerization: Docker

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js and npm
- Docker
- .NET SDK

### Installation

1. Clone the repository:

```bash
git clone https://github.com/asumandang/itemcatalogue.git
```

2. Install the monorepo dependencies

```bash
npm install
```

## Running the application

Before starting the application, make sure you have the [prerequisites](#prerequisites) in your machine followed the [installation](#installation) process in the README.md

### Web Application

1. Run `npx nx serve item-catalogue` to start the frontend application.

### API Server

1. Make sure the docker is running before running the command `docker run -p 6379:6379 redis` to start your redis server.
1. Add the following environmental variables. Ask one of the developers for the values.

```bash
export IMGUR_CLIENT_ID=<imgur-client-id> # client ID for uploading images
export API_KEY=<api-key> # client ID for uploading images
```

1. Run `npx nx serve api` to start the backend application.
- This runs the api in port

## Build for production

### Web Application

Run `npx nx build item-catalogue` to build the application. The build artifacts are stored in the output directory (`dist/`), ready to be deployed.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## API Documentation

Access the Swagger UI for detailed API documentation (make sure your [api server is running](#running-the-application)):

```bash
http://localhost:5000/swagger
```

## Project Visualization

Run below command to show the graph of the workspace.
It will show tasks that you can run with Nx.

```bash
npx nx graph
```

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)
