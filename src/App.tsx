import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { GeolocateControl, GeolocateErrorEvent, Map, MapRef } from 'react-map-gl';
import { fetchMapPhotos } from './apis/fetchMapPhotos';
import CreateButton from './components/buttons/CreateButton';
import ExploreButton from './components/buttons/ExploreButton';
import { AboutModal } from './components/modals/AboutModal';
import { ErrorModal } from './components/modals/ErrorModal';
import { PhotoModal } from './components/modals/PhotoModal';
import { PrivacyModal } from './components/modals/PrivacyModal';
import { TermsModal } from './components/modals/TermsModal';
import { UploadModal } from './components/modals/UploadModal';
import Footer from './components/templates/Footer';
import Header from './components/templates/Header';
import {
  DEFAULT_POS,
  DEFAULT_ZOOM,
  GET_CURRENT_POSITION_TIME_OUT,
  MAP_STYLE_URL,
  MAX_ZOOM,
  MIN_ZOOM
} from './constants';
import { useClusterPhotos } from './hooks/useClusterPhotos';
import { useModalContext } from './providers/ModalProvider';
import { toastNoPhotosError } from './utils/toastMessages';

const App = () => {
  const { openModal, closeModal } = useModalContext();

  const mapRef = useRef<MapRef>(null);
  const { onMapLoad, updateMapPhotos, PhotoMarkers } = useClusterPhotos(mapRef);

  const openGeoPermissionErrorModal = useCallback(() => {
    openModal(
      <ErrorModal
        title='Geolocation Error'
        content={`User denied geolocation.\nPlease allow use of geolocation.`}
        onClose={closeModal}
      />
    );
  }, []);

  const openGeoObtainErrorModal = useCallback(() => {
    openModal(
      <ErrorModal
        title='Geolocation Error'
        content={`Failed to obtain geolocation.\nPlease reload the page.`}
        onClose={closeModal}
      />
    );
  }, []);

  useEffect(() => {
    updateMapPhotos();
  }, []);

  const onCloseModal = useCallback(() => {
    updateMapPhotos();
    closeModal();
  }, [updateMapPhotos, closeModal]);

  const onGeolocateError = useCallback(
    (err: GeolocateErrorEvent) => {
      if (err.code === err.PERMISSION_DENIED) {
        openGeoPermissionErrorModal();
      } else {
        openGeoObtainErrorModal();
      }
    },
    [openGeoPermissionErrorModal, openGeoObtainErrorModal]
  );

  const onClickCreate = () => {
    openModal(
      <UploadModal mapRef={mapRef} onGeolocateError={onGeolocateError} onClose={onCloseModal} />
    );
  };

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
        initialViewState={{
          longitude: DEFAULT_POS.lng,
          latitude: DEFAULT_POS.lat,
          zoom: DEFAULT_ZOOM
        }}
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
        <GeolocateControl
          positionOptions={{
            timeout: GET_CURRENT_POSITION_TIME_OUT,
            enableHighAccuracy: true
          }}
          showUserLocation={true}
          trackUserLocation={true}
          position='bottom-left'
          fitBoundsOptions={{ maxZoom: MAX_ZOOM }}
          onError={onGeolocateError}
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
