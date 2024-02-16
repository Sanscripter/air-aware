import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BoundingSphere, Cartesian3, Cesium3DTileset, CircleEmitter, CloudCollection, Color, ConstantProperty, Ellipsoid, HeadingPitchRange, HeightReference, ImageryLayer, JulianDate, Matrix4, OpenStreetMapImageryProvider, ParticleSystem, PolygonHierarchy, RequestScheduler, SampledPositionProperty, SceneMode, SphereEmitter, Terrain, Viewer, createWorldTerrainAsync, sampleTerrainMostDetailed, viewerDragDropMixin } from "cesium";
import { AirQuality } from '../services/maps.service';



@Component({
  selector: 'map-wrapper',
  standalone: true,
  imports: [
    HttpClientModule
  ],
  templateUrl: './mapWrapper.component.html',
  styleUrls: ['./mapWrapper.component.css']
})
export class MapWrapperComponent implements AfterViewInit {

  @Input() set placeCoords(value: any) {
    this._placeCoords = value;
    this.zoomToViewport();
  };
  @Input() key: string = "";
  @Input() airQuality?: AirQuality;

  _placeCoords: any;
  clouds!: CloudCollection;
  viewer!: Viewer;

  async ngAfterViewInit() {
    await this.setupViewer();
    this.zoomToViewport();
  }

  async setupViewer() {
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
    console.log("setupViewer", this.key);
    RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;
    const tileset = await Cesium3DTileset
      .fromUrl(`https://tile.googleapis.com/v1/3dtiles/root.json?key=${this.key}`);

    tileset.showCreditsOnScreen = true;
    this.viewer.scene.primitives.add(tileset);
    this.viewer.scene.globe.show = false;
    this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
    this.viewer.scene.screenSpaceCameraController.enableRotate = false;
    this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
    this.viewer.scene.screenSpaceCameraController.enableZoom = false;
    this.viewer.scene.screenSpaceCameraController.enableTilt = false;
    this.viewer.scene.screenSpaceCameraController.enableLook = false;
  }

  zoomToViewport() {
    const squareSizeDegrees = 0.001; // Adjust as needed
    const centerX = this._placeCoords.longitude;
    const centerY = this._placeCoords.latitude;
    this.viewer.entities.removeAll();

    const coord = Cartesian3.fromDegreesArray([
      this._placeCoords.longitude + squareSizeDegrees / 2, this._placeCoords.latitude + squareSizeDegrees / 2,
      this._placeCoords.longitude - squareSizeDegrees / 2, this._placeCoords.latitude + squareSizeDegrees / 2,
      this._placeCoords.longitude - squareSizeDegrees / 2, this._placeCoords.latitude - squareSizeDegrees / 2,
      this._placeCoords.longitude + squareSizeDegrees / 2, this._placeCoords.latitude - squareSizeDegrees / 2,
    ]);


    this.viewer.entities.add({
      polyline: {
        positions: coord,
        width: 10,
        clampToGround: true,
        material: Color.BLUE,
      },
    });

    const boundingSphere = new BoundingSphere();
    boundingSphere.center = Cartesian3.fromDegrees(centerX, centerY);
    boundingSphere.radius = Cartesian3.distance(
      Cartesian3.fromDegrees(centerX + squareSizeDegrees / 2, centerY + squareSizeDegrees / 2),
      Cartesian3.fromDegrees(centerX - squareSizeDegrees, centerY - squareSizeDegrees)
    );

    // Zoom closer to the square and focus on it with animation
    const distance = 300; // Adjust the distance from the square
    this.viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(centerX, centerY - squareSizeDegrees * 4, distance),
      orientation: {
        heading: this.degreesToRadians(0), // Adjust the heading as needed
        pitch: this.degreesToRadians(-20), // Adjust the pitch as needed
        roll: 0, // Adjust the roll as needed,
      },
      duration: 6 // Animation duration in seconds
    });
    this.viewer.zoomTo(this.viewer.entities, new HeadingPitchRange(100, 2, boundingSphere.radius));
    this.viewer.clock.onTick.addEventListener((clock) => {
        this.viewer.camera.lookRight(0.0001 * Math.random());
        this.viewer.camera.lookLeft(0.0001 * Math.random());
        this.viewer.camera.lookUp(0.0001 * Math.random());
        this.viewer.camera.lookDown(0.0001 * Math.random());
    });
  }

  degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

}
