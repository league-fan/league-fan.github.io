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
      `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/${this.lang}/profileicon.json`
    );
  }

  getSummonerIcon(id) {
    return `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/profileicon/${id}.png`;
  }

  getSummonerIconHttp(id) {
    return `http://ddragon.leagueoflegends.com/cdn/${this.version}/img/profileicon/${id}.png`;
  }
  

  getSummonerIconDescriptions() {
      let lang = this.lang.toLowerCase();
    //   return instance.get(`https://raw.communitydragon.org/${this.version}/plugins/rcp-fe-lol-loot/global/${lang}/summonericon.json`);
    return instance.get(`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/${lang}/summonericon.json`);
  }
  
  getSummonerIconDescriptionsTencent(){
    return instance.get(`https://game.gtimg.cn/images/lol/act/img/js/cuPortraitList/cuportrait_list.js`);
  }

  getSummonerEmotes() {
    return instance.get('https://cdn.jsdelivr.net/npm/@magicwenli/league-fan-assets/summoner-emotes.json');
  }
}

export default Grab;
