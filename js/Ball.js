class Ball extends ColObject {
    constructor(geometry,material) {
        super(geometry,material);
        this.radius = geometry.parameters.radius;
        this.ballNr = 0;
        this.mass = 1;
    }

    OnUpdate(e) {
        this.velocity.multiplyScalar(0.99);
        if (this.velocity.length() < 2) {
            this.velocity.set(0,0,0);//stop
        }
        this.rotateX(this.velocity.x * DeltaTime );
        this.rotateZ(-this.velocity.y * DeltaTime);
        super.OnUpdate(e);
    }

    CollisionUpdate(objects,fields) {
        for(var i = 0; i < objects.length; i++) {
            if (objects[i].geometry != null && objects[i] != this) {
                if (this.position.x + this.radius + objects[i].radius > objects[i].position.x
                    && this.position.x < objects[i].position.x + this.radius + objects[i].radius
                    && this.position.y + this.radius + objects[i].radius > objects[i].position.y
                    && this.position.y < objects[i].position.y + this.radius + objects[i].radius) {
                    
                    var distance = Math.sqrt( ((this.position.x - objects[i].position.x) *(this.position.x - objects[i].position.x) )
                    + (this.position.y - objects[i].position.y) *(this.position.y - objects[i].position.y) );
                    
                    if (distance < this.radius + objects[i].radius) {
                        var diff = new THREE.Vector3();
                        diff.subVectors(this.position,objects[i].position);

                        var normal = new THREE.Vector3();
                        normal.copy(diff).divideScalar(distance);

                        var velocityDelta = new THREE.Vector3();
                        velocityDelta.subVectors(objects[i].velocity,this.velocity);

                        var dot = velocityDelta.dot(normal);
                        if (dot > 0) {
                            new OneShotAudio(audioSources.ballBallHit);
                            var coefficient = 0.5;
                            var impulseStrength = (coefficient) * dot * (1 / this.mass + 1 / objects[i].mass);
                            
                            var impulse = new THREE.Vector3();
                            impulse.copy(normal).multiplyScalar(impulseStrength);
                            this.velocity.x += impulse.x / this.mass;
                            this.velocity.y += impulse.y / this.mass;

                            objects[i].velocity.x -= impulse.x /objects[i].mass;
                            objects[i].velocity.y -= impulse.y /objects[i].mass;

                            this.position.set(this.position.x +(this.velocity.x * DeltaTime), this.position.y + (this.velocity.y * DeltaTime), this.position.z);
                            objects[i].position.set(objects[i].position.x + (objects[i].velocity.x * DeltaTime), objects[i].position.y + (objects[i].velocity.y * DeltaTime),objects[i].position.z);
                            break;
                        }
                    }
                }
            }
        }

        // touching borders
        if (this.position.x > fields[0].position.x - 2
        || this.position.x < fields[1].position.x + 2) {
            this.velocity.x *= -1;
            new OneShotAudio(audioSources.ballEdgeHit, 0.2);
            this.position.set(this.position.x + this.velocity.x * DeltaTime,this.position.y + this.velocity.y * DeltaTime, this.position.z);
        }

        // touching other ball
        if (this.position.y < fields[2].position.y + 2
        || this.position.y > fields[3].position.y - 2) {
            this.velocity.y *= -1;
            new OneShotAudio(audioSources.ballEdgeHit, 0.2);
            this.position.set(this.position.x + this.velocity.x * DeltaTime,this.position.y + this.velocity.y * DeltaTime, this.position.z);
        }
    }
}
