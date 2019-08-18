window.onload = () => {
    var keyCodes = new Map([
        [37, "left"],
        [38, "up"],
        [39, "right"],
        [40, "down"],
        [87, "select"],
        [88, "cancel"]
    ]);
    var trackKeys = codes => {
        var pressed = new Map();
        codes.forEach(code => pressed.set(code, false));
        var handler = event => {
            if (codes.get(event.keyCode) !== undefined) {
                var down = event.type === "keydown";
                pressed.set(codes.get(event.keyCode), down);
                event.preventDefault();
            }
        };
        addEventListener("keydown", handler);
        addEventListener("keyup", handler);
        return pressed;
    };
    var keys = trackKeys(keyCodes);

    var overworld = [
        [
            '                ',
            '44              ',
            '  33333333333333',
            '  33333333333333',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
        ],
        [
            '                ',
            '44              ',
            '44              ',
            '44   44444      ',
            '44444     444111',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
        ],
        [
            '      111       ',
            '      111       ',
            '      111       ',
            '     41114      ',
            '44444     444   ',
            '             404',
            '              1 ',
            '              1 ',
            '             111',
            '             111',
            '             111',
            '                ',
        ],
        [
            '                ',
            '                ',
            '                ',
            '     4   4      ',
            '4444440004444   ',
            '44411111111144 4',
            '44411111111144 4',
            '44411111111144 4',
            '4441111111114   ',
            '4441111111110   ',
            '4441111111114   ',
            '4444444444444444',
        ],
        [
            '                ',
            '                ',
            '                ',
            '     4   4      ',
            '  4444   4444   ',
            '  4         44 4',
            '  4         44 4',
            '  4         44 4',
            '  4         4   ',
            '  4             ',
            '  4         4   ',
            '  44444444444444',
        ],
    ];

    var game = new Level(overworld);
    var display = new Display(game);

    var frame = () => {
        game.update(keys);
        display.update();
        requestAnimationFrame(frame);
    };
    frame();
}