import React from 'react';
import './Map.css';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import { showCirclesOnMap } from '../util';


function Map({countries, casesType, center, zoom}) {
  //console.log('In map comp: '+ casesType);
  return (
    <div className='map'>
        <LeafletMap center={center} zoom={zoom}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {showCirclesOnMap(countries, casesType)}
        </LeafletMap>
    </div>
  )
}

export default Map
