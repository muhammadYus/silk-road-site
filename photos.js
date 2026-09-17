// Фото с Wikimedia Commons: автор, лицензия и источник сверены через API Commons.
// Файл сгенерирован скриптом — правки лучше вносить в данные, а не руками.
const PHOTOS = [
  {
    "id": "registan",
    "src": "img/registan.jpg",
    "city": "samarkand",
    "caption": "Площадь Регистан",
    "author": "Gustavo Jeronimo; обработка — MrPanyGoff",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:RegistanSquare_Samarkand.jpg"
  },
  {
    "id": "shahizinda",
    "src": "img/shahizinda.jpg",
    "city": "samarkand",
    "caption": "Некрополь Шахи-Зинда",
    "author": "Petar Milošević",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Shah-i-Zinda,_Samarkand_(Shohi-Zinda_majmuasi,_Samarqand,_%D0%A8%D0%B0%D1%85%D0%B8_%D0%97%D0%B8%D0%BD%D0%B4%D0%B0).jpg"
  },
  {
    "id": "guremir",
    "src": "img/guremir.jpg",
    "city": "samarkand",
    "caption": "Мавзолей Гур-Эмир",
    "author": "Willard84",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:ShrineofAmirTimur.jpg"
  },
  {
    "id": "bibikhanym",
    "src": "img/bibikhanym.jpg",
    "city": "samarkand",
    "caption": "Арка мечети Биби-Ханым",
    "author": "Шухрат Саъдиев",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B5%D1%87%D0%B5%D1%82%D1%8C_%D0%91%D0%B8%D0%B1%D0%B8_%D0%A5%D0%B0%D0%BD%D1%83%D0%BC._%D0%A1%D0%B0%D0%BC%D0%B0%D1%80%D0%BA%D0%B0%D0%BD%D0%B4.jpg"
  },
  {
    "id": "ulugbek",
    "src": "img/ulugbek.jpg",
    "city": "samarkand",
    "caption": "Вход в музей обсерватории Улугбека",
    "author": "Sigismund von Dobschütz",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Samarkand-06.JPG"
  },
  {
    "id": "siab",
    "src": "img/siab.jpg",
    "city": "samarkand",
    "caption": "Сиабский базар",
    "author": "Ji-Elle",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Samarcande-Siyob_Bazaar_(1).jpg"
  },
  {
    "id": "siab-naan",
    "src": "img/siab-naan.jpg",
    "city": "samarkand",
    "caption": "Самаркандские лепёшки на Сиабском базаре",
    "author": "Yoshi Canopus",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Samarkand_naan_at_Siyob_Bazaar.jpg"
  },
  {
    "id": "kalyan",
    "src": "img/kalyan.jpg",
    "city": "bukhara",
    "caption": "Минарет Калян",
    "author": "Petar Milošević",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kalyan_Minaret,_Bukhara_(%D0%9C%D0%B8%D0%BD%D0%B0%D1%80%D0%B5%D1%82_%D0%9A%D0%B0%D0%BB%D1%8F%D0%BD_%D0%B2_%D0%91%D1%83%D1%85%D0%B0%D1%80%D0%B5,_Minorai_Kalon).jpg"
  },
  {
    "id": "ark",
    "src": "img/ark.jpg",
    "city": "bukhara",
    "caption": "Крепость Арк",
    "author": "ほっきー",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Ark_of_Bukhara_2023.9.jpg"
  },
  {
    "id": "ark-wide",
    "src": "img/ark-wide.jpg",
    "city": "bukhara",
    "caption": "Стены крепости Арк",
    "author": "Stanislav Kozlovskiy",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ark_Bukhara.jpg"
  },
  {
    "id": "labihauz",
    "src": "img/labihauz.jpg",
    "city": "bukhara",
    "caption": "Ляби-Хауз и медресе Надир-Диванбеги",
    "author": "Ymblanter",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Lyabi-Hovuz_and_Nadir_Divanbegi_Khanqah.jpg"
  },
  {
    "id": "nadir",
    "src": "img/nadir.jpg",
    "city": "bukhara",
    "caption": "Портал медресе Надир-Диванбеги",
    "author": "Mario J. Schwaiger",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Nadir_Divan-Beghi_Madrassah.JPG"
  },
  {
    "id": "chorminor",
    "src": "img/chorminor.jpg",
    "city": "bukhara",
    "caption": "Чор-Минор",
    "author": "Petar Milošević",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Chor_Minor_mosque_(%D0%A7%D0%BE%D1%80-%D0%9C%D0%B8%D0%BD%D0%BE%D1%80,_%D0%91%D1%83%D1%85%D0%B0%D1%80%D0%B0).jpg"
  },
  {
    "id": "samanid",
    "src": "img/samanid.jpg",
    "city": "bukhara",
    "caption": "Мавзолей Саманидов",
    "author": "Apfel51",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:UZ_Bukhara_Samanid-mausoleum.jpg"
  },
  {
    "id": "samanid-2",
    "src": "img/samanid-2.jpg",
    "city": "bukhara",
    "caption": "Мавзолей Саманидов в парке",
    "author": "Hylgeriak",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Samanid_mausoleum_bukhara.jpg"
  },
  {
    "id": "bukhara",
    "src": "img/bukhara.jpg",
    "city": "bukhara",
    "caption": "Ансамбль Пои-Калян",
    "author": "Euyasik",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kalon-Ensemble_Buchara.jpg"
  },
  {
    "id": "itchankala",
    "src": "img/itchankala.jpg",
    "city": "khiva",
    "caption": "Вид на Ичан-Калу с цитадели",
    "author": "LBM1948",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Jiva,_Itchan_Kala_06.jpg"
  },
  {
    "id": "kaltaminor",
    "src": "img/kaltaminor.jpg",
    "city": "khiva",
    "caption": "Кальта-Минар",
    "author": "pastaitaken",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kalta_Minar.jpg"
  },
  {
    "id": "juma",
    "src": "img/juma.jpg",
    "city": "khiva",
    "caption": "Джума-мечеть",
    "author": "Carpodacus",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Friday_Mosque_of_Khiva.jpg"
  },
  {
    "id": "juma-2",
    "src": "img/juma-2.jpg",
    "city": "khiva",
    "caption": "Колонный зал Джума-мечети",
    "author": "Dan Lundberg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Juma_Mosque_20140927_Uzbekistan_0284_Khiva_(15638472913).jpg"
  },
  {
    "id": "khiva",
    "src": "img/khiva.jpg",
    "city": "khiva",
    "caption": "Панорама Хивы с крепостной стены",
    "author": "Fulvio Spada from Torino, Italy",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:View_from_the_city_walls,_Khiva_(4934484894).jpg"
  },
  {
    "id": "islamkhodja",
    "src": "img/islamkhodja.jpg",
    "city": "khiva",
    "caption": "Медресе Ислам-Ходжа",
    "author": "Bgag",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Islam_Khodja_Madrasa_01.jpg"
  },
  {
    "id": "chorsu",
    "src": "img/chorsu.jpg",
    "city": "tashkent",
    "caption": "Базар Чорсу",
    "author": "Theklan",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Chorsu_Market_general_view.jpg"
  },
  {
    "id": "hazratimam",
    "src": "img/hazratimam.jpg",
    "city": "tashkent",
    "caption": "Медресе Барак-хана, Хазрати Имам",
    "author": "Ymblanter",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Barakhan_Madrasah_Tashkent.jpg"
  },
  {
    "id": "kukeldash",
    "src": "img/kukeldash.jpg",
    "city": "tashkent",
    "caption": "Медресе Кукельдаш",
    "author": "Ymblanter",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kukeldash_Madrassah_side_view.jpg"
  },
  {
    "id": "kukeldash-yard",
    "src": "img/kukeldash-yard.jpg",
    "city": "tashkent",
    "caption": "Двор медресе Кукельдаш",
    "author": "Ymblanter",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kukeldash_Madrasah_inner_yard.jpg"
  },
  {
    "id": "metro",
    "src": "img/metro.jpg",
    "city": "tashkent",
    "caption": "Станция метро «Юнусабад»",
    "author": "Solijonovm1996",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Yunusobod.jpg"
  }
];
