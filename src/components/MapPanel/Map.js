import React from 'react'
import PropTypes from 'prop-types'
import 'leaflet/dist/leaflet.css'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

// const position = [-35.5, -57]
class MapPanel extends React.PureComponent {
  render () {
    const params = this.props.mapParams.bounds
      ? {bounds: this.props.mapParams.bounds}
      : {center: this.props.mapParams.center, zoom: 6}
    return (
      <Map {...params} style={{width: '100%', height: '100%'}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {
          Object.keys(this.props.markers).map(rowMarker => {
            let marker = this.props.markers[rowMarker]
            return (
              <Marker key={marker.rowNum} position={marker.position}>
                <Popup>{marker.address}</Popup>
              </Marker>
            )
          })
        }
      </Map>
    )
  }
}

MapPanel.propTypes = {
  markers: PropTypes.object.isRequired,
  mapParams: PropTypes.object.isRequired
}

export default MapPanel
