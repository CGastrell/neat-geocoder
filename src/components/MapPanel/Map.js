import React from 'react'
import PropTypes from 'prop-types'
import 'leaflet/dist/leaflet.css'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { connect } from 'react-redux'
import { receiveGeocode } from '../../actions/file'
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

const FeatureMarker = props => {
  const { rowNum, position, address, onDragEnd } = props
  return (
    <Marker draggable={true} onDragEnd={onDragEnd} position={position}>
      <Popup>#{rowNum} - {address}</Popup>
    </Marker>
  )
}
// const position = [-35.5, -57]
class MapPanel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleDragEnd = this.handleDragEnd.bind(this)
  }
  handleDragEnd (rowIndex) {
    return event => {
      const geom = {
        location: {
          lat: event.target._latlng.lat,
          lng: event.target._latlng.lng
        }
      }
      this.props.receiveGeocode(null, geom, rowIndex)
    }
  }
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
              <FeatureMarker
                key={rowMarker}
                rowNum={rowMarker}
                onDragEnd={this.handleDragEnd(marker.rowIndex)}
                address={marker.address}
                position={marker.position} />
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

const mapStateToProps = state => {
  return {
    mapParams: state.mapParams,
    markers: state.markers
  }
}
const mapDispatchToProps = dispatch => {
  return {
    receiveGeocode: (row, geom, rowIndex) => dispatch(receiveGeocode(row, geom, rowIndex))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MapPanel)
