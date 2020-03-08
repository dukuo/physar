import { generateUUID } from './utils'

export default class Physar {
  
  constructor( gravity ) {

      // Spark related
      this.Diagnostics = undefined
      this.Time = undefined
          this.currentInterval = undefined
          this.lastInterval = undefined
          this.lastTime = undefined
          this.fixedTimeStep = 1.0 / 60.0
          this.maxSubSteps = 3
          this.timeInterval = 5

      this.C = undefined
          // this.world = undefined

      // World related
      this.worldObjects = []
      this.worldConstraints = []

      // Defaults
      this.defaults = {
          body: {
              mass: 0,
              radius: 1,
              transform: {
                  rotation: {
                      x: 0,
                      y: 0,
                      z: 0,
                      w: 0.5 // C defaults to 1, don't really know why i'm setting it to 0.5 but we'll see.
                  },
                  position: {
                      x: 0,
                      y: 0,
                      z: 0
                  },
                  scale: {
                      x: 1,
                      y: 1,
                      z: 1
                  },
              }
          },
          sync: {
              properties: ['position', 'rotation'],
              axes: ['x', 'y', 'z'],
              rotation: {
                  enabled: true,
                  allAxis: true,
                  x: true,
                  y: true,
                  z: true
              },
              position: {
                  enabled: true,
                  allAxis: true,
                  x: true,
                  y: true,
                  z: true
              }
          }
      }

    this.initRequiredSparkModules()
    this.createCWorld(gravity)

  }

  initRequiredSparkModules() {
    this.Time = require('Time')
    this.C = require('cannon')
    this.Diagnostics = require('Diagnostics')
  }

  createCWorld(g) {
    this.world = new this.C.World()
    this.world.broadphase = new this.C.NaiveBroadphase()

    this.world.gravity.set( g.x, g.y, g.z )
  }

  beginSync() {
    // Copy original state of worldObjects

    this.initialWorldState = this.worldObjects
    // Create time interval loop for C 
    this.currentInterval = this.Time.setInterval(time => {
      if(this.lastTime !== undefined) {
        let deltaTime = (time - this.lastTime) / 1000
        this.world.step(this.fixedTimeStep, deltaTime, this.maxSubSteps)

        this.objectSync()
      }
      this.lastTime = time
    }, this.timeInterval)
  }

  objectSync() {
    this.worldObjects.forEach( wObj => {
      if(wObj.spark) {
        const syncParameters = wObj.sync
        const syncProps = syncParameters.properties
        const syncAxes = syncParameters.axes

        const rotation = {}
                                
        // write euler angles to rotation
        wObj.body.quaternion.toEuler(rotation)
    

        // this.log(syncParameters)

        syncProps.forEach(prop => {
          if(wObj.sync[prop].enabled) {
            syncAxes.forEach( axis => {
              if ( wObj.sync[prop].allAxis || wObj.sync[prop][axis] ) {
                const rotAxis = `rotation${axis.toUpperCase()}`

                if (prop == 'position') {
                  wObj.spark.transform[axis] = wObj.body[prop][axis]
                }
                if(prop == 'rotation') {
                  wObj.spark.transform[rotAxis] = rotation[axis]
                }
              }
            })
          }
        })
      }
    })
  }

  stopSync() {
    if(this.currentInterval) {
      this.Time.clearInterval(this.currentInterval)
      this.lastInterval = currentInterval
      this.currentInterval = undefined
    }
    this.resetWorldState()
  }

  getDefaults(key) {
      if(!key)
          return this.defaults
      else
          return this.defaults[key]
  }

  // Deep merge properties object filling missing values with defaults.  
  fillWithDefaults( props ) {
    const defaults = this.getDefaults()
    
    Object.keys(defaults).forEach(p => { // covers sync and body top level objects
      if(!props.hasOwnProperty(p))
        props[p] = defaults[p]

      Object.keys(defaults[p]).forEach(i => { // Going deep to sync and body
        if( Array.isArray(props[p][i]) ) { // properties and axes in sync object
          defaults[p][i].forEach( j => {
            if( props[p][i].indexOf(j) < 0 )
              props[p][i].push(defaults[p][i][j])
          })
        } else {
          if(!props[p].hasOwnProperty(i)) // Every other top level object inside sync and body
            props[p][i] = defaults[p][i]
          
          if(typeof defaults[p][i] == 'object' && !Array.isArray(defaults[p][i])) {
            Object.keys(defaults[p][i]).forEach(j => { // Nested object inside sync and body (such as transform)
              if(!props[p][i].hasOwnProperty(j))
                props[p][i][j] = defaults[p][i][j]
            })
          }
          
        }
      })
    })

    return props

  }

  resetWorldState() {
    if(this.initialWorldState) {
      this.worldObjects.forEach( (wObj, i) => {
        const originalWObj = this.initialWorldState[i]
        const originalBody = originalWObj.body
        const currentBody = wObj.body

        currentBody.velocity.setZero()
        currentBody.initVelocity.setZero()
        currentBody.angularVelocity.setZero()
        currentBody.initAngularVelocity.setZero()
    
        // Force
        currentBody.force.setZero()
        currentBody.torque.setZero()

        currentBody.quaternion = originalBody.quaternion
        currentBody.position = originalBody.position

        //Reset C object to original state
        
        
        if(wObj.spark) {
          const syncParameters = wObj.sync
          const syncProps = syncParameters.properties
          const syncAxes = syncParameters.axes
  
          const rotation = {}
                                  
          // write euler angles to rotation
          wObj.body.quaternion.toEuler(rotation)
          
  
          syncProps.forEach(prop => {
            if(wObj.sync[prop].enabled) {
              syncAxes.forEach( axis => {
                if ( wObj.sync[prop].allAxis || wObj.sync[prop][axis] ) {
                  const rotAxis = `rotation${axis.toUpperCase()}`

                  if (prop == 'position') {
                    wObj.spark.transform[axis] = originalWObj.spark.transform[axis]
                  }
                  if(prop == 'rotation') {  
                    wObj.spark.transform[rotAxis] = originalWObj.spark.transform[rotAxis]
                  }
                }
              })
            }
          })
        }
      })
    }
  }

