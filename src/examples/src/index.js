
import PhysicsWorld from './physics/world.js'

const Scene = require('Scene');

const sphere = Scene.root.find('SphereObject');
const cube = Scene.root.find('Cube01');
const plane = Scene.root.find('plane0')

const physicsWorld = new PhysicsWorld({ x: 0, y: -9.82, z:0 })

const sphereProps = {
  body: {
    mass: 1,
    radius: .01,
    transform: {
      position: {
        x: 0,
        y: 2, 
        z: 0
      }
    }
  }
}
const cubeProps = {
  body: {
    mass: 5,
    transform: {
      scale : {
        x: .01,
        y: .01,
        z: .01
      },
      position: {
        x: 0,
        y: 10, 
        z: 0
      },
      rotation: {
        x: .2,
        y: .8,
        z: .3,
        w: 0
      }
    }
  }
}
const groundProps = {
  body: {
    mass: 0,
    transform: {
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  }
}
physicsWorld.createObject(plane, 'ground', groundProps)
physicsWorld.createObject(sphere, 'sphere', sphereProps)
physicsWorld.createObject(cube, 'box', cubeProps)
physicsWorld.start()
