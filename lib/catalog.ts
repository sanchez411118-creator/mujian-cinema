import type {PlaybackSource} from "./playback";
export type MediaItem = { id:string; title:string; originalTitle:string; type:'movie'|'anime'|'series'; year:number; rating:number|null; genres:string[]; overview:string; poster:string; backdrop?:string; source:string; sourceUrl:string; trailer?:string; watchUrl?:string; watchLabel?:string; duration?:string; status?:string; fullVideo?:string; playback?:PlaybackSource[]; };

export const seedCatalog:MediaItem[] = [
  {
    "id": "movie-960891136",
    "title": "星际穿越",
    "originalTitle": "Interstellar",
    "type": "movie",
    "year": 2014,
    "rating": null,
    "genres": [
      "科幻",
      "冒险"
    ],
    "overview": "当故乡不再适合生存，一位父亲穿越星海，在时间的另一端寻找回家的答案。",
    "poster": "/images/movie-960891136.jpg",
    "source": "Apple Movies",
    "sourceUrl": "https://itunes.apple.com/us/movie/interstellar/id960891136?uo=4",
    "trailer": "https://video-ssl.itunes.apple.com/itunes-assets/Video111/v4/54/b7/37/54b737f0-63c2-77ed-44b3-4f7e2d34f386/mzvf_806821658861734960.640x354.h264lc.U.p.m4v",
    "watchUrl": "https://itunes.apple.com/us/movie/interstellar/id960891136?uo=4",
    "watchLabel": "Apple TV",
    "duration": "169 分钟",
    "status": "已上映",
    "backdrop": "/images/interstellar-hero.jpg"
  },
  {
    "id": "movie-1725365997",
    "title": "沙丘2",
    "originalTitle": "Dune: Part Two",
    "type": "movie",
    "year": 2024,
    "rating": null,
    "genres": [
      "科幻",
      "冒险"
    ],
    "overview": "沙海之上，保罗与弗雷曼人同行。关于命运、爱情与权力的史诗，迎来新的篇章。",
    "poster": "/images/movie-1725365997.jpg",
    "source": "Apple Movies",
    "sourceUrl": "https://itunes.apple.com/us/movie/dune-part-two/id1725365997?uo=4",
    "trailer": "https://video-ssl.itunes.apple.com/itunes-assets/Video126/v4/63/8a/25/638a25e9-67b7-241f-3604-1e1167db8d8a/mzvf_15647338716229668008.640x450.h264lc.U.p.m4v",
    "watchUrl": "https://itunes.apple.com/us/movie/dune-part-two/id1725365997?uo=4",
    "watchLabel": "Apple TV",
    "duration": "166 分钟",
    "status": "已上映",
    "backdrop": "/images/dune-hero.jpg"
  },
  {
    "id": "movie-400763833",
    "title": "盗梦空间",
    "originalTitle": "Inception",
    "type": "movie",
    "year": 2010,
    "rating": null,
    "genres": [
      "科幻",
      "悬疑"
    ],
    "overview": "进入梦境深处，种下一颗改变现实的念头。真假之间，每一层世界都暗藏机关。",
    "poster": "/images/movie-400763833.jpg",
    "source": "Apple Movies",
    "sourceUrl": "https://itunes.apple.com/us/movie/inception/id400763833?uo=4",
    "trailer": "https://video-ssl.itunes.apple.com/itunes-assets/Video117/v4/37/15/e0/3715e067-3886-70eb-c34c-6ae2189ec91f/mzvf_7105735405365380478.640x356.h264lc.U.p.m4v",
    "watchUrl": "https://itunes.apple.com/us/movie/inception/id400763833?uo=4",
    "watchLabel": "Apple TV",
    "duration": "148 分钟",
    "status": "已上映"
  },
  {
    "id": "movie-329619072",
    "title": "和莎莫的500天",
    "originalTitle": "(500) Days of Summer",
    "type": "movie",
    "year": 2009,
    "rating": null,
    "genres": [
      "爱情",
      "喜剧"
    ],
    "overview": "一段倒叙的爱情记忆，串起相遇、热恋与告别，也让人在遗憾里学会重新开始。",
    "poster": "/images/movie-329619072.jpg",
    "source": "Apple Movies",
    "sourceUrl": "https://itunes.apple.com/us/movie/500-days-of-summer/id329619072?uo=4",
    "trailer": "https://video-ssl.itunes.apple.com/itunes-assets/Video128/v4/d1/f1/94/d1f1946a-0bc3-fafb-9f7c-f5689c294492/mzvf_1439684365965321133.640x480.h264lc.U.p.m4v",
    "watchUrl": "https://itunes.apple.com/us/movie/500-days-of-summer/id329619072?uo=4",
    "watchLabel": "Apple TV",
    "duration": "95 分钟",
    "status": "已上映"
  },
  {
    "id": "movie-1437031362",
    "title": "一个明星的诞生",
    "originalTitle": "A Star Is Born (2018)",
    "type": "movie",
    "year": 2018,
    "rating": null,
    "genres": [
      "爱情",
      "音乐"
    ],
    "overview": "两个爱音乐的人在舞台上相遇，彼此照亮，也共同面对名声背后的风浪。",
    "poster": "/images/movie-1437031362.jpg",
    "source": "Apple Movies",
    "sourceUrl": "https://itunes.apple.com/us/movie/a-star-is-born-2018/id1437031362?uo=4",
    "trailer": "https://video-ssl.itunes.apple.com/itunes-assets/Video128/v4/6b/cd/60/6bcd60b0-73ce-1a9e-1bf8-d7bcc8d32c10/mzvf_2708740245690387686.640x356.h264lc.U.p.m4v",
    "watchUrl": "https://itunes.apple.com/us/movie/a-star-is-born-2018/id1437031362?uo=4",
    "watchLabel": "Apple TV",
    "duration": "136 分钟",
    "status": "已上映"
  },
  {
    "id": "movie-1710495188",
    "title": "奥本海默",
    "originalTitle": "Oppenheimer",
    "type": "movie",
    "year": 2023,
    "rating": null,
    "genres": [
      "剧情",
      "传记"
    ],
    "overview": "从实验室到荒漠试验场，改变世界的科学发现，也留下无法回避的道德回声。",
    "poster": "/images/movie-1710495188.jpg",
    "source": "Apple Movies",
    "sourceUrl": "https://itunes.apple.com/us/movie/oppenheimer/id1710495188?uo=4",
    "trailer": "https://video-ssl.itunes.apple.com/itunes-assets/Video126/v4/d4/04/b1/d404b15c-a1f6-288f-0ac7-7ebb1033fdb0/mzvf_18263202868535868733.640x386.h264lc.U.p.m4v",
    "watchUrl": "https://itunes.apple.com/us/movie/oppenheimer/id1710495188?uo=4",
    "watchLabel": "Apple TV",
    "duration": "181 分钟",
    "status": "已上映"
  },
  {
    "id": "movie-1616561026",
    "title": "瞬息全宇宙",
    "originalTitle": "Everything Everywhere All At Once",
    "type": "movie",
    "year": 2022,
    "rating": null,
    "genres": [
      "科幻",
      "喜剧"
    ],
    "overview": "一位平凡母亲被卷入无数平行人生，在混乱宇宙里重新寻找家人的意义。",
    "poster": "/images/movie-1616561026.jpg",
    "source": "Apple Movies",
    "sourceUrl": "https://itunes.apple.com/us/movie/everything-everywhere-all-at-once/id1616561026?uo=4",
    "trailer": "https://video-ssl.itunes.apple.com/itunes-assets/Video122/v4/d7/52/6e/d7526e68-eb8d-3819-a06e-edff4a4629c6/mzvf_8023931895504784489.640x458.h264lc.U.p.m4v",
    "watchUrl": "https://itunes.apple.com/us/movie/everything-everywhere-all-at-once/id1616561026?uo=4",
    "watchLabel": "Apple TV",
    "duration": "139 分钟",
    "status": "已上映"
  },
  {
    "id": "movie-1606824145",
    "title": "新蝙蝠侠",
    "originalTitle": "The Batman",
    "type": "movie",
    "year": 2022,
    "rating": null,
    "genres": [
      "动作",
      "悬疑"
    ],
    "overview": "哥谭的连环谜案，将年轻的蝙蝠侠带入城市最阴暗的角落。",
    "poster": "/images/movie-1606824145.jpg",
    "source": "Apple Movies",
    "sourceUrl": "https://itunes.apple.com/us/movie/the-batman/id1606824145?uo=4",
    "trailer": "https://video-ssl.itunes.apple.com/itunes-assets/Video126/v4/5a/be/1c/5abe1cca-8045-8243-ce9b-135dc3ddbac2/mzvf_17557480539273521219.640x356.h264lc.U.p.m4v",
    "watchUrl": "https://itunes.apple.com/us/movie/the-batman/id1606824145?uo=4",
    "watchLabel": "Apple TV",
    "duration": "177 分钟",
    "status": "已上映"
  },
  {
    "id": "anime-21519",
    "title": "你的名字。",
    "originalTitle": "Your Name.",
    "type": "anime",
    "year": 2016,
    "rating": 8.5,
    "genres": [
      "爱情",
      "奇幻"
    ],
    "overview": "两个从未相识的人，在梦中交换人生。一颗彗星划过天空，让彼此的命运悄然相连。",
    "poster": "/images/anime-21519.png",
    "backdrop": "/images/anime-21519-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/21519",
    "trailer": "https://www.youtube.com/watch?v=k4xGqY5IDBE",
    "watchUrl": "https://www.netflix.com/title/80161371",
    "watchLabel": "Netflix",
    "duration": "107 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-154587",
    "title": "葬送的芙莉莲",
    "originalTitle": "Frieren: Beyond Journey’s End",
    "type": "anime",
    "year": 2023,
    "rating": 9,
    "genres": [
      "奇幻",
      "冒险"
    ],
    "overview": "勇者的故事结束之后，长寿的精灵踏上新的旅程，学习理解短暂而珍贵的人生。",
    "poster": "/images/anime-154587.jpg",
    "backdrop": "/images/anime-154587-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/154587",
    "trailer": "https://www.youtube.com/watch?v=tR8YH0G67Rk",
    "watchUrl": "https://www.crunchyroll.com/series/GG5H5XQX4/frieren-beyond-journeys-end",
    "watchLabel": "Crunchyroll",
    "duration": "28 集 · 每集 24 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-199",
    "title": "千与千寻",
    "originalTitle": "Spirited Away",
    "type": "anime",
    "year": 2001,
    "rating": 8.6,
    "genres": [
      "奇幻",
      "冒险"
    ],
    "overview": "少女误入神灵的世界，在陌生的汤屋中学会勇敢，也找回自己的名字。",
    "poster": "/images/anime-199.jpg",
    "backdrop": "/images/anime-199-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/199",
    "trailer": "https://www.youtube.com/watch?v=ByXuk9QqQkk",
    "watchUrl": "https://www.netflix.com/title/60023642",
    "watchLabel": "Netflix",
    "duration": "125 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-21827",
    "title": "紫罗兰永恒花园",
    "originalTitle": "Violet Evergarden",
    "type": "anime",
    "year": 2018,
    "rating": 8.5,
    "genres": [
      "剧情",
      "治愈"
    ],
    "overview": "不擅表达情感的少女成为代笔人，在一封封信里，慢慢读懂爱的重量。",
    "poster": "/images/anime-21827.png",
    "backdrop": "/images/anime-21827-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/21827",
    "trailer": "https://www.youtube.com/watch?v=_grmduuECm4",
    "watchUrl": "https://www.netflix.com/title/80182123",
    "watchLabel": "Netflix",
    "duration": "13 集 · 每集 24 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-140960",
    "title": "间谍过家家",
    "originalTitle": "SPY x FAMILY",
    "type": "anime",
    "year": 2022,
    "rating": 8.3,
    "genres": [
      "喜剧",
      "日常"
    ],
    "overview": "间谍、杀手与读心小女孩组成临时家庭，秘密任务与温暖日常同时上演。",
    "poster": "/images/anime-140960.jpg",
    "backdrop": "/images/anime-140960-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/140960",
    "trailer": "https://www.youtube.com/watch?v=_VRxEEBa1XU",
    "watchUrl": "https://www.netflix.com/title/81511410",
    "watchLabel": "Netflix",
    "duration": "12 集 · 每集 24 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-101922",
    "title": "鬼灭之刃",
    "originalTitle": "Demon Slayer: Kimetsu no Yaiba",
    "type": "anime",
    "year": 2019,
    "rating": 8.2,
    "genres": [
      "动作",
      "奇幻"
    ],
    "overview": "为了让妹妹恢复成人，炭治郎握紧日轮刀，走上一条温柔而坚定的旅途。",
    "poster": "/images/anime-101922.jpg",
    "backdrop": "/images/anime-101922-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/101922",
    "trailer": "https://www.youtube.com/watch?v=6vMuWuWlW4I",
    "watchUrl": "https://www.crunchyroll.com/demon-slayer-kimetsu-no-yaiba",
    "watchLabel": "Crunchyroll",
    "duration": "26 集 · 每集 24 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-113415",
    "title": "咒术回战",
    "originalTitle": "JUJUTSU KAISEN",
    "type": "anime",
    "year": 2020,
    "rating": 8.4,
    "genres": [
      "动作",
      "奇幻"
    ],
    "overview": "少年吞下危险的咒物，从此进入咒术师的世界，与伙伴一起对抗黑暗。",
    "poster": "/images/anime-113415.jpg",
    "backdrop": "/images/anime-113415-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/113415",
    "trailer": "https://www.youtube.com/watch?v=RIyb52EMx8c",
    "watchUrl": "https://www.crunchyroll.com/jujutsu-kaisen",
    "watchLabel": "Crunchyroll",
    "duration": "24 集 · 每集 24 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-16498",
    "title": "进击的巨人",
    "originalTitle": "Attack on Titan",
    "type": "anime",
    "year": 2013,
    "rating": 8.5,
    "genres": [
      "动作",
      "悬疑"
    ],
    "overview": "高墙之外是什么？少年们为了自由踏上战场，也逐渐接近世界残酷的真相。",
    "poster": "/images/anime-16498.jpg",
    "backdrop": "/images/anime-16498-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/16498",
    "trailer": "https://www.youtube.com/watch?v=LHtdKWJdif4\t",
    "watchUrl": "http://www.crunchyroll.com/attack-on-titan",
    "watchLabel": "Crunchyroll",
    "duration": "25 集 · 每集 24 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-5114",
    "title": "钢之炼金术师",
    "originalTitle": "Fullmetal Alchemist: Brotherhood",
    "type": "anime",
    "year": 2009,
    "rating": 9,
    "genres": [
      "冒险",
      "奇幻"
    ],
    "overview": "为了找回失去的身体，艾尔利克兄弟追寻贤者之石，探寻等价交换之外的答案。",
    "poster": "/images/anime-5114.jpg",
    "backdrop": "/images/anime-5114-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/5114",
    "trailer": "https://www.youtube.com/watch?v=1ac3_YdSSy0",
    "watchUrl": "http://www.hulu.com/fullmetal-alchemist-brotherhood",
    "watchLabel": "Hulu",
    "duration": "64 集 · 每集 25 分钟",
    "status": "精选动漫"
  },
  {
    "id": "anime-142770",
    "title": "铃芽之旅",
    "originalTitle": "Suzume",
    "type": "anime",
    "year": 2022,
    "rating": 8.1,
    "genres": [
      "奇幻",
      "冒险"
    ],
    "overview": "少女追逐一扇扇神秘的门，穿过熟悉又陌生的日本，学会告别与重新出发。",
    "poster": "/images/anime-142770.jpg",
    "backdrop": "/images/anime-142770-banner.jpg",
    "source": "AniList",
    "sourceUrl": "https://anilist.co/anime/142770",
    "trailer": "https://www.youtube.com/watch?v=g0JMPkn7Wuo",
    "watchUrl": "https://www.crunchyroll.com/series/GP5HJ8425/suzume",
    "watchLabel": "Crunchyroll",
    "duration": "121 分钟",
    "status": "精选动漫"
  }
];

