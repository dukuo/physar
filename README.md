<p style="text-align:center">
  <img src="assets/physar_logo.png">
</p>

<p style="text-align:center">Cannon.js physics for your Spark AR projects.</p>

<br />
<h2>Enhance your projects with cannon.js Physics!</h2>
<p>This project is in alpha stage, with a working implementation for sphere, box and ground shapes. More documentation soon.</p>

<h3 class="install">Installation</h3>

<p style="text-align:center"><code>npm install physar</code></p>

<h3>Usage</h3>
Physar works by creating a Physics world and mirroring your Spark objects in this world. After that, computations are done with all the physics elements and in turn Spark objects are updated with their respective positions and rotations. For each of your scene objects you must create an equal physics object in your code. 

After [installing](#install) import Physar to your code:

```js
import Physar from 'physar'
```

Add Spark's `Scene` module reference to add your objects from Spark.

```js
const Scene = require('Scene');
```

Initialize the physics world:

```js
const gravity = {
    x: 0,
    y: -9.82,
    z: 0
};
const physar = new Physar(gravity);
```
<i>-9.82 m/s<sup>2</sup> is the average measure of the strength of Earth's gravitational field. You can set a higher negative or positive value no any axis to enhance the strength and direction of the physics in your scene.</i>

Import your spark object reference. In this case, a sphere that was imported from the AR Library:
```js
const sphere = Scene.root.find('SphereObject')
```
Where `SphereObject` is the name of the object in your scene. 

Add a plane to your Spark AR scene to create a ground. In this example the plane is called `plane01`. Reference it in your code:

```js
const groundPlane = Scene.root.find('plane01');
```

Next, setup object properties for each of the spark objects you want to enable physics for:

```js
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
```

You could add no props, but by setting it like above you can create an initial position and rotation for your objects, as well as `mass` or `radius` properties (more about it soon). By default all axis of `position` and `rotation` are synchronized between Spark and Physar. 

You can also add synchronization settings to constraint movement of your spark objects, more on that soon. 

Now that we have our properties, we can add the object the object to the physics world. But first, let's add a ground plane so that our objects don't fall infinitely in your scene. 

```js

physar.createObject(groundPlane, 'ground', {});

```

Add the sphere object with its properties to the world:

```js
physar.createObject(sphere, 'sphere', sphereProps);
```

And finally, start the physics simulation:

```js
physar.start();
```

The sphere should have physics now!


<h3>Examples</h3>

<p>Check <code>examples/spark</code> for a basic physics examples with spheres and boxes.</p>