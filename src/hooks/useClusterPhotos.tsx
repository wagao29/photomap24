import { useCallback, useState } from 'react';
import { MapRef, Marker } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import { fetchMapPhotos } from '../apis/fetchMapPhotos';
import Thumbnail from '../components/templates/Thumbnail';
import { PhotoDialog } from '../components/dialogs/PhotoDialog';
import { CLUSTER_RADIUS, DEFAULT_ZOOM, MAX_MAP_PHOTO_COUNT, MAX_ZOOM } from '../constants';
import { useDialogContext } from '../providers/DialogProvider';
import { MapPhoto } from '../types';

export const useClusterPhotos = (mapRef: React.RefObject<MapRef>) => {
  const { openDialog, closeDialog } = useDialogContext();
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

  const onCloseDialog = useCallback(() => {
    updateMapPhotos();
    closeDialog();
  }, [updateMap, closeDialog]);

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
        openDialog(<PhotoDialog mapPhotos={mapPhotos} mapRef={mapRef} onClose={onCloseDialog} />);
      };
      return (
        <Marker key={cluster.id} latitude={latitude} longitude={longitude} onClick={onClick}>
          <Thumbnail points={supercluster.getLeaves(cluster.id, MAX_MAP_PHOTO_COUNT, 0)} />
        </Marker>
      );
    } else {
      const onClick = () => {
        openDialog(
          <PhotoDialog
            mapPhotos={[
              {
                id: cluster.properties.id,
                pos: cluster.properties.pos,
                addr: cluster.properties.addr,
                date: cluster.properties.date
              }
            ]}
            mapRef={mapRef}
            onClose={onCloseDialog}
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
