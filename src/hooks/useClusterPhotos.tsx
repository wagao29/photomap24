import { useCallback, useState } from 'react';
import { MapRef, Marker } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import { fetchMapPhotos } from '../apis/fetchMapPhotos';
import { PhotoModal } from '../components/modals/PhotoModal';
import Thumbnail from '../components/templates/Thumbnail';
import { CLUSTER_RADIUS, DEFAULT_ZOOM, MAX_MAP_PHOTO_COUNT, MAX_ZOOM } from '../constants';
import { useModalContext } from '../providers/ModalProvider';
import { MapPhoto } from '../types';

export const useClusterPhotos = (mapRef: React.RefObject<MapRef>) => {
  const { openModal, closeModal } = useModalContext();
  const [mapPhotos, setMapPhotos] = useState<MapPhoto[]>([]);
  const [bounds, setBounds] = useState<[number, number, number, number]>();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const updateMapPhotos = useCallback(async () => {
    const fetchedMapPhotos = await fetchMapPhotos();
    setMapPhotos(fetchedMapPhotos);
  }, []);

  const updateMap = useCallback(() => {
    if (mapRef.current) {
      const b = mapRef.current.getBounds();
      setBounds([
        b.getSouthWest().lng,
        b.getSouthWest().lat,
        b.getNorthEast().lng,
        b.getNorthEast().lat
      ]);
      setZoom(mapRef.current.getZoom());
    }
  }, [mapRef.current]);

  const onMapLoad = useCallback(() => {
    if (mapRef.current) {
      // Run updateMap() once on load to set bounds on first display
      updateMap();
      mapRef.current.on('moveend', updateMap);
    }
  }, [updateMap]);

  const onCloseModal = useCallback(() => {
    updateMapPhotos();
    closeModal();
  }, [updateMap, closeModal]);

  const points = mapPhotos.map((mapPhoto) => ({
    type: 'Feature',
    properties: { cluster: false, ...mapPhoto },
    geometry: {
      type: 'Point',
      coordinates: [mapPhoto.pos.longitude, mapPhoto.pos.latitude]
    }
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: CLUSTER_RADIUS, maxZoom: MAX_ZOOM }
  });

  const PhotoMarkers = clusters.map((cluster) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const { cluster: isCluster } = cluster.properties;
    if (isCluster) {
      const onClick = () => {
        if (mapRef.current?.getZoom() === MAX_ZOOM) {
          const mapPhotos: MapPhoto[] = supercluster
            .getLeaves(cluster.id, MAX_MAP_PHOTO_COUNT, 0)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .sort((pointA: any, pointB: any) => {
              return pointA.properties.date > pointB.properties.date ? -1 : 1;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((point: any) => {
              return {
                id: point.properties.id,
                pos: point.properties.pos,
                addr: point.properties.addr,
                date: point.properties.date
              };
            });
          openModal(<PhotoModal mapPhotos={mapPhotos} mapRef={mapRef} onClose={onCloseModal} />);
        } else {
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: Math.min(supercluster.getClusterExpansionZoom(cluster.id), MAX_ZOOM)
          });
        }
      };
      return (
        <Marker key={cluster.id} latitude={latitude} longitude={longitude} onClick={onClick}>
          <Thumbnail points={supercluster.getLeaves(cluster.id, MAX_MAP_PHOTO_COUNT, 0)} />
        </Marker>
      );
    } else {
      const onClick = () => {
        openModal(
          <PhotoModal
            mapPhotos={[
              {
                id: cluster.properties.id,
                pos: cluster.properties.pos,
                addr: cluster.properties.addr,
                date: cluster.properties.date
              }
            ]}
            mapRef={mapRef}
            onClose={onCloseModal}
          />
        );
      };
      return (
        <Marker
          key={cluster.properties.id}
          latitude={latitude}
          longitude={longitude}
          onClick={onClick}
        >
          <Thumbnail points={[cluster]} />
        </Marker>
      );
    }
  });

  return { onMapLoad, updateMapPhotos, PhotoMarkers };
};
