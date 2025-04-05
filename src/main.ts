import './style.css'

import { PerspectiveCamera, Scene, MeshBasicMaterial, BoxGeometry, Mesh, WebGLRenderer } from 'three'
const width = window.innerWidth, height = window.innerHeight;

/**
* 基础组件代码初始化
*/
const scene = new Scene();
const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);



/**
* 基本设置部分
*/
scene.add(camera)
camera.position.set(66, 66, 66)
camera.lookAt(0, 0, 0)


const renderer = new WebGLRenderer()
renderer.setSize(width, height)
function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

document.addEventListener('DOMContentLoaded', () => {
  animate()
  document.body.querySelector('#app')?.appendChild(renderer.domElement)
})







/**
 * 场景内容
*/
const baseMaterial = new MeshBasicMaterial({
  color: 0x00ff00
})
const baseGeometry = new BoxGeometry(20, 20, 20)
const baseMesh = new Mesh(baseGeometry, baseMaterial)
scene.add(baseMesh)




