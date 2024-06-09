<script>
    import OvenLiveKit from 'ovenlivekit';
    import { Button, A, Toast } from 'flowbite-svelte';
    import { onDestroy } from "svelte";

    export let streamName;

    let viewers = '-';
    let bitrate = '-';
    let status = 'OFFLINE';
    let mediaStream; // Declare a variable to store the MediaStream object
    let localVideoElement;

    document.title = "Stream - Hosting"

    // stats endpoints:
    // viewer and bitrate: https://v.zj.is/v?stream=${streamName}
    // is stream alive: https://v.zj.is/s?stream=${streamName}
    // viewer and bitrate format: {"bitrate": 3996776,"viewers": 3}

    // start streaming
    let ovenLivekit = OvenLiveKit.create();
    const startStreaming = () => {
        ovenLivekit.getDisplayMedia({
            audio: {
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false,
                sampleRate: 48000,
                channelCount: 2,
                volume: 1.0
            },
            video: true
        }).then(function (stream) {
            mediaStream = stream; // Store the MediaStream object
            // set your OvenMediaEngine's WebRTC Provider URL
            ovenLivekit.startStreaming(`wss://v.zj.is/app/${streamName}?direction=send&transport=tcp`);
            updateStatsInterval = setInterval(updateStats, 2500);

            // bind the new video object
            const localVideo = document.getElementById('localVideo');
            localVideoElement.srcObject = mediaStream;

            // handle some events for streaming ending
            mediaStream.oninactive = handleStopSharing;
            mediaStream.getVideoTracks()[0].onended = function () {handleStopSharing()};
        });
    };

    // stop streaming
    const stopStreaming = () => {
        ovenLivekit.stopStreaming();
        clearInterval(updateStatsInterval); // Stop updating stats when streaming stops
        status = 'OFFLINE';
        bitrate = '-';
        viewers = '-';
        localVideoElement.srcObject = null;

        // clear stream end handles
        if (mediaStream) {
            mediaStream.oninactive = null;
            mediaStream.getVideoTracks()[0].onended = null;
        }
    }

    // Handle the 'inactive' event
    const handleStopSharing = () => {
        console.log("inactive event fired")
        stopStreaming();
    };

    let updateStatsInterval;

    // update bitrate and viewers values
    const updateStats = () => {
        fetch(`https://v.zj.is/v?stream=${streamName}`)
            .then(response => response.json())
            .then(data => {
                bitrate = (data.bitrate / 1000000).toFixed(2);
                viewers = data.viewers;
            })
            .catch(error => {
                console.error('Error fetching stats:', error);
            });

        updateStatus();
    }

    // update status value
    const updateStatus = () => {
        fetch(`https://v.zj.is/s?stream=${streamName}`)
            .then(response => {
                if (response.status === 204) {
                    status = 'LIVE';
                } else {
                    status = 'OFFLINE';
                }
            })
            .catch(error => {
                console.error('Error fetching status:', error);
                status = 'OFFLINE';
                clearInterval(updateStatsInterval);
                // Handle the error, e.g., display an error message to the user
            });
    };

    onDestroy(() => {
        stopStreaming();
    });
</script>

<div class="container">
    <div class="video-container">
        <video id="localVideo" autoplay muted bind:this={localVideoElement}></video>
    </div>
    <div class="buttons-container">
        {#if status === "OFFLINE"}
            <Button color="green" on:click={startStreaming}>Start Streaming</Button>
        {:else }
            <Button color="red" on:click={stopStreaming}>Stop Streaming</Button>
        {/if}
    </div>
    <div class="info-container">
        <span>Viewers: {viewers}</span> |
        <span>Ingest Bitrate: {bitrate} Mbps</span><br />
        <span>Your URL: <A target="_blank" href="https://v.zj.is/{streamName}">https://v.zj.is/{streamName}</A></span>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .video-container {
        margin-bottom: 20px;
    }

    #localVideo {
        width: 320px;
        height: 240px;
    }

    .buttons-container {
        margin-bottom: 10px;
    }

    .info-container {
        text-align: center;
    }</style>