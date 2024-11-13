import express from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createProjectValidationSchema } from "./utils/validationSchema.mjs";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 7000;


// * Middleware functions
const loginMiddleware = (request, response, next) => {
    console.log(`Method : ${request.method} | URL : ${request.url}`);
    next();
}

const logoutMiddleware = (request, response, next) => {
    console.log(`Specific Middleware | Method : ${request.method} | URL : ${request.url}`);
    next();
}

const customMiddleware = (request, response, next) => {
    console.log(`Custom Middleware`);
}


// * Use that middleware globally
app.use(loginMiddleware);

// * Use that middlewareS only for that specific route
app.use('/api/v1/logout', logoutMiddleware, customMiddleware);

// * Middleware to handle Project Index
const handleProjectIndexById = (request, response, next) => {
    const { params: { id } } = request;
    const parsedId = parseInt(id);

    if(isNaN(parsedId)) return response.status(400).send({error: "Bad Request !"});
    else {
        const getProjectIndex = projectsMockData.findIndex(project => project.id === parsedId);
        if(getProjectIndex === - 1) return response.status(400).send({message: "No Project Found !"});
        else {
            request.projectIndex = getProjectIndex;
            next();
        }
    }
}

// * Mock users data
const mockUsersData = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        age: 30,
        address: "123 Main St, Anytown, USA",
        phone: "555-123-4567",
        isActive: true,
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
        id: 2,
        name: "Jane Doe",
        email: "jane@example.com",
        age: 25,
        address: "456 Elm St, Anytown, USA",
        phone: "555-456-7890",
        isActive: false,
        createdAt: "2023-01-02T00:00:00.000Z",
        updatedAt: "2023-01-02T00:00:00.000Z",
    },
    {
        id: 3,
        name: "Bob Smith",
        email: "bob@example.com",
        age: 40,
        address: "789 Oak St, Anytown, USA",
        phone: "555-789-1234",
        isActive: true,
        createdAt: "2023-01-03T00:00:00.000Z",
        updatedAt: "2023-01-03T00:00:00.000Z",
    },
];

// * Mock projects data
let projectsMockData = [
    {
        id: 1,
        title: "Driving React Native App",
        category: "Mobile App",
        date: "2024"
    },
    {
        id: 2,
        title: "Building a Web App",
        category: "Web App",
        date: "2023"
    },
    {
        id: 3,
        title: "DevOps GitLab CI/CD",
        category: "DevOps", 
        date: "2023"
    },
    {
        id: 4,
        title: "Data Pipeline",
        category: "Data",
        date: "2021"
    },
    {
        id: 5,
        title: "AI Chatbot",
        category: "AI",
        date: "2022"
    }
];

// * Create Routes
app.get('/', loginMiddleware, (request, response) => {
    response.status(201).send({message: "Hello World from Express JS!"});
});

app.get('/api/v1/courses', query("filter").isString().notEmpty().isLength({min: 4, max: 10}).withMessage(''), (request, res) => {
    const result = validationResult(request);
    console.log(result);

    res.status(200).send([
        {
            title: "NoSQL with MongoDB",
            duration: 3.2,
            price: 129.99,
            lastUpdate: 2023
        },
        {
            title: "APIs with GraphQL",
            duration: 2.6,
            price: 89,
            lastUpdate: 2024,
        }
    ]);
});

// * Query Parameters
app.get('/api/v1/users/:id', (request, response) => {
    console.log(request.params);
    const { id } = request.params;
    const parsedId = parseInt(id);

    if(isNaN(parsedId)) {
        response.status(400).send({error: "Bad request, invalid Parameters !"});
    }
    else {
        const getUser = mockUsersData.find(user => user.id === parsedId);
        if(!getUser) response.status(400).send({message: "User not found !"});
        response.status(200).send({user: getUser});
    }
});


// * Query Strings (for filetring + additional infos about data)
app.get('/api/v1/projects', (request, response) => {
    console.log(request.query);
    const { query: { category, date } } = request;

    if(!category && !date) response.send({projects: projectsMockData});
    else if(category && date) {
        const getProjects = projectsMockData.filter(project => project.category === category || project.date === date);

        if(!getProjects.length) response.status(400).send({message: "No projects found !"});
        else response.status(200).send({projects: getProjects});
    }
    else {
        response.send({projects: projectsMockData});
    }
});

// * POST request : Create new resource on server
app.post('/api/v1/projects', [
        body("title").notEmpty().withMessage("Should not be mepty")
        .isLength({min: 8, max: 16}).withMessage("length between 8 & 16")
        .isString().withMessage("Should be a string"),

        body("category").notEmpty().withMessage("Required")
        .isString().withMessage("Should be text")
        .isLength({min: 5, max: 16}).withMessage("5 < length < 16") 
    ],
        (request, response) => {

    const result = validationResult(request);
    console.log(result);

    const validData = matchedData(request);
    console.log(validData);

    if(!result.isEmpty()) {
        return response.status(400).send({errors: result.array()});
    }
    else {
        const { body } = request;
        const id = projectsMockData[projectsMockData.length - 1].id + 1;

        const newProject = {id: id, ...validData};
        projectsMockData.push(newProject);

        response.status(201).send({message: "POST request received !", data: newProject});
    }
});

// * PUT request : Completely replacing a resource with a new one
app.put('/api/v1/projects/:id', checkSchema(createProjectValidationSchema), handleProjectIndexById, (request, response) => {
    const { body, params: { id }, projectIndex } = request;
    const parsedId = parseInt(id);

    projectsMockData[projectIndex] = {id: parsedId, ...body};
    return response.status(200).send({data: projectsMockData[projectIndex]});
});

// * PATCH Request : Partially updating a resource, modifying only specified fields
app.patch('/api/v1/projects/:id', (request, response) => {
    const { body, params: { id } } = request;
    const parsedId = parseInt(id);

    if(isNaN(parsedId)) return response.status(400).send({error: "Bad Request !"});
    else {
        const getProjectIndex = projectsMockData.findIndex(project => project.id === parsedId);
        if(getProjectIndex === - 1) return response.status(400).send({message: "No Project Found !"});
        else {
            projectsMockData[getProjectIndex] = { ...projectsMockData[getProjectIndex], ...body };
            return response.status(200).send({data: projectsMockData[getProjectIndex]});
        }
    }
});

// * DELETE Request : Deleting a resource
app.delete('/api/v1/projects/:id', (request, response) => {
    const { params: { id } } = request;
    const parsedId = parseInt(id);

    if(isNaN(parsedId)) return response.status(400).send({error: "Bad Request !"});
    else {
        const getProject = projectsMockData.find(project => project.id === parsedId);
        if(!getProject) return response.status(400).sedn({message: "Project not found !"});
        else {
            projectsMockData = projectsMockData.filter(project => project.id !== parsedId);
            return response.status(200).send({data: getProject});
        }
    }
});


// * Express Server Listening on Local Host
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});