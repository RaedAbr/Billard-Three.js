class Main {
    constructor () {
        this.sceneRenderer = new SceneRenderer();
        this.sceneRenderer.CreateScene();
        this.start = false;
        this.loader = new THREE.TextureLoader();
        
        this.player1 = new Player("Player 1");
        this.player2 = new Player("Player 2");

        /*Resetable Variables */
        this.entered = false;
        this.fallenFirst = [];

        this.currentPlayersTurn = this.player1;
        $('#player1_name').css({color: "#bd2323"});
        this.turnEnd = false;
        this.ballsStopped = true;
        this.ballInHole = false;
        this.playerShot = false;
        this.WhiteBallInHole = false;
        this.gameDone = false;

        this.balls = new Array();
        //this.balls[0] is main ball
        this.SpawnBall(0,-20,"BallCue.jpg",0);
        this.mouse = new Mouse(this.balls[0],this.sceneRenderer.camera);
        document.addEventListener("onshoot",(e)=> {this.OnShoot(e);});
        this.sceneRenderer.AddObject(this.mouse.line);
        this.SpawnAllBalls();

        /*Light */
        var light = new THREE.AmbientLight( 0xffffff,0.5);
        light.position.set( 0, 1, 1 );
        this.sceneRenderer.AddObject(light);

        var light = new THREE.PointLight(0xffffff);
        light.castShadow = true;
        light.position.set( 0, 0, 20 );
        this.sceneRenderer.AddObject(light);

        var light2 = new THREE.PointLight(0xffffff);
        light2.castShadow = true;
        light2.position.set( 0, -20, 20 );
        this.sceneRenderer.AddObject(light2);

        // walls
        var material = new THREE.MeshLambertMaterial();
        material.map = this.loader.load("assets/textures/wall1.jpg", function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 10, 10 );
        } );
        var geometry = new THREE.BoxGeometry(1,400,400);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(100,0,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);

        var geometry = new THREE.BoxGeometry(400,1,400);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(0,100,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);

        var geometry = new THREE.BoxGeometry(400,1,400);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(0,-100,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);

        var geometry = new THREE.BoxGeometry(1,400,400);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(-100,0,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);

        /*field*/
        this.fieldObjects = new Array();
        var geometry = new THREE.BoxGeometry(2,60,2);
        var material = new THREE.MeshLambertMaterial();
        material.map = this.loader.load("assets/textures/wood.jpg");

        var box = new THREE.Mesh(geometry,material);
        box.position.set(20,0,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(2,60,2);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(-20,0,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(40,2,2);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(0,-30,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(40,2,2);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(0,30,0);
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var floorHeight = 20;

        //feets
        var geometry = new THREE.BoxGeometry(2,2,floorHeight);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(20,30,-(floorHeight/2));
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(2,2,floorHeight);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(-20,30,-(floorHeight/2));
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(2,2,floorHeight);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(20,-30,-(floorHeight/2));
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        var geometry = new THREE.BoxGeometry(2,2,floorHeight);
        var box = new THREE.Mesh(geometry,material);
        box.position.set(-20,-30,-(floorHeight/2));
        box.receiveShadow = true;
        box.castShadow = true;
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        //floor
        var material = new THREE.MeshLambertMaterial();
        material.map = this.loader.load("assets/textures/floor.jpg", function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 20, 20 );
        } );
        var geometry = new THREE.PlaneGeometry(500, 500);
        var plane = new THREE.Mesh(geometry,material);
        plane.position.set(0,0,-floorHeight);
        plane.receiveShadow = true;
        plane.castShadow = true;
        this.sceneRenderer.AddObject(plane);
        this.fieldObjects.push(plane);

        //table floor
        var geometry = new THREE.BoxGeometry(40,60,1);
        var material = new THREE.MeshLambertMaterial();
        material.map = this.loader.load("assets/textures/test.jpg", function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 2, 5 );
        } );

        var box = new THREE.Mesh(geometry,material);
        box.position.set(0,0,-1);
        box.receiveShadow = true;
        box.castShadow = true;
        
        this.sceneRenderer.AddObject(box);
        this.fieldObjects.push(box);

        //Holes
        this.holeBalls = Array();
        this.SpawnHoleBall(18,28);
        this.SpawnHoleBall(-18,-28);
        this.SpawnHoleBall(18,-28);
        this.SpawnHoleBall(-18,28);
        this.SpawnHoleBall(18,0);
        this.SpawnHoleBall(-18,0);
        document.addEventListener("onballinhole",(e)=> {this.OnBallInHole(e);});

        //Both
        this.allObjects = this.balls.concat(this.fieldObjects);
        
        //Events
        document.addEventListener("onrenderupdate",(e)=> {this.OnRenderUpdate(e);});
        document.addEventListener("oncollisionupdate",(e)=> {this.OnCollisionUpdate(e);});

        $(".start").click("onStartClick",(e)=> {this.OnStartClick(e);});
        this.sceneRenderer.Render();

        var peopleTalking = document.createElement('audio');
        peopleTalking.appendChild(audioSources.peopleTalking);
        peopleTalking.volume = 1;
        peopleTalking.loop = true;
        peopleTalking.play();

        var peopleTalking = document.createElement('audio');
        peopleTalking.appendChild(audioSources.envMusic);
        peopleTalking.volume = 0.4;
        peopleTalking.loop = true;
        peopleTalking.play();

    }

    OnBallInHole(e) {
        
        if (e.detail.ballNr == 0) {
            e.detail.position.set(0,-20,-20);
            e.detail.velocity.set(0,0,0);
            this.WhiteBallInHole = true;
            this.turnEnd = true;
            return;
        }

        if (e.detail.ballNr == 8) {
            if (this.HaveAllBallIn()) {
                $('#modal-body-text').html(this.currentPlayersTurn.name + " win the game !");
                $('#myModal').modal('show');
            }
            else {
                $('#modal-body-text').html(this.currentPlayersTurn.name + " lost the game !");
                $('#myModal').modal('show');
            }
            this.gameDone = true;
            this.Reset();
        }

        if (this.player1.ballSet == false || this.player2.ballSet == false) {
            if (e.detail.ballNr < 8) {
                this.player1.firstHalf = true;
            }
            else {
                this.player2.firstHalf = true;
            }

            this.player1.ballSet = true;
            this.player2.ballSet = true;
        }

        if (e.detail.ballNr > 8 && this.currentPlayersTurn.firstHalf
        || e.detail.ballNr < 8 && !this.currentPlayersTurn.firstHalf) {
            this.turnEnd = true;
        }

        var half_num = 0;
        var ball_num = e.detail.ballNr;
        if (e.detail.ballNr < 8) {
            half_num = 1;
        }
        else {
            half_num = 2;
            ball_num = e.detail.ballNr - 8;
        }
        $('#ball_' + e.detail.ballNr).fadeOut();

        if (!this.entered) {
            this.fallenFirst.push(e.detail.ballNr);
        }

        this.RemoveBall(e.detail);
        this.sceneRenderer.RemoveObject(e.detail);
        this.ballInHole = true;
    }

    OnRenderUpdate(e) {
        if (this.start == true  && !this.gameDone) {
            for (var i = 0; i < this.balls.length; i++) {
                this.balls[i].OnUpdate(e);
            }
            this.CameraControl();
            $(".speed").html("Power:" + this.mouse.power);

            if (this.ballsStopped) {
                if (this.playerShot) {
                    if (this.ballInHole == false) {
                        this.turnEnd = true;
                    }
                    this.playerShot = false;
                }
                if ((this.turnEnd)) {
                    if (this.currentPlayersTurn == this.player1) {
                        this.currentPlayersTurn = this.player2;
                        $('#player2_name').css({color: "#bd2323"});
                        $('#player1_name').css({color: "black"});
                    }
                    else {
                        this.currentPlayersTurn = this.player1;
                        $('#player1_name').css({color: "#bd2323"});
                        $('#player2_name').css({color: "black"});
                    }

                    this.turnEnd = false;
                }
                if (this.WhiteBallInHole) {
                    this.balls[0].position.set(0,-20,0);
                    this.WhiteBallInHole = false;
                }
            }

            function appendBalls(first, second, fallenFirst) {
                for (var i = 1; i <= 7; i++) {
                    if (!fallenFirst.includes(i)) {
                        $(first).append('<div class="ball" id="ball_'+i+'"></div>');
                    }
                }
                for (var i = 9; i <= 15; i++) {
                    if (!fallenFirst.includes(i)) {
                        $(second).append('<div class="ball" id="ball_'+i+'"></div>');
                    }
                }
            }

            var text = "Turn: <span style='color:#bd2323'>" + this.currentPlayersTurn.name + "</span>";
            if (this.currentPlayersTurn.ballSet == true) {
                if (!this.entered) {
                    this.entered = true;
                    if (this.currentPlayersTurn == this.player1) {
                        if (this.currentPlayersTurn.firstHalf == false) {
                            appendBalls('#player2_div', '#player1_div', this.fallenFirst);
                        }
                        else {
                            appendBalls('#player1_div', '#player2_div', this.fallenFirst);
                        }
                    }
                    else if (this.currentPlayersTurn == this.player2) {
                        if (this.currentPlayersTurn.firstHalf == false) {
                            appendBalls('#player1_div', '#player2_div', this.fallenFirst);
                        }
                        else {
                            appendBalls('#player2_div', '#player1_div', this.fallenFirst);
                        }
                    }
                }
                if (this.currentPlayersTurn.firstHalf == false) {
                    text = text + "\nShoot half balls";
                }
                else {
                    text = text + "\nShoot whole balls";
                }
            }
            else {
                text = text + "\nNo side picked";
            }
            $(".playerTurn").html(text);
        }
    }

    OnCollisionUpdate(e) {
        if (this.start == true) {
            this.ballsStopped = true;
            for (var i = 0; i < this.balls.length; i++) {
                this.balls[i].CollisionUpdate(this.balls,this.fieldObjects);

                if (this.balls[i].velocity.x != 0 || this.balls[i].velocity.y !=0 || this.balls[i].velocity.z != 0) {
                    this.ballsStopped =  false;
                }
            }

            for(var i = 0; i < this.holeBalls.length; i++) {
                this.holeBalls[i].CollisionUpdate(this.balls);
            }

            if (this.ballsStopped == true) {
                this.sceneRenderer.RemoveObject(this.mouse.line);
                this.sceneRenderer.RemoveObject(this.mouse.line2);
                this.mouse.OnMouseRayUpdate(this.allObjects , this.sceneRenderer.camera);
                this.sceneRenderer.AddObject(this.mouse.line);
                this.sceneRenderer.AddObject(this.mouse.line2);
            }
        }
    }

    OnShoot(e) {
        this.ballInHole = false;
        this.playerShot = true;
        this.ballsStopped =  false;
    }

    CameraControl() {
        if (keyboard.GetKey('q') == true) {
            this.sceneRenderer.RotateLeftRight(50*DeltaTime);
        }
        if (keyboard.GetKey('e') == true) {
            this.sceneRenderer.RotateLeftRight(-50*DeltaTime);
        }
        if (keyboard.GetKey('a') == true) {
            this.sceneRenderer.camera.translateX(-25 * DeltaTime);
        }
        if (keyboard.GetKey('d') == true) {
            this.sceneRenderer.camera.translateX(25 * DeltaTime);
        }
        if (keyboard.GetKey('s') == true) {
            this.sceneRenderer.ForwardBackward(25 * DeltaTime);
        }
        if (keyboard.GetKey('w') == true) {
            this.sceneRenderer.ForwardBackward(-25 * DeltaTime);
        }
    }

    Reset() {
        this.currentPlayersTurn = this.player1;
        $(".playerTurn").html("");

        this.turnEnd = false;
        this.ballsStopped = true;
        this.ballInHole = false;
        this.playerShot = false;
        this.WhiteBallInHole = false;
        this.gameDone = false;
        this.RemoveAllBalls();
        this.SpawnBall(0,-20,"BallCue.jpg",0);
        this.mouse.mainBall = this.balls[0];
        this.SpawnAllBalls();
        this.allObjects = this.balls.concat(this.fieldObjects);
        this.start = false;
        $(".start").show();
        $("#player1_div").empty();
        $("#player2_div").empty();
        this.canShoot = false;
        this.entered = false;
        this.fallenFirst = [];
    }

    SpawnAllBalls() {
        var ballCount = 1;
        for(var i = 0; i < 5; i++) {
            var x = -4 + i * 2;
            var y = 4;
            this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
            ballCount ++;
        }
        for(var i = 0; i < 4; i++) {
            var x = -3 + i * 2;
            var y = 2;
            this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
            ballCount ++;
        }
        for(var i = 0; i < 3; i++) {
            var x = -2 + i * 2;
            var y = 0;
            this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
            ballCount ++;
        }
        for(var i = 0; i < 2; i++) {
            var x = -1 + i * 2;
            var y = -2;
            this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
            ballCount ++;
        }

        var x =  0;
        var y = -4;
        this.SpawnBall(x,y,"Ball"+ballCount +".jpg",ballCount);
    }

    RemoveAllBalls() {
        for(var i = 0; i < this.balls.length; i++) {
            this.sceneRenderer.RemoveObject(this.balls[i]);
        }
        this.balls = new Array();
    }

    SpawnBall(x,y,textureName,ballNr) {
        var geometry = new THREE.SphereGeometry(1,12,12);
        var material = new THREE.MeshPhongMaterial();
        material.map = this.loader.load("assets/textures/" + textureName);

        var ball = new Ball(geometry,material);
        var ballPosZ = 0;
        ball.position.set(x,y, ballPosZ);
        ball.ballNr = ballNr;

        ball.receiveShadow = true;
        ball.castShadow = true;
        this.sceneRenderer.AddObject(ball);
        this.balls.push(ball);
    }

    SpawnHoleBall(x,y) {
        var geometry = new THREE.SphereGeometry(2,12,12);
        var material = new THREE.MeshLambertMaterial();
        material.color.setHex("0x000000");
        var holeBall = new HoleBall(geometry,material);
        holeBall.position.set(x,y,-1);
        this.sceneRenderer.AddObject(holeBall);
        this.holeBalls.push(holeBall);
    }

    HaveAllBallIn() {
        for(var i = 0; i < this.balls.length; i++) {
            if (this.balls[i].ballNr < 8 && this.currentPlayersTurn.firstHalf
                || this.balls[i].ballNr > 8 && !this.currentPlayersTurn.firstHalf) {
                return false;
            }
        }
        return true;
    }

    RemoveBall(ball) {
        for(var i = 0; i < this.balls.length; i++) {
            if (this.balls[i] == ball) {
                this.balls.splice(i,1);
                break;
            }
        }
    }

    OnStartClick(e) {
        this.start = true;
        $(".start").hide();
        this.mouse.Init();
    }

}
new Main();
