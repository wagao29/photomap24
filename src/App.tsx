import { Toaster } from 'react-hot-toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_POS,
  DEFAULT_ZOOM,
  GEO_ERROR_OTHERS,
  GEO_ERROR_PERMISSION,
  GEO_ERROR_UNSUPPORTED,
  GET_CURRENT_POSITION_TIME_OUT,
  MAP_STYLE_URL,
  MAX_ZOOM,
  MIN_ZOOM
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
import { ErrorDialog } from './components/dialogs/ErrorDialog';
import { getCurrentPosition } from './utils/getCurrentPosition';
import 'mapbox-gl/dist/mapbox-gl.css';
import { sleep } from './utils/sleep';
import Spinner from './components/Spinner';
import CurrentPosMarker from './components/CurrentPosMarker';
import { Coordinates, MapState } from './types';
import { useClusterPhotos } from './hooks/useClusterPhotos';
import CreateButton from './components/buttons/CreateButton';
import { toastNoPhotosError, toastUploadPhotoMessage } from './utils/toastMessages';
import { UploadDialog } from './components/dialogs/UploadDialog';
import ExploreButton from './components/buttons/ExploreButton';
import { PhotoDialog } from './components/dialogs/PhotoDialog';
import { fetchMapPhotos } from './apis/fetchMapPhotos';
import Footer from './components/templates/Footer';
import { TermsDialog } from './components/dialogs/TermsDialog';
import { PrivacyDialog } from './components/dialogs/PrivacyDialog';
import Header from './components/templates/Header';

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

  const { onMapLoad, updateMapPhotos, PhotoMarkers } = useClusterPhotos(mapRef);

  const openUnsupportedErrorDialog = useCallback(() => {
    openDialog(
      <ErrorDialog
        title='Geolocation error'
        content='Geolocation is not supported. Please try from another device.'
        onClose={closeDialog}
      />
    );
  }, []);

  const openPermissionErrorDialog = useCallback(() => {
    openDialog(
      <ErrorDialog
        title='Geolocation Error'
        content='User denied geolocation. Please allow use of geolocation.'
        onClose={closeDialog}
      />
    );
  }, []);

  const openOtherErrorDialog = useCallback(() => {
    openDialog(
      <ErrorDialog
        title='Geolocation Error'
        content='Failed to obtain geolocation. Please reload the page.'
        onClose={closeDialog}
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

  const onCloseDialog = useCallback(() => {
    updateMapPhotos();
    closeDialog();
  }, [updateMapPhotos, closeDialog]);

  const onClickCreate = async () => {
    if (mapRef.current && currentPos) {
      mapRef.current.jumpTo({
        center: [currentPos.longitude, currentPos.latitude],
        zoom: MAX_ZOOM
      });
      toastUploadPhotoMessage();
      await sleep(1.5);
      openDialog(<UploadDialog currentPos={currentPos} mapRef={mapRef} onClose={onCloseDialog} />);
    } else {
      openOtherErrorDialog();
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

  const onClickExploreButton = useCallback(async () => {
    const mapPhotos = await fetchMapPhotos();
    if (mapPhotos.length === 0) {
      toastNoPhotosError();
    } else {
      openDialog(
        <PhotoDialog mapPhotos={mapPhotos.reverse()} mapRef={mapRef} onClose={onCloseDialog} />
      );
    }
  }, [mapRef.current, openDialog, PhotoDialog, onCloseDialog]);

  const openHowToUseDialog = useCallback(() => {
    openDialog(<TermsDialog onClose={closeDialog} />);
  }, []);

  const openTermsDialog = useCallback(() => {
    openDialog(<TermsDialog onClose={closeDialog} />);
  }, []);

  const openPrivacyDialog = useCallback(() => {
    openDialog(<PrivacyDialog onClose={closeDialog} />);
  }, []);

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
      <Header />
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
          onError={onError}
        />
      </Map>
      <ExploreButton onClick={onClickExploreButton} />
      <CreateButton onClick={onClickCreate} />
      <Footer
        onClickHowToUse={openHowToUseDialog}
        onClickTerms={openTermsDialog}
        onClickPrivacy={openPrivacyDialog}
      />
      <Toaster toastOptions={{ duration: 1500 }} />
    </div>
  );
};

export default App;
