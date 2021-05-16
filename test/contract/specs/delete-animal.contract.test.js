import { provider } from "./init-pact";
import { AnimalController } from "../../../controllers";
import { Matchers } from "@pact-foundation/pact";

const name = "Jasper";

describe('Given An Animal service', () => {
    describe('When a request to delete an animal is made', () => {
        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                state: 'name animal',
                uponReceiving: 'a request to delete an animal',
                withRequest: {
                    method: 'DELETE',
                    path: `/animals/${name}`,
                },
                willRespondWith: {
                    status: 204,
                }
            });
        });

        it("Then it should return the right status", async() =>{

            const response = await AnimalController.delete(name);
            expect(response.data).toMatchSnapshot();

            await provider.verify();
        });

        afterAll(async () => {
            await provider.finalize();
        });
    });
}); 