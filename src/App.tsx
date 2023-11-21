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
import { useModalContext } from './providers/ModalProvider';
import { ErrorModal } from './components/modals/ErrorModal';
import { getCurrentPosition } from './utils/getCurrentPosition';
import 'mapbox-gl/dist/mapbox-gl.css';
import { sleep } from './utils/sleep';
import Spinner from './components/Spinner';
import CurrentPosMarker from './components/CurrentPosMarker';
import { Coordinates, MapState } from './types';
import { useClusterPhotos } from './hooks/useClusterPhotos';
import CreateButton from './components/buttons/CreateButton';
import { toastNoPhotosError, toastUploadPhotoMessage } from './utils/toastMessages';
import { UploadModal } from './components/modals/UploadModal';
import ExploreButton from './components/buttons/ExploreButton';
import { PhotoModal } from './components/modals/PhotoModal';
import { fetchMapPhotos } from './apis/fetchMapPhotos';
import Footer from './components/templates/Footer';
import { TermsModal } from './components/modals/TermsModal';
import { PrivacyModal } from './components/modals/PrivacyModal';
import Header from './components/templates/Header';
import { AboutModal } from './components/modals/AboutModal';

const App = () => {
  const { openModal, closeModal } = useModalContext();

  const [currentPos, setCurrentPos] = useState<Coordinates>();
  const [mapState, setMapState] = useState<MapState>({
    longitude: DEFAULT_POS.lng,
    latitude: DEFAULT_POS.lat,
    zoom: DEFAULT_ZOOM
  });
  const [isReadyPos, setIsReadyPos] = useState<boolean>(false);

  const mapRef = useRef<MapRef>(null);

  const { onMapLoad, updateMapPhotos, PhotoMarkers } = useClusterPhotos(mapRef);

  const openUnsupportedErrorModal = useCallback(() => {
    openModal(
      <ErrorModal
        title='Geolocation error'
        content={`Geolocation is not supported.\nPlease try from another device.`}
        onClose={closeModal}
      />
    );
  }, []);

  const openPermissionErrorModal = useCallback(() => {
    openModal(
      <ErrorModal
        title='Geolocation Error'
        content={`User denied geolocation.\nPlease allow use of geolocation.`}
        onClose={closeModal}
      />
    );
  }, []);

  const openOtherErrorModal = useCallback(() => {
    openModal(
      <ErrorModal
        title='Geolocation Error'
        content={`Failed to obtain geolocation.\nPlease reload the page.`}
        onClose={closeModal}
      />
    );
  }, []);

  useEffect(() => {
    (async () => {
      const result = await getCurrentPosition();
      switch (result) {
        case GEO_ERROR_UNSUPPORTED: {
          openUnsupportedErrorModal();
          break;
        }
        case GEO_ERROR_PERMISSION: {
          openPermissionErrorModal();
          break;
        }
        case GEO_ERROR_OTHERS: {
          openOtherErrorModal();
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

  const onCloseModal = useCallback(() => {
    updateMapPhotos();
    closeModal();
  }, [updateMapPhotos, closeModal]);

  const onClickCreate = async () => {
    if (mapRef.current && currentPos) {
      mapRef.current.jumpTo({
        center: [currentPos.longitude, currentPos.latitude],
        zoom: MAX_ZOOM
      });
      toastUploadPhotoMessage();
      await sleep(1.5);
      openModal(<UploadModal currentPos={currentPos} mapRef={mapRef} onClose={onCloseModal} />);
    } else {
      openOtherErrorModal();
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
        openPermissionErrorModal();
      } else {
        openOtherErrorModal();
      }
    },
    [openPermissionErrorModal, openOtherErrorModal]
  );

  const onClickExploreButton = useCallback(async () => {
    const mapPhotos = await fetchMapPhotos();
    if (mapPhotos.length === 0) {
      toastNoPhotosError();
    } else {
      openModal(
        <PhotoModal mapPhotos={mapPhotos.reverse()} mapRef={mapRef} onClose={onCloseModal} />
      );
    }
  }, [mapRef.current, openModal, PhotoModal, onCloseModal]);

  const openAboutModal = useCallback(() => {
    openModal(<AboutModal onClose={closeModal} />);
  }, []);

  const openTermsModal = useCallback(() => {
    openModal(<TermsModal onClose={closeModal} />);
  }, []);

  const openPrivacyModal = useCallback(() => {
    openModal(<PrivacyModal onClose={closeModal} />);
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
      <Header onClick={openAboutModal} />
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
          <CurrentPosMarker
            currentPos={currentPos}
            draggable={import.meta.env.VITE_PROJECT_ID === 'photomap24-dev'}
            onDragEnd={onMarkerDragEnd}
          />
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
        onClickHowToUse={openAboutModal}
        onClickTerms={openTermsModal}
        onClickPrivacy={openPrivacyModal}
      />
      <Toaster toastOptions={{ duration: 1500 }} />
    </div>
  );
};

export default App;
