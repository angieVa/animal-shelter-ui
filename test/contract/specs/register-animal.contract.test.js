import { provider } from "./init-pact";
import { AnimalController } from "../../../controllers";
import { Matchers } from "@pact-foundation/pact";

const animal = {
    name: "Jasper",
    breed: "Bicolor",
    gender: "Male",
    vaccinated: false
}

describe('Given An Animal service', () => {
    describe('When a request to add a new animal is made', () => {
        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                state: 'new animal',
                uponReceiving: 'a request to add a new animal',
                withRequest: {
                    method: 'POST',
                    path: '/animals',
                    headers: {
                        'Content-Type': 'application/json',
                      },
                    body: Matchers.like(animal),
                },
                willRespondWith: {
                    status: 201,
                    body: {
                        name: Matchers.string("Jasper"),
                        breed: Matchers.string("Bicolor"),
                        gender: Matchers.string("Male"),
                        vaccinated: Matchers.boolean(true),
                        },
                    headers: {
                        'Content-Type': 'application/json',
                      },
                }
            });
        });

        it("Then it should return the right data", async() =>{

            const response = await AnimalController.register(animal);
            expect(response.data).toMatchSnapshot();

            await provider.verify();
        });

        afterAll(async () => {
            await provider.finalize();
        });
    });
}); 