  createObject( spObj, type, props) {
  

    const { sync, body } = this.fillWithDefaults(props)

    const { mass, radius, transform } = body

    const rotation = transform.rotation
    const scale = transform.scale
 
    const pos = transform.position
    const position = new this.C.Vec3(pos.x, pos.y, pos.z)

    
    const quaternion = new this.C.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    
    const buildShape = type => {
      switch(type) {
        case 'box':
          return new this.C.Box(new this.C.Vec3(scale.x, scale.y, scale.z))
          break
        case 'sphere':
          return new this.C.Sphere(radius)
          break
        case 'ground':
          return new this.C.Plane()
          break
      }
    }

    const buildProps = (shape) => {
      const bodyProps = {
        mass,
        shape,
        position,
        quaternion,
        // linearDamping: 0.1,
        angularDamping: 0.8
      }
      
      if(type == 'sphere')
        bodyProps.radius = radius

      if(type == 'ground')
        bodyProps.mass = 0

      return bodyProps
    }

    const buildBody = (type) => {
      const cBody = new this.C.Body(buildProps(buildShape(type)))
      if( type == 'ground') {
          // Rotate the ground so it is flat (facing upwards)
          const angle = -Math.PI / 2
          const xAxis = new this.C.Vec3(1, 0, 0)
          cBody.quaternion.setFromAxisAngle(xAxis, angle)
      }
      return cBody
    }

    const CObj = buildBody(type)

    return this.addObjectToPhysicsWorld(CObj, spObj, sync, type == 'ground')
  }

  find(type = 'object' | 'constraint', id) {
    if(type == 'object') return this.worldObjects.find( w => w.id == id )
    if(type == 'constraint') return this.worldConstraints.find( c => c.id == id )
  }
  /*
    {
      bodyA: Body
      bodyB: Body
      pivotA: { x: 0, y: 0, z: 0 }
      pivotB: { x: 0, y: 0, z: 0 }
      axisA: { x: 0, y: 0, z: 0 }
      axisB: { x: 0, y: 0, z: 0 }
      collideConnected: Boolean
    }
  */
  createConstraint(type, params = {}) {

    // We need at least two bodies to make a constraint.
    if ( !params.bodyA || !params.bodyB) return
    
    let { bodyA, bodyB, pivotA, pivotB, axisA, axisB } = params
    const options = {
      pivotA,
      pivotB,
      axisA,
      axisB
    }

    const tempA = this.find('object', bodyA)
    const tempB = this.find('object', bodyB)

    if (!tempA || !tempB) return
    
    let constraint 
    switch(type) {
      case 'point':
        constraint = new this.C.PointToPointConstraint(bodyA, pivotA, bodyB, pivotB)
        break
      case 'hinge':
        constraint = new this.C.HingeConstraint(bodyA, bodyB, options)
        break
      case 'conetwist':
        constraint = new this.C.ConeTwistConstraint(bodyA, bodyB, options)
        break
      case 'lock':
        constraint = new this.C.LockConstraint(pivotA, pivotB, {})
        break
      default:
        return
    }
    
    return this.addConstraint(constraint, tempA, tempB)
  }

  addConstraint(constraint, tempA, tempB) {

    if(!tempA.body || !tempB.body) return undefined

    const bodyA = tempA.body
    const bodyB = tempB.body
    
    this.world.addConstraint(constraint)

    // bodyA and bodyB id concatenation with base64 encoding.
    const id = btoa(`${bodyA.id}.${bodyB.id}`)

    this.worldConstraints.push({
      id,
      constraint,
      isActive = true
    })

    return id
  }

  removeConstraint(id, fullWipe = false) {
    const c = this.find('constraint', id)

    if(c) {
      this.world.removeConstraint(c.constraint)
    }

    if(!!fullWipe) {
      const idx = this.worldConstraints.indexOf(c)
      this.worldConstraints.splice(idx, 1)
    }

  }

  pauseConstraint(id) {
    const c = this.find('constraint', id)

    if(c) {
      this.removeConstraint(id, false)
    }

    const idx = this.worldConstraints.indexOf(c)
    this.worldConstraints[idx].isActive = false
  }

  resumeConstraint(id) {
    const c = this.find('constraint', id)
    const {id, constraint} = c

    if(c && c.isActive == false) {

      this.world.addConstraint(constraint)
      
      const idx = this.worldConstraints.indexOf(c)
      this.worldConstraints[idx].isActive = true
    }
  }

  log(string) {
    this.Diagnostics.log(string)
  }

  
  addObjectToPhysicsWorld(rbdBody, sparkObject, syncOptions, isGround) {
    this.world.addBody(rbdBody)
    const sync = { ...this.getDefaults('sync'), ...syncOptions }
    
    const id = generateUUID()
    
    const newObject = {
      id,
      body: rbdBody,
      spark: sparkObject, 
      sync,
      isGround
    }

    this.worldObjects.push(newObject)

    return id
  }

  createCMaterial(parameters) {
    let material = undefined 

    if (parameters == undefined) {
      material = new this.C.Material()
    }
    
    return material
  }

  start() {
    this.beginSync()
  }
}