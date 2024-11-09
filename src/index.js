import express from "express";

const app = express();
const PORT = process.env.PORT || 7000;


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


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});