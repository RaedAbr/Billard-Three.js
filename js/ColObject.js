class ColObject extends THREE.Mesh {
    constructor(geometry,material) {
        super(geometry,material);
        this.isFalling = false;
        this.gravDir = new THREE.Vector3(0,0,-1);
        this.gravDir.normalize();
        this.caster = new THREE.Raycaster();
        this.airTime = 0;
        this.startFallTime = 0;
        this.grav = -9.81;
        this.mass = 5;
        this.speedVector = new THREE.Vector3();
        this.velocity = new THREE.Vector3(0,0,0);
        this.isColliding = false;
        this.currentSpeed = 0 ;
    }

    ChangeDir(x,y,z) {
        this.velocity.x = x;
        this.velocity.y = y;
        this.velocity.z = z;
        this.velocity.normalize();
    }

    GetDirSpeed() {
        var vect = new THREE.Vector3();
        return vect.copy(this.velocity).multiplyScalar(this.currentSpeed);
    }

    OnUpdate(e) {
        this.position.add(this.speedVector.copy(this.velocity).multiplyScalar(DeltaTime ));
        if (this.isFalling) {
            this.airTime = (performance.now()/1000)/ this.startFallTime;
            var gravAcc = ((this.grav * this.mass) * 5 ) * this.airTime;
            this.velocity.setZ( (gravAcc * DeltaTime));
        }
    }

    CollisionUpdate(objects,fields) {
        var allObjects =  objects.concat(fields);
        this.caster.set(this.position,this.gravDir);
        var collisions = this.caster.intersectObjects(allObjects);

        if (collisions.length > 0 && collisions[0].distance <= 1) {
            this.velocity.setZ(0);
            this.isFalling = false;
        }
        else {
            if (this.isFalling == false) {
                this.startFallTime = performance.now()/1000;//this.clock.elapsedTime;
            }
            this.isFalling = true;
        }
    }
}
