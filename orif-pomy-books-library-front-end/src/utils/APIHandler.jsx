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
    this.authId = null;
  }

  async fetchAPI(options = {}) {
    try {
      if (window.sessionStorage.getItem("auth_token")) this.authId = window.sessionStorage.getItem("auth_token");

      options.headers = { "Content-Type": "application/json", "auth_token": this.authId || "" };
      const res = await fetch(this.url, options);

      if (res.status === 500)
        throw new Error("There was an unexpected error on the server");

      const body = await res.json();

      if (body.status === "fail") throw new Error(body.message);

      // session storage management only runs when body contains an auth field
      // we need the name to display on Navbar

      if (body.auth) { 
        window.sessionStorage.setItem("auth_token", body.auth.authToken) 
        window.sessionStorage.setItem("name", body.auth.name)
      }

      console.log(`@${options.method}@ from ${this.url}: ${body.status}`);
      if (body.message) console.log(body.message);

      return body;
    } catch (error) {
      throw error;
    }
  }

  resetUrl() {
    this.url = this.staticUrl; // reset any changes to the URL on every new request
  }

  get(params, id) {
    this.resetUrl();  

    if (id) this.url = new URL(id, `${this.url}/`);
    if (params.size > 0) this.url = new URL(`${this.url}?${params.toString()}`);

    return this.fetchAPI({ method: "GET" });
  }

  post(body) {
    this.resetUrl();

    if (!body) throw new Error("API post requires a body");

    return this.fetchAPI({
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  patch(body, id) {
    this.resetUrl();

    if (!id) throw new Error("API patch requires an id");
    if (!body) throw new Error("API patch requires a body");

    this.url = new URL(id, `${this.url}/`);

    return this.fetchAPI({
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete(id) {
    this.resetUrl();

    if (!id) throw new Error("API delete requires an id");

    this.url = new URL(id, `${this.url}/`);

    return this.fetchAPI({ method: "DELETE" });
  }
}
