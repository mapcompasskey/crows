ig.module(
    'game.entities.player-hat'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityPlayerHat = ig.Entity.extend({
        
        size: {x: 19, y: 19},
        offset: {x: 0, y: 0},
        maxVel: {x: 0, y: 0},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 0,
        jump: 0,
        animSheet: new ig.AnimationSheet('media/player-hat.png', 19, 19),
        
        type: ig.Entity.TYPE.A, // add to friendly group
        checkAgainst: ig.Entity.TYPE.NONE, // check collisions against nothing
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
            // add the animations
            this.addAnim('idle', 1, [0], true);
            
        },
        
        update: function() {
            
            if (ig.game.isPaused)
            {
                return;
            }
            
            // update facing direction
            this.currentAnim.flip.x = this.flip;
            
            this.parent();
            
        },
        
        updatePosition: function(other) {
            
            var pt = {x: 0, y: 0};
            pt.x = (other.pos.x + (other.size.x / 2) - (this.size.x / 2));
            pt.y = (other.pos.y - this.size.y + 5);
            
            this.pos.x = pt.x;
            this.pos.y = pt.y;
            
        },
        
    });
});