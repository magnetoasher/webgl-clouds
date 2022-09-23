import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Cloud from './Cloud'

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(168)
camera.position.set(8.0, -5.5, 8.0)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false

const cloud = new Cloud({
  cloudSize: new THREE.Vector3(0.5, 1.0, 0.5),
  sunPosition: new THREE.Vector3(1.0, 2.0, 1.0),
  cloudColor: new THREE.Color(0xeabf6b),
  skyColor: new THREE.Color(0x337fff),
  cloudSteps: 48,
  shadowSteps: 8,
  cloudLength: 16,
  shadowLength: 2,
  noise: false
})

const handleResize = () => {
  const dpr = Math.min(window.devicePixelRatio, 2)
  renderer.setPixelRatio(dpr)
  renderer.setSize(window.innerWidth, window.innerHeight)
  cloud.setSize(window.innerWidth * dpr, window.innerHeight * dpr)
  cloud.render(renderer, camera)
}
handleResize()
window.addEventListener('resize', handleResize)

let lastPolarAngle = 0
let lastAzimuthalAngle = 0

controls.addEventListener('change', () => {
  const polarAngle = controls.getPolarAngle()
  const azimuthalAngle = controls.getAzimuthalAngle()

  const rotationDelta = Math.abs(polarAngle - lastPolarAngle) + Math.abs(azimuthalAngle - lastAzimuthalAngle)
  cloud.regress = rotationDelta > 0.0002

  lastPolarAngle = polarAngle
  lastAzimuthalAngle = azimuthalAngle

  cloud.render(renderer, camera)
})

renderer.setAnimationLoop((time) => {
  controls.update()
  cloud.time = time / 1000
})
