import {Scene} from "@babylonjs/core/scene";
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import {UniversalCamera} from "@babylonjs/core/Cameras/universalCamera";
import {Engine} from "@babylonjs/core/Engines/engine";
import {Color3, MeshBuilder, Vector3} from "@babylonjs/core";

const canvas = <HTMLCanvasElement>document.createElement("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
document.body.appendChild(canvas);

const engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})
const scene = new Scene(engine);

const camera = new UniversalCamera('camera', new Vector3(0, 1.6, 0), scene);
camera.minZ = 0.2;
camera.setTarget(new Vector3(0, 1.6, -1));
camera.attachControl(canvas);
// Disable camera zoom and rotation in Oculus Browser in 2D mode:
camera.inputs.removeByType("FreeCameraTouchInput");

new HemisphericLight('light', new Vector3(0, 1, 0), scene);

const sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position = new Vector3(0, 1.2, -5);

// 3D Environment
const environment = scene.createDefaultEnvironment({
    enableGroundShadow: false,
    createGround: true,
    groundOpacity: 0,
    createSkybox: true
});
if (!environment) {
    throw new Error("Cannot create environment");
}
environment.setMainColor(Color3.FromHexString("#333333"));

(async () => {
    const ground = MeshBuilder.CreateGround('ground', {width: 1, height: 1, updatable: true}, scene);
    const xrHelper = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [ground],
        disableTeleportation: true,
        ignoreNativeCameraTransformation: true,
        useStablePlugins: true
    });

    if (!xrHelper.baseExperience) {
        throw new Error("XR mode is not supported");
    }

    engine.runRenderLoop(() => scene.render());
})();
