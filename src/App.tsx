import { Toaster } from 'react-hot-toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_POS,
  DEFAULT_ZOOM,
  DIALOG_ERROR,
  EAST_POINT,
  GEO_ERROR_OTHERS,
  GEO_ERROR_OUT_OF_BOUNDS,
  GEO_ERROR_PERMISSION,
  GEO_ERROR_UNSUPPORTED,
  GET_CURRENT_POSITION_TIME_OUT,
  MAP_STYLE_URL,
  MAX_ZOOM,
  MIN_ZOOM,
  NORTH_POINT,
  SOUTH_POINT,
  WEST_POINT
} from './constants';
import {
  GeolocateControl,
  GeolocateErrorEvent,
  GeolocateResultEvent,
  Map,
  MapRef,
  MarkerDragEvent
} from 'react-map-gl';
import { useDialogContext } from './providers/DialogProvider';
import { CommonDialog } from './components/CommonDialog';
import { getCurrentPosition } from './utils/getCurrentPosition';
import 'mapbox-gl/dist/mapbox-gl.css';
import { sleep } from './utils/sleep';
import Spinner from './components/Spinner';
import CurrentPosMarker from './components/CurrentPosMarker';
import { Coordinates, MapState } from './types';
import { useClusterPhotos } from './hooks/useClusterPhotos';
import CreatePhotoButton from './components/CreatePhotoButton';
import {
  toastCurrentPosError,
  toastReloadMessage,
  toastUploadPhotoMessage
} from './utils/toastMessages';
import { UploadDialog } from './components/UploadDialog';
import ReloadButton from './components/ReloadButton';

const App = () => {
  const { openDialog, closeDialog } = useDialogContext();

  const [currentPos, setCurrentPos] = useState<Coordinates>();
  const [mapState, setMapState] = useState<MapState>({
    longitude: DEFAULT_POS.lng,
    latitude: DEFAULT_POS.lat,
    zoom: DEFAULT_ZOOM
  });
  const [isReadyPos, setIsReadyPos] = useState<boolean>(false);

  const mapRef = useRef<MapRef>(null);
  const reloadRef = useRef<boolean>(true);

  const { onMapLoad, updateMapPhotos, PhotoMarkers } = useClusterPhotos(mapRef);

  const openUnsupportedErrorDialog = useCallback(() => {
    openDialog(
      <CommonDialog
        dialogType={DIALOG_ERROR}
        title='位置情報エラー'
        content='お使いのブラウザは位置情報の取得に対応していません。別のブラウザや端末からお試しください。'
        onCancel={closeDialog}
      />
    );
  }, []);

  const openOutOfBoundsErrorDialog = useCallback(() => {
    openDialog(
      <CommonDialog
        dialogType={DIALOG_ERROR}
        title='位置情報エラー'
        content='現在地はサービス提供エリア外です。本サービスは日本国内のみ対応しています。'
        onCancel={closeDialog}
      />
    );
  }, []);

  const openPermissionErrorDialog = useCallback(() => {
    openDialog(
      <CommonDialog
        dialogType={DIALOG_ERROR}
        title='位置情報エラー'
        content='位置情報の使用が許可されていません。ブラウザの位置情報の使用を許可してください。'
        onCancel={closeDialog}
      />
    );
  }, []);

  const openOtherErrorDialog = useCallback(() => {
    openDialog(
      <CommonDialog
        dialogType={DIALOG_ERROR}
        title='位置情報エラー'
        content='位置情報の取得に失敗しました。繰り返し失敗する場合、別のブラウザや端末からお試しください。'
        onCancel={closeDialog}
      />
    );
  }, []);

  useEffect(() => {
    (async () => {
      const result = await getCurrentPosition();
      switch (result) {
        case GEO_ERROR_UNSUPPORTED: {
          openUnsupportedErrorDialog();
          break;
        }
        case GEO_ERROR_OUT_OF_BOUNDS: {
          openOutOfBoundsErrorDialog();
          break;
        }
        case GEO_ERROR_PERMISSION: {
          openPermissionErrorDialog();
          break;
        }
        case GEO_ERROR_OTHERS: {
          openOtherErrorDialog();
          break;
        }
        default: {
          setCurrentPos(result);
          setMapState({
            ...result,
            zoom: DEFAULT_ZOOM
          });
        }
      }
      await updateMapPhotos();
      setIsReadyPos(true);
    })();
  }, []);

  const onClickCreate = async () => {
    if (mapRef.current && currentPos) {
      mapRef.current.jumpTo({
        center: [currentPos.longitude, currentPos.latitude],
        zoom: MAX_ZOOM
      });
      toastUploadPhotoMessage();
      await sleep(1.5);
      openDialog(<UploadDialog currentPos={currentPos} onClose={closeDialog} />);
    } else {
      toastCurrentPosError();
    }
  };

  const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
    setCurrentPos({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat
    });
  }, []);

  const onGeolocate = useCallback((e: GeolocateResultEvent) => {
    setCurrentPos({
      longitude: e.coords.longitude,
      latitude: e.coords.latitude
    });
  }, []);

  const onError = useCallback(
    (err: GeolocateErrorEvent) => {
      if (err.code === err.PERMISSION_DENIED) {
        openPermissionErrorDialog();
      } else {
        openOtherErrorDialog();
      }
    },
    [openPermissionErrorDialog, openOtherErrorDialog]
  );

  const onOutOfMaxBounds = useCallback(() => {
    openOutOfBoundsErrorDialog();
  }, [openOutOfBoundsErrorDialog]);

  const onClickReload = useCallback(async () => {
    if (reloadRef.current) {
      reloadRef.current = false;
      toastReloadMessage();
      updateMapPhotos();
      await sleep(1.5);
      reloadRef.current = true;
    }
  }, [updateMapPhotos, reloadRef.current]);

  if (!isReadyPos) {
    return <Spinner className='absolute inset-0 flex items-center justify-center' />;
  }

  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100% - env(safe-area-inset-bottom, 20px))',
        overflow: 'auto'
      }}
      className='hidden-scrollbar'
    >
      <Map
        initialViewState={mapState}
        style={{
          width: '100%',
          height: '100%'
        }}
        mapStyle={MAP_STYLE_URL}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        onLoad={onMapLoad}
        maxZoom={MAX_ZOOM}
        minZoom={MIN_ZOOM}
        maxBounds={[
          [WEST_POINT, SOUTH_POINT],
          [EAST_POINT, NORTH_POINT]
        ]}
        pitchWithRotate={false}
        touchPitch={false}
      >
        {PhotoMarkers}
        {currentPos && (
          <CurrentPosMarker currentPos={currentPos} draggable={true} onDragEnd={onMarkerDragEnd} />
        )}
        <GeolocateControl
          positionOptions={{
            timeout: GET_CURRENT_POSITION_TIME_OUT,
            enableHighAccuracy: true
          }}
          showUserLocation={false}
          trackUserLocation={true}
          position='bottom-left'
          fitBoundsOptions={{ maxZoom: DEFAULT_ZOOM }}
          onGeolocate={onGeolocate}
          onOutOfMaxBounds={onOutOfMaxBounds}
          onError={onError}
        />
      </Map>
      <ReloadButton onClick={onClickReload} />
      <CreatePhotoButton onClick={onClickCreate} />
      <Toaster toastOptions={{ duration: 1500 }} />
    </div>
  );
};

export default App;
