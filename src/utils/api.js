import axios from "axios";

class Api {
  constructor() {
    this._url = "https://pokeapi.co/api/v2";
  }

  get = (url) => this.request(url, "GET");

  async request(url, method, data, config) {
    try {
      const response = await axios({
        method,
        url: encodeURI(`${this._url}/${url}`),
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }
}

export default new Api();
