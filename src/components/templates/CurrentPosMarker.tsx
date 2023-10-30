import { memo } from 'react';
import { Marker, MarkerDragEvent } from 'react-map-gl';
import { Coordinates } from '../../types';
import iconCurrentPosition from '../../assets/icon_current_position.svg';

type Props = {
  currentPos: Coordinates;
  draggable: boolean;
  onDragEnd: (event: MarkerDragEvent) => void;
};

const CurrentPosMarker = memo(function CurrentPosMarker({
  currentPos,
  draggable,
  onDragEnd
}: Props) {
  return (
    <Marker
      latitude={currentPos.latitude}
      longitude={currentPos.longitude}
      draggable={draggable}
      onDragEnd={onDragEnd}
    >
      <img src={iconCurrentPosition} width={30} height={30} alt='' />
    </Marker>
  );
});

export default CurrentPosMarker;
