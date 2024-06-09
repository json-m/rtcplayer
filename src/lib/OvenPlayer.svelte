<script>
    import { onMount } from 'svelte';
    import OvenPlayer from 'ovenplayer';


    export let streamName = '';
    export let autoplay = false;
    export let muted = false;
    export let controls = true;
    export let width = '100%';
    export let height = '400px';

    let player;

    document.title = `Stream - ${streamName}`

    onMount(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/ovenplayer@0.10.0/dist/ovenplayer.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            player = OvenPlayer.create('player', {
                sources: [
                    {
                        type: 'mp4',
                        file: `wss://v.zj.is/app/${streamName}?transport=tcp`,
                    },
                ],
                autoStart: autoplay,
                mute: muted,
                controls: controls,
            });
        };
    });
</script>

<div id="player" style="width: {width}; height: {height};" />