export const screeningRoom:MediaItem[] = [
  {
    "id": "open-sintel",
    "title": "辛特尔",
    "originalTitle": "Sintel",
    "type": "anime",
    "year": 2010,
    "rating": null,
    "genres": [
      "动画",
      "短片"
    ],
    "overview": "少女与幼龙相遇，许下跨越山海的承诺。一部关于寻找、勇气与失去的奇幻短片。",
    "poster": "/images/open-sintel.webp",
    "backdrop": "/images/open-sintel-banner.png",
    "source": "Blender Studio · CC BY",
    "sourceUrl": "https://studio.blender.org/films/sintel/",
    "watchUrl": "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    "watchLabel": "官方全片",
    "fullVideo": "/api/video?id=sintel",
    "duration": "15 分钟",
    "status": "免费完整短片"
  },
  {
    "id": "open-big-buck-bunny",
    "title": "大雄兔",
    "originalTitle": "Big Buck Bunny",
    "type": "anime",
    "year": 2008,
    "rating": null,
    "genres": [
      "动画",
      "短片"
    ],
    "overview": "温柔的大兔子遭遇三个捣蛋鬼。森林里的小小冲突，变成一场妙趣横生的反击。",
    "poster": "/images/open-big-buck-bunny.webp",
    "backdrop": "/images/open-big-buck-bunny-banner.png",
    "source": "Blender Studio · CC BY",
    "sourceUrl": "https://studio.blender.org/films/big-buck-bunny/",
    "watchUrl": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "watchLabel": "官方全片",
    "duration": "10 分钟",
    "status": "免费完整短片"
  },
  {
    "id": "open-tears-of-steel",
    "title": "钢铁之泪",
    "originalTitle": "Tears of Steel",
    "type": "movie",
    "year": 2012,
    "rating": null,
    "genres": [
      "科幻",
      "短片"
    ],
    "overview": "未来阿姆斯特丹，人类试图借助记忆与情感，终结一场与机器的战争。",
    "poster": "/images/open-tears-of-steel.webp",
    "backdrop": "/images/open-tears-of-steel-banner.png",
    "source": "Blender Studio · CC BY",
    "sourceUrl": "https://studio.blender.org/films/tears-of-steel/",
    "watchUrl": "https://www.youtube.com/watch?v=R6MlUcmOul8",
    "watchLabel": "官方全片",
    "fullVideo": "/api/video?id=tears-of-steel",
    "duration": "12 分钟",
    "status": "免费完整短片"
  }
];

export const heroSlides:MediaItem[] = [seedCatalog.find(x=>x.title==='沙丘2')!,seedCatalog.find(x=>x.title==='葬送的芙莉莲')!,seedCatalog.find(x=>x.title==='星际穿越')!].filter(Boolean);
