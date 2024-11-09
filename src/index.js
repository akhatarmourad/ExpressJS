import express from "express";

const app = express();
const PORT = process.env.PORT || 7000;

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


// * Create Routes
app.get('/', (request, response) => {
    response.status(201).send({message: "Hello World from Express JS!"});
});

app.get('/api/v1/courses', (req, res) => {
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


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});