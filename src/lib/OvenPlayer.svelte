<script>
    import { onMount } from 'svelte';
    import OvenPlayer from 'ovenplayer';


    export let streamName = '';
    export let autoplay = false;
    export let muted = false;
    export let controls = true;
    export let width = '100%';
    export let height = '400px';
    export let onReady = () => {};

    let player;

    document.title = `Stream - ${streamName}`

    onMount(() => {
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
        onReady(); // Call the onReady prop when the player is ready
    });
</script>

<div id="player" style="width: {width}; height: {height};" />