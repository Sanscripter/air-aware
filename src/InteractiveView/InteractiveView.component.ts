import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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

  @Input() placeCoords: any;
  @Input() key: string = "";

  clouds!: CloudCollection;
  viewer!: Viewer;
  constructor(
    private http: HttpClient
  ) {

  }


  async ngOnInit() {

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


    RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;
    const tileset = await Cesium3DTileset
      .fromUrl(`https://tile.googleapis.com/v1/3dtiles/root.json?key=${this.key}`);

    tileset.showCreditsOnScreen = true;
    this.viewer.scene.primitives.add(tileset);
    this.viewer.scene.globe.show = false;
    this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;

    this.zoomToViewport();

  }

  zoomToViewport() {
    console.log("zoomToViewport", this.placeCoords);
    var squareSizeDegrees = 0.001; // Adjust as needed
    this.viewer.entities.removeAll();

    const coord = Cartesian3.fromDegreesArray([
      this.placeCoords.longitude + squareSizeDegrees / 2, this.placeCoords.latitude + squareSizeDegrees / 2,
      this.placeCoords.longitude - squareSizeDegrees / 2, this.placeCoords.latitude + squareSizeDegrees / 2,
      this.placeCoords.longitude + squareSizeDegrees / 2, this.placeCoords.latitude - squareSizeDegrees / 2,
      this.placeCoords.longitude - squareSizeDegrees / 2, this.placeCoords.latitude - squareSizeDegrees / 2,
    ]);

    this.viewer.entities.add({
      polyline: {
        positions: coord,
        width: 10,
        clampToGround: true,
        material: Color.BLUE,
      },
    });

    this.viewer.flyTo(this.viewer.entities);
    this.viewer.zoomTo(this.viewer.entities);

  }

  //

  // initAutocomplete() {
  //   console.log("initAutocomplete");


  //     this.zoomToViewport(place.geometry!.viewport);



  //     // this.http.get()
  //     if (!place.geometry || !place.geometry.viewport) {
  //       window.alert("No viewport for input: " + place.name);
  //       return;
  //     }
  //   });
  // }

}
