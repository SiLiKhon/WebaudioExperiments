class Slider {
    constructor(scene, low, high, value, x1, x2, y1, y2, label=null, color=0xff9900) {
        [this.x1, this.x2, this.y1, this.y2] = [x1, x2, y1, y2];
        var dx = x2 - x1;
        var dy = y2 - y1;
        var len = Math.sqrt(dx**2 + dy**2);
        var [dxUnit, dyUnit] = [dx / len, dy / len];
        var range = high - low;
        this.low = low;
        this.high = high;
        this.value = Phaser.Math.Clamp(value, low, high);
        var alpha = (this.value - low) / range;

        scene.add.line(
            x1, y1, 0, 0, dx, dy, color, 0.5
        ).setOrigin(0, 0);

        this.line = scene.add.line(
            x1, y1, 0, 0, alpha * dx, alpha * dy
        ).setStrokeStyle(4, color);
        this.line.setLineWidth(2);
        this.line.setOrigin(0, 0);

        scene.add.rectangle(
            (x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) + 40, Math.abs(y2 - y1) + 40, 0, 0
        ).setInteractive().on('pointerdown',  (p) => {
            
            var distToLine = Math.abs((p.downX - x1) * dyUnit - (p.downY - y1) * dxUnit);
            // console.log(label, p.downX, p.downY, distToLine);
            if (distToLine < 20) {
                var dist = Phaser.Math.Clamp(
                    (p.downX - x1) * dxUnit + (p.downY - y1) * dyUnit,
                    0, len
                );
                var alpha = dist / len;
                this.value = this.low + alpha * range;
                var newDX = dist * dxUnit;
                var newDY = dist * dyUnit;
                this.marker.x = x1 + newDX;
                this.marker.y = y1 + newDY;
                this.line.geom.x2 = newDX;
                this.line.geom.y2 = newDY;
    
                this.textValue.setText(this.value.toFixed(2));
            }
        });

        scene.add.circle(x1, y1, 5, color);
        scene.add.circle(x2, y2, 5, color);

        this.marker = scene.add.circle(
            x1 + alpha * dx,
            y1 + alpha * dy,
            15, Phaser.Display.Color.IntegerToColor(color).darken(70).color
        ).setInteractive();
        this.marker.setStrokeStyle(4, color);
        scene.input.setDraggable(this.marker);
        this.marker.on('drag', (p, dragX, dragY) => {
            var dragDX = dragX - x1;
            var dragDY = dragY - y1;
            var dist = Phaser.Math.Clamp(
                dragDX * dxUnit + dragDY * dyUnit,
                0, len
            );
            var alpha = dist / len;
            this.value = this.low + alpha * range;

            var newDX = dist * dxUnit;
            var newDY = dist * dyUnit;
            this.marker.x = x1 + newDX;
            this.marker.y = y1 + newDY;
            this.line.geom.x2 = newDX;
            this.line.geom.y2 = newDY;

            this.textValue.setText(this.value.toFixed(2));
        });

        if (label !== null) {
            this.textLabel = scene.add.text(x1 - 20 * dxUnit, y1 - 20 * dyUnit, label).setOrigin(
                0.5 + 0.5 * Phaser.Math.Clamp(dxUnit * 1.41, -1, 1),
                0.5 + 0.5 * Phaser.Math.Clamp(dyUnit * 1.41, -1, 1),
            );
        }
        this.textValue = scene.add.text(x2 + 20 * dxUnit, y2 + 20 * dyUnit, this.value.toFixed(2)).setOrigin(
            0.5 - 0.5 * Phaser.Math.Clamp(dxUnit * 1.41, -1, 1),
            0.5 - 0.5 * Phaser.Math.Clamp(dyUnit * 1.41, -1, 1),
        );
    }
};

export default Slider;
