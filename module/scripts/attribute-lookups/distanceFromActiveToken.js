const getActiveToken = () => {
    const speaker = ChatMessage.getSpeaker();
    if(!speaker.scene || !speaker.token) {
        return null;
    }
    const scene = game.scenes.get(speaker.scene);
    if(!scene) {
        return null;
    }
    const tokenDocument = scene.tokens.get(speaker.token);
    return tokenDocument?.object || null;
};

export default [
    {
      icon: () => {
        return 'ruler';
      },
      label: () => {
        return game.i18n.localize('Distance');
      },
      value: (actor, token) => {
        const activeToken = getActiveToken();
        if(!activeToken) {
            return null;
        }
        const ttRect = token.bounds;
        const atRect = activeToken.bounds;
        let ttPos = { x: token.center.x, y: token.center.y };
        let atPos = { x: activeToken.center.x, y: activeToken.center.y };
        if(ttRect.width > canvas.grid.size) {
            if(ttRect.right < atRect.left) {
                ttPos.x = ttRect.right - canvas.grid.size / 2;
            } else if ( ttRect.left > atRect.right ) {
                ttPos.x = ttRect.left + canvas.grid.size / 2;
            } else {
                ttPos.x = atPos.x;
            }
        }
        if(ttRect.height > canvas.grid.size) {
            if(ttRect.bottom < atRect.top) {
                ttPos.y = ttRect.bottom - canvas.grid.size / 2;
            } else if ( ttRect.top > atRect.bottom ) {
                ttPos.y = ttRect.top + canvas.grid.size / 2;
            } else {
                ttPos.y = atPos.y;
            }
        }
        if(atRect.width > canvas.grid.size) {
            if(atRect.right < ttRect.left) {
                atPos.x = atRect.right - canvas.grid.size / 2;
            } else if ( atRect.left > ttRect.right ) {
                atPos.x = atRect.left + canvas.grid.size / 2;
            } else {
                atPos.x = ttPos.x;
            }
        }
        if(atRect.height > canvas.grid.size) {
            if(atRect.bottom < ttRect.top) {
                atPos.y = atRect.bottom - canvas.grid.size / 2;
            } else if ( atRect.top > ttRect.bottom ) {
                atPos.y = atRect.top + canvas.grid.size / 2;
            } else {
                atPos.y = ttPos.y;
            }
        }
        const distance = canvas.grid.measureDistance(ttPos, atPos, { gridSpaces: true });
        
        return `${distance} ${canvas.scene.grid.units}`;
      },
    },
];