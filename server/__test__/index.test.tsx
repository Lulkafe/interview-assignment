require('dotenv').config();

import server from "../src";
import { Response } from "supertest";
const request = require('supertest');

afterAll(() => {
    server.close();
})

describe("Server", () => {
    
    it("responses with 200 for the GET request to /", done => {
        request(server)
            .get("/")
            .expect(200)
            .end((err: any, res: Response) => {
                if (err)
                    return done(err);

                done();
            });
    })

    
    it("fetches geographic info of the given city name", done => {
        const cityName = "London";
        const URL = "/api/city/info";
    
        request(server)
            .get(URL)
            .query({ cityName })
            .expect(200)
            .end((err: any, res: Response) => {

                if(err)
                    return done(err);

                expect(Array.isArray(res.body)).toBe(true);
                
                const datum = res.body[0];

                expect("name" in datum).toBe(true);
                expect(datum.name.toLowerCase().includes(cityName.toLowerCase()));
                expect("lat" in datum).toBe(true);
                expect(typeof datum.lat).toBe('number');
                expect("lon" in datum).toBe(true);
                expect(typeof datum.lon).toBe('number');
                
                done();
            })
    })
    

    it("fetches the current weather data with the latitude and lontitude", done => {
        const lat = 51.5073219;
        const lon = -0.1276474;
        const URL = "/api/city/weather";
    
        request(server)
            .get(URL)
            .query({ lat, lon })
            .expect(200)
            .end((err: any, res: Response) => {

                if(err)
                    return done(err);

                const datum = res.body;

                expect("main" in datum).toBe(true);
                expect("weather" in datum).toBe(true);
                done();
            })
    })

    
    it("returns 400 if no query is given to /api/city/weather", done => {
        request(server)
            .get("/api/city/weather")
            .expect(400)
            .end((err: any, res: Response) => {
                if (err)
                    return done(err);

                done();
            });
    })


    it("returns 400 if no query is given to /api/city/info", done => {
        request(server)
            .get("/api/city/info")
            .expect(400)
            .end((err: any, res: Response) => {
                if (err)
                    return done(err);

                done();
            });
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

