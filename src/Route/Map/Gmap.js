/* eslint-disable no-undef */

export default class Gmap {
  #map;
  #markers;

  constructor(map) {
    this.#map = map;
    this.#markers = new Map();
  }

  static async create(mapElementRef, gMapsData) {
    const { Map } = await google.maps.importLibrary("maps");

    const map = new Map(mapElementRef, {
      center: { lat: gMapsData.lat, lng: gMapsData.lng },
      zoom: 14,
      mapId: "4504f8b37365c3d0",
    });

    return new Gmap(map);
  }

  // lat, lng, place_id
  async addMarkers(stops) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    for (const stop of stops) {
      const {
        gMapsData: { lat, lng, place_id },
      } = stop;

      if (!this.#markers.has(place_id)) {
        this.#markers.set(
          // key
          place_id,
          // value
          new AdvancedMarkerElement({
            map: this.#map,
            position: { lat, lng },
          })
        );
      }
    }
  }

  fitBounds() {
    const bounds = new google.maps.LatLngBounds();

    this.#markers.values().forEach((marker) => {
      bounds.extend(marker.position);
    });

    this.#map.fitBounds(bounds)
  }
}
