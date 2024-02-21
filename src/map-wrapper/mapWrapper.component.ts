import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnChanges } from '@angular/core';
import { BoundingSphere, Cartesian3, Cartographic, Cesium3DTileset, CircleEmitter, CloudCollection, Color, ConstantProperty, Ellipsoid, HeadingPitchRange, HeightReference, ImageryLayer, JulianDate, Matrix4, OpenStreetMapImageryProvider, ParticleSystem, PolygonHierarchy, RequestScheduler, SampledPositionProperty, SceneMode, SphereEmitter, Terrain, Viewer, createWorldTerrainAsync, sampleTerrainMostDetailed, viewerDragDropMixin } from "cesium";
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
export class MapWrapperComponent implements OnChanges {

  @Input() set placeCoords(value: any) {
    if (!value) return;
    this._placeCoords = value;
  };
  @Input() key: string = "";
  @Input() airQuality?: AirQuality | null = null;

  tileset!: Cesium3DTileset;
  squareSizeDegrees = Number(process.env['ENTITY_SQUARE_SIZE_DEGREES']);
  polylineWidth = Number(process.env['POLYLINE_WIDTH']);
  cameraDistance = Number(process.env['CAMERA_DISTANCE']);
  cameraHeightOffset = Number(process.env['CAMERA_HEIGHT_OFFSET']);
  cameraPitchDegrees = Number(process.env['CAMERA_PITCH_DEGREES']);
  cameraHeadingDegrees = Number(process.env['CAMERA_HEADING_DEGREES']);
  flyAnimationDurationSeconds = Number(process.env['FLY_ANIMATION_DURATION_SECONDS']);
  cloudHeight = Number(process.env['CLOUD_HEIGHT']);
  cameraAnimationRange = {
    right: Number(process.env['CAMERA_ANIMATION_RANGE_RIGHT']),
    left: Number(process.env['CAMERA_ANIMATION_RANGE_LEFT']),
    up: Number(process.env['CAMERA_ANIMATION_RANGE_UP']),
    down: Number(process.env['CAMERA_ANIMATION_RANGE_DOWN']),
  }

  _placeCoords: any;
  clouds!: CloudCollection;
  terrainDetail!: any;
  viewer!: Viewer;

  async ngOnInit() {
    await this.setupViewer();
  }

  async ngOnChanges() {
    if (!this.viewer) return;
    await this.zoomToViewport();
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
    RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;
    this.tileset = await Cesium3DTileset.fromUrl(`https://tile.googleapis.com/v1/3dtiles/root.json?key=${this.key}`);
    this.tileset.showCreditsOnScreen = true;
    this.viewer.scene.primitives.add(this.tileset);
    this.viewer.scene.globe.show = false;
    this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
    this.viewer.scene.screenSpaceCameraController.enableRotate = false;
    this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
    this.viewer.scene.screenSpaceCameraController.enableZoom = false;
    this.viewer.scene.screenSpaceCameraController.enableTilt = false;
    this.viewer.scene.screenSpaceCameraController.enableLook = false;

  }

  async zoomToViewport() {
    this.viewer?.entities.removeAll();
    const centerX = this._placeCoords?.longitude;
    const centerY = this._placeCoords?.latitude;

    const coord = Cartesian3.fromDegreesArray([
      this._placeCoords.longitude + this.squareSizeDegrees / 2, this._placeCoords.latitude + this.squareSizeDegrees / 2,
      this._placeCoords.longitude - this.squareSizeDegrees / 2, this._placeCoords.latitude + this.squareSizeDegrees / 2,
      this._placeCoords.longitude - this.squareSizeDegrees / 2, this._placeCoords.latitude - this.squareSizeDegrees / 2,
      this._placeCoords.longitude + this.squareSizeDegrees / 2, this._placeCoords.latitude - this.squareSizeDegrees / 2,
    ]);

    const boundingSphere = new BoundingSphere();
    boundingSphere.center = Cartesian3.fromDegrees(centerX, centerY);
    boundingSphere.radius = Cartesian3.distance(
      Cartesian3.fromDegrees(centerX + this.squareSizeDegrees / 2, centerY + this.squareSizeDegrees / 2),
      Cartesian3.fromDegrees(centerX - this.squareSizeDegrees, centerY - this.squareSizeDegrees)
    );

    this.renderQualityColor();

    const destination = await this.defineCameraDestination();
    this.viewer.camera.flyTo({
      destination,
      orientation: {
        heading: this.degreesToRadians(this.cameraHeadingDegrees),
        pitch: this.degreesToRadians(this.cameraPitchDegrees),
      },
      duration: this.flyAnimationDurationSeconds
    });

    this.viewer.zoomTo(this.viewer.entities, new HeadingPitchRange(this.degreesToRadians(this.cameraHeadingDegrees), this.degreesToRadians(this.cameraPitchDegrees), boundingSphere.radius));
    this.viewer.clock.onTick.addEventListener(() => {
      this.animateCamera();
    });
  }

  renderQualityColor() {
    const color = this.airQuality?.indexes[0]?.color || { red: 0, green: 0, blue: 0 };
    const accountedDistance = this.metersToDegrees(3000);
    const polygon = this.viewer.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(
          Cartesian3.fromDegreesArray([
            this._placeCoords.longitude + accountedDistance, this._placeCoords.latitude + accountedDistance,
            this._placeCoords.longitude - accountedDistance, this._placeCoords.latitude + accountedDistance,
            this._placeCoords.longitude - accountedDistance, this._placeCoords.latitude - accountedDistance,
            this._placeCoords.longitude + accountedDistance, this._placeCoords.latitude - accountedDistance,
          ])
        ),
        material: new Color(color.red, color.green, color.blue, 0.5),
      },
    });
    this.clouds = new CloudCollection();
  }

  async defineCameraDestination(): Promise<Cartesian3> {
    const initialPosition = Cartesian3.fromDegrees(this._placeCoords.longitude, this._placeCoords.latitude - this.cameraDistance, 0);
    this.terrainDetail = await sampleTerrainMostDetailed(this.viewer.terrainProvider, [Cartographic.fromCartesian(initialPosition)])
    const heightWithOffset = this.terrainDetail[0].height + this.cameraHeightOffset;
    return Cartesian3.fromDegrees(this._placeCoords.longitude, this._placeCoords.latitude - this.cameraDistance, heightWithOffset);
  }

  animateCamera() {
    this.viewer.camera.lookRight(this.cameraAnimationRange.right * Math.random());
    this.viewer.camera.lookLeft(this.cameraAnimationRange.left * Math.random());
    this.viewer.camera.lookUp(this.cameraAnimationRange.up * Math.random());
    this.viewer.camera.lookDown(this.cameraAnimationRange.down * Math.random());
  }

  degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  metersToDegrees(meters: number) {
    return meters / 111139;
  }

}
