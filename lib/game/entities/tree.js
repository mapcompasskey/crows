ig.module(
    'game.entities.tree'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityTree = ig.Entity.extend({
        
        size: {x: 0, y: 0},
        offset: {x: 0, y: 0},
        maxVel: {x: 0, y: 0},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 0,
        jump: 0,
        imgTree: new ig.Image('media/tree.png'),
        
        type: ig.Entity.TYPE.A, // add to friendly group
        checkAgainst: ig.Entity.TYPE.NONE, // check collisions against nothing
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
            // start on a tile
            this.pos.y -= this.imgTree.height;
            
        },
        
        draw: function() {
        
            this.imgTree.draw(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y);
            
        },
        
    });
});