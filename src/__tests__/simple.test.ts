import * as fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";


describe("/test", ()=>{
    let server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;
    beforeAll(() => {});

    beforeEach(async () => {
        server = fastify({});
        //server.register(statusRoutes);
        await server.ready();
    
        jest.clearAllMocks();
      });
      it("Get 200 from server", async done=>{
        const response = await server.inject({ method:"GET", url: "/"});
        expect(response.statusCode).toEqual(200);
      })


      /*

       ==example==
       it("GET returns 200", async done => {
            const response = await server.inject({ method: "GET", url: "/status" });
            expect(response.statusCode).toEqual(200);
            const payload: { date: Date; works: boolean } = JSON.parse(
            response.payload
            );
            expect(payload).toMatchSnapshot({ date: expect.any(String), works: true });

            done();
        });
      
      
      */
})