import axios from "axios";

const instance = axios.create();

instance.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      return response;
    } else {
      return Promise.reject({
        code: response.status,
        message: response.statusText,
      });
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

export class Grab {
  constructor(region) {
    this.region = region;
    this.version = "";
    this.lang = "";
  }

  async init() {
    let response = await instance.get(
      `https://ddragon.leagueoflegends.com/realms/${this.region}.json`
    );
    this.version = response.data.v;
    this.lang = response.data.l;
  }

  getSummonerIcons() {
    return instance.get(
      `http://ddragon.leagueoflegends.com/cdn/${this.version}/data/${this.lang}/profileicon.json`
    );
  }

  getSummonerIcon(id) {
    return `http://ddragon.leagueoflegends.com/cdn/${this.version}/img/profileicon/${id}.png`;
  }
}

export default Grab;
