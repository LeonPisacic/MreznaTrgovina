const BASE_URL = 'http://localhost:5000'

//url koji ispisuje sve proizvode
export const PROIZVODI_URL = BASE_URL + '/api/proizvodi'

//url koji ispisuje sve kategorije koj se nalaze u istoj kategoriji (searchterm - 'Mobilni Uređaji)
export const PROIZVODI_KATEGORIJA_URL = BASE_URL + '/api/proizvodi/:searchTerm'

// url koji ispisuje sve proizvode koje se nalaze u istoj kategoriji, ali preko ID-a (searchterm - 333)
export const PROIZVODI_KATEGORIJA_ID_URL = BASE_URL + '/api/proizvodi/id/:searchTerm'

//url koji ispisuje proizvod prema njegovoj sifri (searchterm - 0.2)
export const PROIZVOD_SIFRA_URL = BASE_URL + 'api/proizvodi/sifra/:searchTerm'

export const PROIZVODI_INDEX_URL = BASE_URL + '/api/proizvodi/index/:searchTerm'

export const REGISTRIRANI_KORISNICI_URL = BASE_URL + '/api/registracija';

export const REGISTRIRANI_KORISNICI_ROLLA = BASE_URL + '/api/registracija/:searchTerm'


export const SVE_KATEGORIJE_URL = BASE_URL + '/api/filtriranjeKategorija'

export const FILTRIRANJE_KATEGORIJE_PO_NAZIVU = BASE_URL + '/api/filtriranjeKategorija/:searchTerm'




