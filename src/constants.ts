// Firestore
export const FIRESTORE_VERSION = 1;
export const MAP_PHOTOS_DOCUMENT_ID = '1';

// 地図表示の設定値
export const DEFAULT_POS = {
  // 東京駅
  lat: 35.6815947,
  lng: 139.7650003
};
export const DEFAULT_ZOOM = 17;
export const MAX_ZOOM = 17;
export const MIN_ZOOM = 2;
export const MAX_ZOOM_DURATION = 1000;
export const GET_CURRENT_POSITION_TIME_OUT = 30000;
export const MAX_MAP_PHOTO_COUNT = 100;
export const MAP_STYLE_URL = 'mapbox://styles/wagao/cloict5xt000y01r62pusgbhs';
export const CLUSTER_RADIUS = 100;

export const THUMBNAIL_SIZE = 100;

export const FETCH_NEW_PHOTOS_SIZE = 10;

// geolocation エラー種別
export const GEO_ERROR_UNSUPPORTED = 'geo_error_unsupported';
export const GEO_ERROR_PERMISSION = 'geo_error_permission';
export const GEO_ERROR_OTHERS = 'geo_error_others';

// Close button colors
export const CLOSE_BUTTON_WHITE = 'close_button_white';
export const CLOSE_BUTTON_BLACK = 'close_button_black';
