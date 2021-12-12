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



type assetsType = "loot" | "summoner-emotes" | "summoner-icon-sets" | "summoner-icons" | "ward-skin-sets" | "ward-skins";
type langType = "chinese" | "english";
let langMap = new Map([
  ["chinese", "zh_cn"],
  ["english", "default"]
]);

class Grab {
  public lang: langType;

  constructor(lang: langType) {
    this.lang = lang;
  }

  get(assets: assetsType, lang = this.lang) {
    return instance.get(`https://unpkg.com/@magicwenli/league-fan-assets/${langMap.get(lang)}/${assets}.json`);
  }
}

export default Grab;
