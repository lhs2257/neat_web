export const WHISKY_IMGS = [
  '/imgs/글렌피딕_발코니.png',
  '/imgs/라가불린_집.png',
  '/imgs/맥캘란_바.png',
  '/imgs/메이커스마크_집.png',
  '/imgs/발베니_집.png',
  '/imgs/히비키_바.png',
];

function ri(id) {
  return WHISKY_IMGS[id % WHISKY_IMGS.length];
}

export const SEED_NOTES = [
  { id:1,  name:'라가불린 16년',   category:'싱글몰트', years:'16년', rating:4.5, hue:28, nose:['피트','바다소금','훈연'],          palate:['오크','다크초콜릿','건자두'], finish:['롱','스모키'],       handle:'@peat_lover',  likes:128, x:150,  y:130,  rot:-2.2, mine:false, liked:false, img:ri(1)  },
  { id:2,  name:'맥캘란 18년',     category:'싱글몰트', years:'18년', rating:5,   hue:24, nose:['셰리','건포도','오렌지껍질'],      palate:['꿀','생강','견과'],          finish:['따뜻함','우아함'],  handle:'@amber_kim',   likes:214, x:520,  y:400,  rot:1.6,  mine:false, liked:false, img:ri(2)  },
  { id:3,  name:'메이커스 마크',    category:'버번',     years:'6년',  rating:4,   hue:34, nose:['바닐라','카라멜','옥수수'],        palate:['꿀','계피','오크'],          finish:['부드러움','달콤'],  handle:'@nightcap',    likes:76,  x:900,  y:110,  rot:-1.4, mine:true,  liked:false, img:ri(3)  },
  { id:4,  name:'발베니 14년',     category:'싱글몰트', years:'14년', rating:4.5, hue:30, nose:['카리브럼','바나나','토피'],         palate:['오크','스파이스','바닐라'],  finish:['풍부함','긴여운'],  handle:'@오크통',      likes:151, x:1250, y:440,  rot:2.4,  mine:false, liked:false, img:ri(4)  },
  { id:5,  name:'조니워커 블루',    category:'블렌디드', years:'NAS',  rating:4.5, hue:22, nose:['훈연','장미','헤이즐넛'],          palate:['부드러움','토피','스모크'],  finish:['벨벳','길고따뜻'], handle:'@위스키러버',  likes:189, x:1620, y:150,  rot:-1.8, mine:false, liked:false, img:ri(5)  },
  { id:6,  name:'우드포드 리저브',  category:'버번',     years:'NAS',  rating:4,   hue:36, nose:['말린과일','민트','카카오'],        palate:['카라멜','토피','스파이스'],  finish:['미디엄','따뜻'],   handle:'@amber_kim',   likes:64,  x:2000, y:420,  rot:1.2,  mine:false, liked:false, img:ri(6)  },
  { id:7,  name:'히비키 하모니',    category:'블렌디드', years:'NAS',  rating:4.5, hue:26, nose:['꿀','오렌지','화이트초콜릿'],      palate:['로즈마리','미즈나라','꿀'],  finish:['섬세','깔끔'],     handle:'@nightcap',    likes:203, x:2360, y:130,  rot:-2,   mine:true,  liked:false, img:ri(7)  },
  { id:8,  name:'아드벡 10년',     category:'싱글몰트', years:'10년', rating:4.5, hue:20, nose:['타르','레몬','피트'],              palate:['에스프레소','칠리','바다소금'],finish:['드라이','스모키'], handle:'@peat_lover',  likes:167, x:420,  y:920,  rot:2,    mine:false, liked:false, img:ri(8)  },
  { id:9,  name:'불릿 버번',       category:'버번',     years:'NAS',  rating:3.5, hue:38, nose:['체리','스파이스','오크'],          palate:['호밀','바닐라','토피'],      finish:['드라이','스파이시'],handle:'@오크통',      likes:52,  x:880,  y:880,  rot:-1.6, mine:false, liked:false, img:ri(9)  },
  { id:10, name:'글렌리벳 15년',   category:'싱글몰트', years:'15년', rating:4,   hue:32, nose:['살구','아몬드','오크'],            palate:['오렌지','넛맥','토피'],      finish:['부드러움','달콤'],  handle:'@위스키러버',  likes:98,  x:1400, y:960,  rot:1.8,  mine:false, liked:false, img:ri(10) },
  { id:11, name:'발렌타인 17년',   category:'블렌디드', years:'17년', rating:4,   hue:27, nose:['꿀','바닐라','사과'],              palate:['부드러움','오크','스파이스'],finish:['미디엄','우아'],   handle:'@amber_kim',   likes:87,  x:1900, y:900,  rot:-2.2, mine:false, liked:false, img:ri(11) },
  { id:12, name:'글렌피딕 12년',   category:'싱글몰트', years:'12년', rating:3.5, hue:33, nose:['배','시트러스','오크'],            palate:['사과','바닐라','오크'],      finish:['깔끔','상쾌'],     handle:'@nightcap',    likes:71,  x:2340, y:870,  rot:1.5,  mine:false, liked:false, img:ri(12) },
];

export const CATEGORIES = ['싱글몰트', '버번', '블렌디드'];
export const FILTERS    = ['전체', ...CATEGORIES];

export const WALL_W = 2900;
export const WALL_H = 1950;
