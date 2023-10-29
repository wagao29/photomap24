import { useCallback, useState } from 'react';
import { MapRef, Marker } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import { fetchMapPhotos } from '../apis/fetchMapPhotos';
import MapPhotoThumbnail from '../components/MapPhotoThumbnail';
import { PhotoDialog } from '../components/PhotoDialog';
import {
  CLUSTER_RADIUS,
  DEFAULT_ZOOM,
  MAX_MAP_PHOTO_COUNT,
  MAX_ZOOM,
  MAX_ZOOM_DIALOG_BG
} from '../constants';
import { useDialogContext } from '../providers/DialogProvider';
import { Coordinates, MapPhoto } from '../types';

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
      // 最初の表示で bounds をセットするために一度実行する
      updateMap();
      mapRef.current.on('moveend', updateMap);
    }
  }, [updateMap]);

  const setMapPos = useCallback(
    (pos: Coordinates) => {
      if (mapRef.current) {
        mapRef.current.jumpTo({
          center: [pos.longitude, pos.latitude],
          zoom: MAX_ZOOM_DIALOG_BG
        });
      }
    },
    [mapRef.current]
  );

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
        const photoIds = supercluster
          .getLeaves(cluster.id, MAX_MAP_PHOTO_COUNT, 0)
          // 作成日時が新しい順に並び替える
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((pointA: any, pointB: any) => {
            return pointA.properties.date > pointB.properties.date ? -1 : 1;
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((point: any) => {
            return point.properties.id;
          });
        const center = mapRef.current?.getCenter();
        const zoom = mapRef.current?.getZoom();
        const onClose = () => {
          closeDialog();
          mapRef.current?.jumpTo({
            center: center,
            zoom: zoom
          });
        };
        openDialog(<PhotoDialog photoIds={photoIds} setMapPos={setMapPos} onClose={onClose} />);
      };
      return (
        <Marker key={cluster.id} latitude={latitude} longitude={longitude} onClick={onClick}>
          <MapPhotoThumbnail points={supercluster.getLeaves(cluster.id, MAX_MAP_PHOTO_COUNT, 0)} />
        </Marker>
      );
    } else {
      const onClick = () => {
        const center = mapRef.current?.getCenter();
        const zoom = mapRef.current?.getZoom();
        const onClose = () => {
          closeDialog();
          mapRef.current?.jumpTo({
            center: center,
            zoom: zoom
          });
        };
        openDialog(
          <PhotoDialog photoIds={[cluster.properties.id]} setMapPos={setMapPos} onClose={onClose} />
        );
      };
      return (
        <Marker
          key={cluster.properties.id}
          latitude={latitude}
          longitude={longitude}
          onClick={onClick}
        >
          <MapPhotoThumbnail points={[cluster]} />
        </Marker>
      );
    }
  });

  return { onMapLoad, updateMapPhotos, PhotoMarkers };
};
