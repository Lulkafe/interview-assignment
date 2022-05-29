require('dotenv').config();

import { Response } from "express";
import server from "../src";
const request = require('supertest');

afterAll(() => {
    server.close();
})

describe("Server", () => {
    
    it("responses with 200 for the GET request to /", async () => {
        const res: Response = await request(server).get("/");
        expect(res.status).toBe(200);
    })


    it("returns 400 if no query is given to /api/city/weather", async () => {
        const res: Response = await request(server).get("/api/city/weather");
        expect(res.status).toBe(400);
    })

    it("returns 400 if no query is given", async () => {
        const res: Response = await request(server).get("/api/city/info");
        expect(res.status).toBe(400);
    })

});



    /*
    test("2", done => {
         Request(server).get(`${BASE_URL}/`)
            .expect(200)
            .end((err, res) => {
                expect(err).toBe(null);
                done();
            });
    })

    
    
    */

