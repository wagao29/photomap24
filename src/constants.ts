// Firestore
export const FIRESTORE_VERSION = 1;
export const MAP_PHOTOS_DOCUMENT_ID = '1';

// 地図表示の設定値
export const DEFAULT_POS = {
  // 東京駅
  lat: 35.6815947,
  lng: 139.7650003
};
export const DEFAULT_ZOOM = 16;
export const MAX_ZOOM = 16;
export const MIN_ZOOM = 4;
export const MAX_ZOOM_DURATION = 1000;
export const WEST_POINT = 122;
export const EAST_POINT = 155;
export const SOUTH_POINT = 20;
export const NORTH_POINT = 48;
export const GET_CURRENT_POSITION_TIME_OUT = 30000;
export const MAX_MAP_PHOTO_COUNT = 100;
export const MAP_STYLE_URL = 'mapbox://styles/wagao/clgs32tjq000x01pp86cy39az';
export const CLUSTER_RADIUS = 100;

export const THUMBNAIL_SIZE = 100;

export const FETCH_NEW_PHOTOS_SIZE = 10;

// ダイアログ種別
export const DIALOG_CONFIRM = 'dialog_confirm';
export const DIALOG_DELETE = 'dialog_delete';
export const DIALOG_ERROR = 'dialog_error';
export const DIALOG_CRITICAL = 'dialog_critical';

// fetch エラー種別
export const FETCH_ERROR_NOT_EXISTS = 'fetch_error_not_exists';
export const FETCH_ERROR_OTHERS = 'fetch_error_others';

// geolocation エラー種別
export const GEO_ERROR_UNSUPPORTED = 'geo_error_unsupported';
export const GEO_ERROR_OUT_OF_BOUNDS = 'geo_error_out_of_bounds';
export const GEO_ERROR_PERMISSION = 'geo_error_permission';
export const GEO_ERROR_OTHERS = 'geo_error_others';
