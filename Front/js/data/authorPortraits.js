// Centralized author portrait source (spec §11).
// Single place that maps author names -> real portrait URLs of the actual
// authors. Wikimedia Commons files are served through Special:FilePath (raw
// /thumb/ URLs proved unreliable), Open Library covers for a few living
// authors. Authors with no verifiable free portrait (Jim Collins) fall back
// to the burgundy initials badge; `loadAuthorPortraits` enriches the map at
// runtime via the Wikipedia pageimages API. Alfred Lansing has no free
// portrait anywhere (his Wikipedia article and Open Library author entry are
// image-less), so the cover of his own book "Endurance" is shown instead.

const COMMONS = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
const fp = (file) => COMMONS + file + '?width=400';

const PORTRAITS = {
  'Agatha Christie': fp('Agatha_Christie_in_Nederland_(detectiveschrijfster),_bij_aankomst_op_Schiphol_me,_Bestanddeelnr_916-8898_(cropped).jpg'),
  'Albert Camus': fp('Albert_Camus,_gagnant_de_prix_Nobel,_portrait_en_buste,_pos%C3%A9_au_bureau,_faisant_face_%C3%A0_gauche,_cigarette_de_tabagisme.jpg'),
  'Alfred Lansing': 'https://covers.openlibrary.org/b/id/542833-L.jpg?default=false',
  'Anne Frank': fp('Anne_Frank_passport_photo,_May_1942_(cropped).jpg'),
  'Cal Newport': 'https://covers.openlibrary.org/a/olid/OL2853212A-L.jpg?default=false',
  'Carl Sagan': 'https://upload.wikimedia.org/wikipedia/commons/b/be/Carl_Sagan_Planetary_Society.JPG',
  'Harper Lee': fp('Photo_portrait_of_Harper_Lee_(To_Kill_a_Mockingbird_dust_jacket,_1960).jpg'),
  'Jane Austen': fp('CassandraAusten-JaneAusten(c.1810)_hires.jpg'),
  'George Orwell': fp('George_Orwell_press_photo.jpg'),
  'F. Scott Fitzgerald': fp('F._Scott_Fitzgerald_(1921_portrait_-_crop)_Retouched.jpg'),
  'Gabriel García Márquez': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg',
  'Khaled Hosseini': fp('Khaled_Hosseini,_2013_(cropped).jpg'),
  'Haruki Murakami': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Conversatorio_Haruki_Murakami_%2812_de_12%29_%2845747009452%29_%28cropped%29.jpg',
  'Kazuo Ishiguro': fp('MKr377543_Kazuo_Ishiguro_(A_Pale_View_of_Hills,_Cannes_2025).jpg'),
  'Raymond Chandler': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Raymond_Chandler_%28Lady_in_the_Lake_portrait%2C_1943%29.jpg',
  'Yuval Noah Harari': fp('MKr364751_Yuval_Noah_Harari_(Frankfurter_Buchmesse_2024).jpg'),
  'Jared Diamond': fp('Jared_Diamond_author_academic.jpg'),
  'Stephen Hawking': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg',
  'Richard Dawkins': fp('Dinner_with_Richard_Dawkins_and_CFI..._like_a_candle_in_the_dark.jpg'),
  'Rebecca Skloot': fp('Rebecca_skloot_2010.jpg'),
  'Rachel Carson': fp('Rachel-Carson.jpg'),
  'Rupi Kaur': fp('Rupi_Kaur_by_Baljit_Singh.jpg'),
  'Sylvia Plath': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Sylvia_Plath.jpg',
  'Daniel Kahneman': fp('Daniel_Kahneman_(3283955327)_(cropped).jpg'),
  'Susan Cain': 'https://upload.wikimedia.org/wikipedia/commons/6/61/SusanCainPortrait_250px_20120305.jpg',
  'Marcus Aurelius': fp('MSR-ra-61-b-1-DM.jpg'),
  'Suzanne Collins': fp('Suzanne_Collins_David_Shankbone_2010.jpg'),
  'Nelson Mandela': fp('Nelson_Mandela_1994.jpg'),
  'James Clear': 'https://upload.wikimedia.org/wikipedia/commons/1/17/James_Clear_in_2010.jpg',
  'Tracy Kidder': fp('Tracy_Kidder_2013.jpg'),
  'Viktor E. Frankl': fp('Viktor_Frankl2.jpg'),
  'Jostein Gaarder': fp('Jostein_Gaarder_Leipziger_Buchmesse_2017.jpg'),
  'Jon Krakauer': fp('Author_Jon_Krakauer_Highlights_Governor_Wolf%E2%80%99s_%E2%80%9CIt%E2%80%99s_On_Us_PA%E2%80%9D_Campaign,_Need_to_Address_Campus_Sexual_Assault_(cropped).jpg'),
  'Clayton M. Christensen': fp('Clayton_Christensen_World_Economic_Forum_2013.jpg'),
  'Peter Thiel': fp('Peter_Thiel_by_Gage_Skidmore.jpg'),
  'E. H. Gombrich': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Ernst_Gombrich.JPG',
  'John Berger': fp('John_Berger-2009_(6).jpg'),
  'Mary Beard': fp('Mary_Beard_UC3M_2017_(cropped).JPG'),
  'Walter Isaacson': fp('Walter_Isaacson_VF_2012_Shankbone_2.JPG'),
  'Carol S. Dweck': fp('Carol_Dweck_for_Innovation_documentary.jpg'),
  'Stieg Larsson': 'https://covers.openlibrary.org/a/olid/OL1414302A-L.jpg?default=false',
  'Tana French': 'https://covers.openlibrary.org/a/olid/OL2660362A-L.jpg?default=false',
  'Jim Collins': null
};

/** Synchronous lookup from the static map. */
export function authorPortraitUrl(name) {
  return Object.prototype.hasOwnProperty.call(PORTRAITS, name) ? PORTRAITS[name] : undefined;
}

/**
 * Async enrichment: resolves page images for all given author names in one
 * batched Wikipedia API request and merges them into the map. Thumbnail URLs
 * are re-built through Special:FilePath because raw /thumb/ URLs can 400.
 * Authors without a free portrait keep the initials-badge fallback. Best-effort.
 */
export async function loadAuthorPortraits(names = []) {
  const missing = [...new Set(names)].filter((n) => !authorPortraitUrl(n) && !(n in PORTRAITS));
  if (!missing.length || typeof fetch !== 'function') return;
  const chunks = [];
  for (let i = 0; i < missing.length; i += 40) chunks.push(missing.slice(i, i + 40));
  await Promise.all(chunks.map(async (chunk) => {
    try {
      const titles = encodeURIComponent(chunk.join('|'));
// piprop must be "name" (pageimage prop) — "pageimage" itself is an invalid
// value and makes the whole request fail with a noprop error.
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=name&format=json&origin=*&redirects=1&titles=${titles}`);
      if (!res.ok) return;
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const redirects = data?.query?.redirects || [];
      const norm = data?.query?.normalized || [];
      const resolve = (title) => {
        let t = title;
        const n2 = norm.find((x) => x.from === t); if (n2) t = n2.to;
        const r = redirects.find((x) => x.from === t); if (r) t = r.to;
        return t;
      };
      Object.values(pages).forEach((p) => {
        if (p.pageimage) PORTRAITS[resolve(p.title)] = fp(encodeURIComponent(p.pageimage).replaceAll('%2C', ','));
      });
    } catch { /* offline / blocked — initials fallback remains */ }
  }));
}
