import React from 'react';
import AppBar from './components/AppBar'
import './App.css';
import 'nprogress/nprogress.css'
import Layout from './Layout'

// const sorter = (a, b) => {
//   if (a > b) {
//     return 1
//   } else if (a < b) {
//     return -1
//   } else {
//     return 0
//   }
// }
// const calculateBounds = (markers, frame = 0) => {
//   const positions = Object.keys(markers).map(markerIndex => markers[markerIndex].position)
//   console.log(positions)
//   const lats = positions.map(ll => ll[0])
//   const lons = positions.map(ll => ll[1])
//   lats.sort(sorter)
//   lons.sort(sorter)
//   console.log(lats, lons)
//   const b = {
//     northeast: { lat: lats.pop() + frame, lng: lons.pop() + frame },
//     southwest: { lat: lats[0] - frame, lng: lons[0] - frame }
//   }
//   return [
//     [b.northeast.lat, b.northeast.lng],
//     [b.southwest.lat, b.southwest.lng]
//   ]
// }
class App extends React.PureComponent {
  // constructor (props) {
  //   super(props)
  //   this.state = {
  //     markers: {},
  //     mapParams: {
  //       center: [-35.5, -57],
  //       bounds: false
  //     },
  //     key: '',
  //     geocoding: false
  //   }
  //   this.handleGeocode = this.handleGeocode.bind(this)
  //   this.handleMegaGeocode = this.handleMegaGeocode.bind(this)
  //   this.handleZoomToGeom = this.handleZoomToGeom.bind(this)
  //   this.setKey = this.setKey.bind(this)
  // }
  // handleZoomToGeom (geom) {
  //   if (!geom) return this.zoomToMarkers()
  //   this.setState({
  //     mapParams: {
  //       ...this.state.mapParams,
  //       center: [geom.location.lat, geom.location.lng],
  //       bounds: [
  //         [geom.viewport.northeast.lat, geom.viewport.northeast.lng],
  //         [geom.viewport.southwest.lat, geom.viewport.southwest.lng]
  //       ]
  //     }
  //   })
  // }
  // zoomToMarkers () {
  //   if (Object.keys(this.state.markers).length < 2) return
  //   const bounds = calculateBounds(this.state.markers, 0.1)
  //   this.setState({
  //     mapParams: {
  //       ...this.state.mapParams,
  //       center: [
  //         (bounds[0][0] + bounds[1][0]) / 2,
  //         (bounds[0][1] + bounds[1][1]) / 2
  //       ],
  //       bounds
  //     }
  //   })
  // }
  // handleGeocode (row, geom) {
  //   const markers = {...this.state.markers}
  //   markers[row.__rowNum__] = {
  //     rowNum: row.__rowNum__,
  //     address: row.address,
  //     position: [geom.location.lat, geom.location.lng]
  //   }
  //   this.setState({markers})
  // }
  // handleMegaGeocode (status) {
  //   if (status === this.state.geocoding) {
  //     return
  //   }
  //   const s = { geocoding: status }
  //   if (status) {
  //     s.markers = {}
  //   }
  //   this.setState(s)
  // }
  // setKey (key) {
  //   this.setState({key})
  // }
  render() {
    return (
      <div className="App">
        <AppBar />
        <Layout />
      </div>
    );
  }
}

export default App;
