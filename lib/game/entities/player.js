ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity',
    'game.entities.player-hat'
)
.defines(function() {
    EntityPlayer = ig.Entity.extend({
        
        size: {x: 8, y: 36},
        offset: {x: 36, y: 44},
        maxVel: {x: 200, y: 600},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 150,
        jump: 250,
        health: 6,
        //playerHat: null,
        isInvincible: false,
        animSheet: new ig.AnimationSheet('media/player.png', 80, 80),
        
        walking: false,
        jumping: false,
        falling: false,
        hurting: false,
        dying: false,
        attacking: false,
        attacking1: false,
        attacking2: false,
        attacking3: false,
        
        type: ig.Entity.TYPE.A, // add to friendly group
        checkAgainst: ig.Entity.TYPE.NONE, // check collisions against nothing
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
            // add the animations
            this.addAnim('idle', 1, [0], true);
            //this.addAnim('walk', 0.15, [7,8,9,10,11,6], false);
            this.addAnim('walk', 0.15, [6,7,8,9,10,11], false);
            this.addAnim('jump', 1, [1], true);
            this.addAnim('fall', 1, [2], true);
            this.addAnim('hurt', 1, [1], true);
            this.addAnim('dead', 1, [0], true);
            this.addAnim('attack1', 1, [12], true);
            this.addAnim('attack2', 1, [13], true);
            this.addAnim('attack3', 1, [14], true);
            
            // game instance of this entity
            ig.game.player = this;
            
            // start on a tile
            this.pos.y -= this.size.y;
            
            // add player hat
            //this.playerHat = ig.game.spawnEntity(EntityPlayerHat, this.pos.x, this.pos.y);
            
        },
        
        update: function() {
            
            if (ig.game.isPaused)
            {
                return;
            }
            
            this.checkStatus();
            this.checkPosition();
            this.parent();
            
            // update player hat
            //this.updatePlayerHat();
            
        },
        
        checkStatus: function() {
        
            // update direction facing
            if ( ! this.hurting && ! this.dying)
            {
                if (ig.input.state('left'))
                {
                    this.flip = true;
                }
                else if (ig.input.state('right'))
                {
                    this.flip = false;
                }
            }
            
            // toggle invincibility
            if (ig.input.pressed('invincible'))
            {
                this.isInvincible = this.isInvincible ? false : true;
            }
            
            // check entity status
            this.isHurting();
            this.isAttacking();
            this.isJumping();
            this.isMoving();
            this.animate();
            
        },
        
        // check if hurting
        isHurting: function() {
            
            // if dying, kill this entity when the animation ends
            if (this.dying)
            {
                if (this.currentAnim == this.anims.dead)
                {
                    if (this.currentAnim.loopCount)
                    {
                        this.kill();
                    }
                }
            }
            
            // if hurting, stop hurting when the animation ends
            if (this.hurting)
            {
                if (this.currentAnim == this.anims.hurt)
                {
                    if (this.currentAnim.loopCount)
                    {
                        this.hurting = false;
                    }
                }
            }
            
        },
        
        // check if attacking
        isAttacking: function() {
            
            if (this.hurting || this.dying)
            {
                this.attacking = false;
                return;
            }
            
            this.attacking1 = false;
            this.attacking2 = false;
            this.attacking3 = false;
            
            // if just pressed the "ATTACK" button
            if (this.standing && ig.input.state('attack'))
            {
                this.attacking = true;
                this.vel.x = 0;
                
                if (ig.input.state('up') && ig.input.state('right'))
                {
                    this.attacking2 = true;
                }
                else if (ig.input.state('up') && ig.input.state('left'))
                {
                    this.attacking2 = true;
                }
                else if (ig.input.state('up'))
                {
                    this.attacking3 = true;
                }
                else
                {
                    this.attacking1 = true;
                }
                
            }
            else if (this.attacking)
            {
                this.attacking = false;
            }
            
        },
        
        // check if jumping
        isJumping: function() {
            
            if (this.hurting || this.dying)
            {
                this.jumping = false;
                this.falling = false;
                return;
            }
            
            // if standing on something and just pressed "JUMP" button
            if (this.standing && ig.input.pressed('jump'))
            {
                this.jumping = true;
                this.vel.y = -this.jump;
                return;
            }
            
            // reduce jumping height
            if (this.jumping && ig.input.released('jump'))
            {
                this.vel.y = (this.vel.y / 2);
            }
            
            // if falling
            if (this.vel.y > 0 && ! this.standing)
            {
                if (this.vel.y > 80)
                {
                    this.falling = true;
                    return;
                }
            }
            
            // if standing on something while jumping/falling
            if ((this.jumping || this.falling) && this.standing)
            {
                this.jumping = false;
                this.falling = false;
            }
        },
        
        // checking if idle or moving left/right
        isMoving: function() {
        
            if (this.hurting || this.dying || this.attacking)
            {
                this.walking = false;
                return;
            }
            
            if (ig.input.state('left'))
            {
                this.walking = true;
                this.vel.x = -this.speed;
            }
            else if (ig.input.state('right'))
            {
                this.walking = true;
                this.vel.x = this.speed;
            }
            else
            {
                this.walking = false;
                this.vel.x = 0;
            }
            
        },
        
        // update entity animation
        animate: function() {
            
            // update entitiy opacity
            if (this.hurting || this.isInvincible)
            {
                this.currentAnim.alpha = 0.5;
            }
            else if (this.currentAnim.alpha < 1)
            {
                this.currentAnim.alpha = 1;
            }
            
            // update animation state
            if (this.dying)
            {
                if (this.currentAnim != this.anims.dead)
                {
                    this.currentAnim = this.anims.dead.rewind();
                }
            }
            else if (this.hurting)
            {
                if (this.currentAnim != this.anims.hurt)
                {
                    this.currentAnim = this.anims.hurt.rewind();
                }
            }
            else if (this.attacking1)
            {
                if (this.currentAnim != this.anims.attack1)
                {
                    this.currentAnim = this.anims.attack1.rewind();
                }
            }
            else if (this.attacking2)
            {
                if (this.currentAnim != this.anims.attack2)
                {
                    this.currentAnim = this.anims.attack2.rewind();
                }
            }
            else if (this.attacking3)
            {
                if (this.currentAnim != this.anims.attack3)
                {
                    this.currentAnim = this.anims.attack3.rewind();
                }
            }
            else if (this.falling)
            {
                if (this.currentAnim != this.anims.fall)
                {
                    this.currentAnim = this.anims.fall.rewind();
                }
            }
            else if (this.jumping)
            {
                if (this.currentAnim != this.anims.jump)
                {
                    this.currentAnim = this.anims.jump.rewind();
                }
            }
            else if (this.walking)
            {
                if (this.currentAnim != this.anims.walk)
                {
                    this.currentAnim = this.anims.walk.rewind();
                }
            }
            else
            {
                if (this.currentAnim != this.anims.idle)
                {
                    this.currentAnim = this.anims.idle.rewind();
                }
            }
            
            // update facing direction
            this.currentAnim.flip.x = this.flip;
            
        },
        
        // add player hat
        /*updatePlayerHat: function() {
            
            if (this.playerHat)
            {
                this.playerHat.updatePosition(this);
            }
            
        },*/
        
        // check if this entity needs repositioned
        checkPosition: function() {
            
            // if this entity has moved off the map
            if (this.pos.x < ig.game.camera.offset.x.min)
            {
                this.pos.x = (ig.game.collisionMap.pxWidth - ig.game.camera.offset.x.max - (this.size.x * 2));
            }
            else if ((this.pos.x + this.size.x) > (ig.game.collisionMap.pxWidth - ig.game.camera.offset.x.max))
            {
                this.pos.x = (ig.game.camera.offset.x.min + this.size.x);
            }
            
            // if this entity has fallen off the map
            if (this.pos.y > ig.game.collisionMap.pxHeight)
            {
                this.pos.y = 0;
            }
            
        },
        
        // called when overlapping with an entity whose .checkAgainst property matches this entity
        receiveDamage: function(amount, from) {
        
            if (this.hurting || this.dying || this.isInvincible)
            {
                return;
            }
            
            /*
            // reduce health
            this.health -= amount;
            
            // if dead
            if (this.health <= 0)
            {
                this.vel.x = 0;
                this.vel.y = 0;
                this.maxVel.x = 0;
                this.maxVel.y = 0;
                this.dying = true;
                return true;
            }
            
            // update state
            this.hurting = true;
            
            // apply knockback
            this.vel.x = (from.pos.x > this.pos.x) ? -200 : 200;
            this.vel.y = -150;
            */
            
            return true;
            
        }
        
    });
});