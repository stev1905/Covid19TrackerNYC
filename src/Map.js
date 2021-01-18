import React from 'react';
import './Map.css';
import { Map as MapLeaflet, TileLayer } from 'react-leaflet';
import { showDataMap } from './util';

const Map = ({countries, casesType, center, zoom}) => {
    return (
        <div className="map">
        {console.log('Map',center)}
            <MapLeaflet center={center} zoom={zoom} >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {showDataMap(countries, casesType)}
            </MapLeaflet>
        </div>
    ); 
}

export default Map;