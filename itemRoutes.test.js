process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("./app");
let items = require("./fakeDb");
let pickles = {name:"pickles", price: 3.45};


beforeEach(function(){
    items.push(pickles);
});

afterEach(function() {
    // make sure this *mutates*, not redefines, `cats`
    items.length = 0;
});


describe("GET /items", function() {
    test("Gets a list of items", async function() {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([pickles]);
    });
});

describe("POST /items", function() {
    test("Creates a new item", async function(){
        const resp = await request(app).post(`/items`).send({name: "dog food", price: 19.99});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"added":{name: "dog food", price: 19.99}});});});

    test("Handles invalid item", async function() {
        const resp = await request(app).post(`/items`).send({price: 19.99});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({error: {message: 
            "Name is required", status: 400}});
    })
    test("Handles duplicate item", async function() {
        const resp = await request(app).post('/items').send(pickles);
        expect(resp.statusCode).toBe(403);
        expect(resp.body).toEqual({error: {message: "This item is already on the list", status: 403}})
    })

describe("GET /items/:name", function() {
    test("Returns item details", async function() {
        const resp = await request(app).get('/items/pickles');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(pickles);
    })
    test("Handles when item is not on list", async function() {
        const resp = await request(app).get('/items/cookies');
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({error: {message: "Could not find item - cookies", status: 400}})
    })
})

describe("PATCH /items/:name", function() {
    test("Updates item", async function() {
        const resp = await request(app).patch('/items/pickles').send({name: "pickles", price: 4.29});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated": {name: "pickles", price: 4.29}})
    })
    test("Handles when item is not on the list", async function() {
        const resp = await request(app).patch('/items/missing').send({name: "missing", price: 999});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({error: {message: `Could not find item - missing`, status: 400}})
    })
    test("Handles invalid request object", async function() {
        const resp = await request(app).patch('/items/pickles').send({price: 4});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({error: {message: 'Name is required', status: 400}});
    })
})

describe("DELETE /items/:name", function() {
    test("Deletes item", async function() {
        const resp = await request(app).delete('/items/pickles');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: "Deleted"});
    })
    test("Handles when item is not on list", async function() {
        const resp = await request(app).delete('/items/cookies');
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({error: {message: 'Could not find item - cookies', status: 400}})
    })
})

