//
//  Simple-ish handler for API fetching
//  -> create a handler for a route:
//  const routeHandler = new APIHandler(route);
//  on books, collaborators, loans
//
//  .get() with optional id and params
//  .patch() requires an id and a body  (findByIdAndUpdate)
//  .post() requires a body
//  .delete() requires an id            (findByIdAndDelete)
//

//
//  the current auth system sends the logged in user id inside the request body
//  this must be set to the instance via .setAuth();
//  this is a temporary fix to try out authorizing routes
//  request bodies cannot be sent on GET requests
//  so it's currently impossible to authorize for a GET route.
//

export default class APIHandler {
  constructor(url) {
    this.staticUrl = new URL(
      url,
      "https://orif-pomy-books-library.vercel.app/api/v1/"
    );
    this.url = this.staticUrl;
  }

  async fetchAPI(options = {}) {
    try {
      const res = await fetch(this.url, options);

      if (res.status === 500)
        throw new Error("There was an unexpected error on the server");

      const body = await res.json();

      if (body.status === "fail") throw new Error(body.message);

      console.log(`@${options.method}@ from ${this.url}: ${body.status}`);
      if (body.message) console.log(body.message);

      return body;
    } catch (error) {
      throw error;
    }
  }

  setAuth(id) {
    this.authId = id;
  }

  resetUrl() {
    this.url = this.staticUrl; // reset any changes to the URL on every new request
  }

  get(params, id) {
    this.resetUrl();  

    if (id) this.url = new URL(id, `${this.url}/`);
    if (params.size > 0) this.url = new URL(`${this.url}?${params.toString()}`);

    return this.fetchAPI({
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  post(body) {
    this.resetUrl();
    const reqBody = body;

    if (!body) throw new Error("API post requires a body");
    if (this.authId) reqBody.id = this.authId;

    return this.fetchAPI({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });
  }

  patch(body, id) {
    this.resetUrl();
    const reqBody = body;

    if (!id) throw new Error("API patch requires an id");
    if (!body) throw new Error("API patch requires a body");
    if (this.authId) reqBody.id = this.authId;

    this.url = new URL(id, `${this.url}/`);

    return this.fetchAPI({
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });
  }

  delete(id) {
    this.resetUrl();
    const reqBody = {};

    if (!id) throw new Error("API delete requires an id");
    if (this.authId) reqBody.id = this.authId;

    this.url = new URL(id, `${this.url}/`);

    return this.fetchAPI({
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });
  }
}
