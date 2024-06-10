<script>
  import { onMount } from 'svelte';
  import { Button, Spinner, Toast, Badge } from 'flowbite-svelte'
  import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
  import OvenPlayer from "./lib/OvenPlayer.svelte";
  import Landing from "./lib/Landing.svelte";
  import Capture from "./lib/Capture.svelte";
  import {fade} from "svelte/transition";

  let streamName = ''; // Initialize with an empty string
  let streamExists = true;
  let loading = true;

  async function checkStreamExists() {
    const response = await fetch(`https://v.zj.is/s?stream=${streamName}`);

    if (response.status === 204) {
      console.log('Stream exists');
      streamExists = true;
    } else {
      console.log('Stream does not exist');
      streamExists = false;
    }
    loading = false;
  }

  onMount(async () => {
    // Get the stream name from the URL path
    const path = window.location.pathname;
    const urlStreamName = path.split('/').pop();
    if (urlStreamName) {
      streamName = urlStreamName;
      await checkStreamExists();
    } else {
      loading = false;
    }
  });

  let playerReady = false;
  let toastVisible = true;

  let counter = 10;
  function handlePlayerReady() {
    playerReady = true;
    toastVisible = true; // Show the toast when the player is ready

    counter = 10;
    timeout();

    startViewerCountUpdate(); // Start updating the viewer count
  }

  function timeout() {
    if (--counter > 0) return setTimeout(timeout, 1000);
    toastVisible = false;
  }

  let viewerCount = 0;

  async function fetchViewerCount() {
    try {
      const response = await fetch(`https://v.zj.is/v?stream=${streamName}`);
      const data = await response.json();
      viewerCount = data.viewers;
    } catch (error) {
      console.error('Error fetching viewer count:', error);
    }
  }

  function startViewerCountUpdate() {
    fetchViewerCount();
    setInterval(fetchViewerCount, 2500);
  }



  //$: videoUrl = `wss://v.zj.is/app/${streamName}?transport=tcp`;

</script>

<main>
  {#if loading}
    <div><Button color="dark"><Spinner class="me-3" size="4" />Loading ...</Button></div>
  {:else if streamName && streamExists}
    <div class="player-wrapper">
      <div id="player_id">
        <OvenPlayer {streamName} autoplay={true} muted={true} onReady={handlePlayerReady} />
      </div>
    </div>
  {:else if streamName && !streamExists}
    <Capture {streamName} />
  {:else}
    <Landing />
  {/if}

  {#if playerReady}
    <div class="toast-container">
      <Toast color="orange" bind:open={toastVisible} transition={fade}>
        <svelte:fragment slot="icon">
          <ExclamationCircleSolid class="w-5 h-5" />
          <span class="sr-only">Warning</span>
        </svelte:fragment>
        ↓ Unmute here ↓
      </Toast>
    </div>
    <div class="badge-container">
      <Badge dismissable border color="red">{viewerCount} Viewers</Badge>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: black;
  }

  main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .player-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 177.78vh; /* Calculated based on 16:9 aspect ratio (16 / 9 = 1.7778) */
    max-height: 56.25vw; /* Calculated based on 16:9 aspect ratio (9 / 16) */
    margin: auto;
  }

  #player_id {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .toast-container {
    position: absolute;
    bottom: 7vh;
    left: 20px;
    z-index: 9999;
  }

  .badge-container {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 9999;
  }
</style>