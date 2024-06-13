# ItemCatalogue

This is an application that displays list of items. Depending if authenticated, you can create or delete items.

Features
- Simple login and API key authentication/authorization
- View items for guest users
- Create, update, and delete items for admin users
- Open swagger for api endpoint documentation
- View NX graph for project visualization

### Tech Used
This application uses the following technologies/tools
- Frontend: Angular, Bootstrap, Material
- Backend: C#, .NET
- Monorepo Management: NX
- State management: RxAngular
- Container: Docker

## Start the application

### Frontend
1. Run `npx nx serve item-catalogue` to start the frontend application.

### Backend
1. Make sure the docker is running before running the command `docker run -p 6379:6379 redis`
1. Run `npx nx serve api` to start the backend application

## Build for production

### Frontend

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

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)
