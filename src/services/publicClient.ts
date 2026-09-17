import ApiClient from "./ApiClient";

class PublicClient extends ApiClient {
  constructor() {
    super("http://abc.com", { withAuth: false  });  // ✅ No Auth Required
  }

  getPublicData() {
    return this.get("/public-data");
  }
}

export default new PublicClient();
