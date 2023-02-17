const request = require("supertest");
import app from "../index";

describe("POST", () => {
  test("POST /api/users/signup", (done) => {
    request(app)
      .post("/api/users/signup")
      .expect("Content-Type", /json/)
      .expect(200)
      .send({
        email: "asd@gmail.com",
        password: "A2dsa!3",
      });
  });
});
