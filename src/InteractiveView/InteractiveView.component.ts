import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Loader, LoaderOptions} from 'google-maps';
import { Cartesian2, Cartesian3, Cartesian4, Cartographic, Cesium3DTileStyle, Cesium3DTileset, CircleEmitter, CloudCollection, Color, ConstantProperty, Ellipsoid, HeightReference, ImageryLayer, JulianDate, Matrix4, OpenStreetMapImageryProvider, ParticleSystem, PolygonHierarchy, RequestScheduler, SceneMode, SphereEmitter, Terrain, Viewer, createWorldTerrainAsync, sampleTerrainMostDetailed, viewerDragDropMixin } from "cesium";

interface AirQuality {
  indexes: {
    color: {
      red: number,
      green: number,
      blue: number,
    }
  }[]

}


@Component({
  selector: 'app-InteractiveView',
  standalone: true,
  imports: [
    HttpClientModule
  ],
  templateUrl: './InteractiveView.component.html',
  styleUrls: ['./InteractiveView.component.css']
})
export class InteractiveViewComponent implements OnInit {

  placeCoord!: Cartesian3[];
  clouds!: CloudCollection;
  viewer!: Viewer;
  key = process.env['GOOGLE_MAPS_API_KEY'] || "";
  google: any;
  constructor(
    private http: HttpClient
  ) {

  }


  async ngOnInit() {
    console.log(this.key);
    const googleMapsLoader = new Loader(this.key, {
      version: "weekly",
      libraries: [
        "places",
      ],
    });
    this.google = await googleMapsLoader.load();

    this.viewer = new Viewer('viewer', {
      sceneMode: SceneMode.SCENE3D,
      terrain: Terrain.fromWorldTerrain(),
      geocoder: false,
      baseLayerPicker: false,
      requestRenderMode: true,
      navigationHelpButton: false,
      homeButton: false,
      projectionPicker: false,
      scene3DOnly: true,
      timeline: false,
      vrButton: false,
      infoBox: false,
      animation: false,
    });

    // Add basic drag and drop functionality
    this.viewer.extend(viewerDragDropMixin);

    RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;

    const tileset = await Cesium3DTileset
      .fromUrl(`https://tile.googleapis.com/v1/3dtiles/root.json?key=${this.key}`);

    tileset.showCreditsOnScreen = true;
    this.viewer.scene.primitives.add(tileset);
    this.viewer.scene.globe.show = false;
    this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;

    this.initAutocomplete()


  }

  zoomToViewport(viewport: any) {
    const coord = Cartesian3.fromDegreesArray([
      viewport.getNorthEast().lng(), viewport.getNorthEast().lat(),
      viewport.getSouthWest().lng(), viewport.getNorthEast().lat(),
      viewport.getSouthWest().lng(), viewport.getSouthWest().lat(),
      viewport.getNorthEast().lng(), viewport.getSouthWest().lat(),
      viewport.getNorthEast().lng(), viewport.getNorthEast().lat(),
    ]);

    this.placeCoord = coord;

    this.viewer.entities.add({
      polyline: {
        positions: coord,
        width: 10,
        clampToGround: true,
        material: Color.BLUE,
      },
    });
    console.log(viewport);

    this.viewer.flyTo(this.viewer.entities);
    // this.viewer.camera.flyTo(this.viewer.entities)
    this.viewer.zoomTo(this.viewer.entities);
    // this.viewer.camera.flyTo({destination: coord[3]})
    console.log(this.viewer.camera.position)
    // this.viewer.camera.lookAt(coord[3], new Cartesian3(0, 0, 0));
  }

  //

  initAutocomplete() {
    console.log("initAutocomplete");
    const autocomplete = new this.google.maps!.places.Autocomplete(
      document.getElementById("pacViewPlace") as HTMLInputElement,
      {
        fields: [
          "geometry",
          "name",
        ],
      }
    );


    autocomplete.addListener("place_changed", () => {
      console.log("place_changed");
      this.viewer.entities.removeAll();
      const place = autocomplete.getPlace();
      const geocoder = new this.google.maps.Geocoder();
      console.log(place);
      geocoder.geocode({
        location: place.geometry!.location,
      }, (results: any, status: any) => {
        if (status == this.google.maps.GeocoderStatus.OK) {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          this.http.post(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${this.key}`, {
            location: {
              longitude,
              latitude,
            }
          })
            .subscribe(async (data) => {
              console.log(data);
              // this.viewer.entities.add({
              //   polygon: {
              //     hierarchy: new PolygonHierarchy(
              //       Cartesian3.fromDegreesArray([
              //         longitude + 0.001, latitude + 0.001,
              //         longitude - 0.001, latitude + 0.001,
              //         longitude - 0.001, latitude - 0.001,
              //         longitude + 0.001, latitude - 0.001,
              //       ])
              //     ),
              //     material: Color.RED.withAlpha(0.5),
              //     height: 3,
              //     heightReference: HeightReference.CLAMP_TO_GROUND,
              //   }
              // });
              this.clouds?.removeAll();
              this.clouds = this.viewer.scene.primitives.add(new CloudCollection({
                // translucent: true,
                // modelMatrix: Matrix4.IDENTITY
                show: true,
              }));
              const color = (data as AirQuality).indexes[0].color;
              console.log(color);
              const terrainDetail = await sampleTerrainMostDetailed(this.viewer.terrainProvider, [Cartographic.fromDegrees(longitude, latitude)]);
              this.clouds.add({
                position: Cartesian3.fromDegrees(longitude, latitude, terrainDetail[0].height + 150),
                color: new Color(color.red||0, color.green||0, color.blue||0, 1),
                direction: new Cartesian3(0, 0, -1),
                scale : new Cartesian2(1000.0, 300.0),
                // maximumSize: new Cartesian3(300.0, 300.0, 100.0),
              });
            });

        }
      });
      this.zoomToViewport(place.geometry!.viewport);



      // this.http.get()
      if (!place.geometry || !place.geometry.viewport) {
        window.alert("No viewport for input: " + place.name);
        return;
      }
    });
  }

}
